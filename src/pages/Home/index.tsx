import { PlusCircle } from 'lucide-react';
import moment from 'moment';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import { Waiting } from '@/components';
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
import { generateID } from '@/lib/utils';
import { translations } from '@/locales/translations';

export default function Component() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { querySurveys, surveys, handling } = useSurveyStore(
    useShallow((state) => ({
      surveys: state.surveys,
      handling: state.handling,
      querySurveys: state.querySurveys,
    }))
  );

  useEffect(() => {
    if (!surveys) {
      querySurveys();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySurveys]);

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
                {survey.lasted?.time
                  ? moment(survey.lasted?.time).fromNow()
                  : '----'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {Object.keys(survey.questions).length} Câu hỏi
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate(`survey/${survey.id}/edit`)}
              >
                Chỉnh sửa
              </Button>
              <Button onClick={() => navigate(`survey/${survey.id}/results`)}>
                Xem kết quả
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
