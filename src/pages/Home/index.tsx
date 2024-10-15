import Parser from 'html-react-parser';
import { PlusCircle } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
import { querySurveys } from '@/features/surveys/api';
import { Survey } from '@/features/surveys/type';
import { translations } from '@/locales/translations';

export default function Component() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [waiting, setWaiting] = useState(false);

  const fetchSurveys = async () => {
    setWaiting(true);
    try {
      const result = await querySurveys();
      setSurveys(result);
    } finally {
      setWaiting(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  return (
    <>
      {waiting ? <Waiting /> : null}
      <div className="flex justify-end items-center mb-6">
        <Button
          onClick={() => {
            navigate('/new/edit');
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {t(translations.actions.create)}{' '}
          {t(translations.survey).toLowerCase()}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sample Survey Cards */}
        {surveys.map((survey) => (
          <Card key={survey.id}>
            <CardHeader>
              <CardTitle className="max-h-12 h-12 overflow-hidden overflow-ellipsis">
                <div className="!text-start">{Parser(survey.title)}</div>
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
                onClick={() => navigate(`/${survey.id}/edit`)}
              >
                Chỉnh sửa
              </Button>
              <Button onClick={() => navigate(`/${survey.id}/results`)}>
                Xem chi tiết
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
