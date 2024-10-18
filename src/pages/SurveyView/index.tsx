import Parser from 'html-react-parser';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import sgdLogo from '@/assets/sgd_kien_giang.jpg';
import { Waiting } from '@/components';
import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { createResponse } from '@/features/responses/api';
import { QuestionView } from '@/features/surveys/components/questions/view';
import { useSurveyStore } from '@/features/surveys/hooks';
import formatError from '@/utils/formatError';

export default function SurveyView() {
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [responses, setResponses] = useState<
    CustomObject<string | string[] | string[][]>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const { surveyData, getSurvey } = useSurveyStore(
    useShallow((state) => ({
      getSurvey: state.getSurveys,
      surveyData: state.surveys?.[id!],
    }))
  );

  useEffect(() => {
    if (!surveyData) {
      getSurvey(id!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResponseChange = (path: (string | number)[], value: any) => {
    setResponses((prev) => {
      const updateValue = _.cloneDeep(prev);
      _.set(updateValue, path, value);
      return updateValue;
    });
  };

  const checkValidation = () => {
    const newErrors: Record<string, string> = {};
    Object.entries(surveyData?.questions ?? {}).forEach(
      ([questionId, question]) => {
        if (question.required && !responses[questionId]) {
          newErrors[questionId] = 'Đây là câu hỏi bắt buộc';
        }
      }
    );
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!checkValidation()) {
        toast({
          title: 'Thiếu thông tin',
          description: 'Có thông tin bị thiếu vui lòng kiểm tra lại',
          variant: 'destructive',
        });
        return;
      }
      const data = {
        surveyId: id,
        answers: JSON.stringify(responses),
      };
      const result = await createResponse(data);
      if (result.id) {
        setIsSent(true);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: formatError(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!surveyData) {
    return <Waiting />;
  }

  if (isSent) {
    return (
      <div className="container mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold mt-10">Khảo sát đã được gửi đi</h1>Cảm
        ơn thầy/cô đã tham gia khảo sát
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl">
      {loading ? <Waiting /> : null}
      <div className="flex flex-col items-center mb-3">
        <p className="text-center">UBND TỈNH KIÊN GIANG</p>
        <p className="text-center">
          <strong>SỞ GIÁO DỤC VÀ ĐÀO TẠO</strong>
        </p>
        <img
          src={sgdLogo}
          alt="survey"
          className="w-28 h-28 object-cover rounded-full mt-3"
        />
      </div>
      <div className="mb-5">{Parser(surveyData?.description ?? '')}</div>

      {Object.entries(surveyData?.questions ?? {}).map(
        ([questionId, question]) => (
          <QuestionView
            key={questionId}
            question={question}
            value={responses[questionId]}
            questionId={questionId}
            onChange={handleResponseChange}
            error={errors[questionId] || ''}
          />
        )
      )}
      {location.state?.preview ? null : (
        <div className="mt-6">
          <Button onClick={handleSubmit} className="w-full">
            Gửi khảo sát
          </Button>
        </div>
      )}
    </div>
  );
}
