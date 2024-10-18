import { CheckCheck, CopyIcon, EditIcon, PlusCircle } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import { Waiting } from '@/components';
import { toast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSurveyStore } from '@/features/surveys/hooks';
import { useUserStore } from '@/features/user/hooks';
import { unitAvailable } from '@/lib/options';
import { generateID } from '@/lib/utils';
import { translations } from '@/locales/translations';

export default function Component() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState('');

  const { querySurveys, surveys, handling } = useSurveyStore(
    useShallow((state) => ({
      surveys: state.surveys,
      handling: state.handling,
      querySurveys: state.querySurveys,
    }))
  );

  const { user } = useUserStore(
    useShallow((state) => ({
      user: state.information,
    }))
  );

  useEffect(() => {
    if (user?.unit === 'xbot') {
      querySurveys();
    } else {
      querySurveys({ unit: user?.unit || '' });
    }
  }, [querySurveys, user?.unit]);

  return (
    <>
      {handling ? <Waiting /> : null}
      <div className="flex justify-end items-center mb-6">
        <Button
          onClick={() => {
            navigate(`survey/${generateID()}/edit`, { state: { isNew: true } });
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {t(translations.actions.create)}{' '}
          {t(translations.survey).toLowerCase()}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sample Survey Cards */}
        {Object.values(surveys ?? {}).map((survey) => (
          <Card key={survey.id}>
            <CardHeader>
              <CardTitle>
                <div className="!text-start line-clamp-1 overflow-ellipsis">
                  {survey.title}
                </div>
              </CardTitle>
              <CardDescription>
                <div className="flex line-clamp-1 overflow-ellipsis space-x-2">
                  <div>
                    {survey.lasted?.time
                      ? moment(survey.lasted?.time).fromNow()
                      : '----'}
                  </div>
                  <div>-</div>
                  <div>{survey.lasted?.user || '----'}</div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {Object.keys(survey.questions).length} Câu hỏi
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <strong className="mr-2">Đơn vị:</strong>
                {unitAvailable[survey.unit]}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => navigate(`survey/${survey.id}/edit`)}
                >
                  <EditIcon className="h-4 w-4 mr-2" />
                  <div className="hidden md:block">Chỉnh sửa</div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCopySuccess(survey.id);
                    navigator.clipboard.writeText(
                      `${window.location.origin}/survey/${survey.id}`
                    );
                    toast({
                      title: 'Sao chép link thành công',
                      description:
                        'Link khảo sát đã được sao chép vào clipboard',
                    });
                  }}
                >
                  {copySuccess !== survey.id ? (
                    <CopyIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <CheckCheck className={'h-4 w-4 mr-2'} />
                  )}
                  <div className="md:block hidden">Sao chép link</div>
                </Button>
              </div>

              <Button
                size="sm"
                onClick={() => navigate(`survey/${survey.id}/results`)}
              >
                Xem kết quả
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
