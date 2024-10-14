import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Survey } from '@/features/surveys/type';
import { translations } from '@/locales/translations';
import { backendService } from '@/services';

export default function Component() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<Survey[]>([]);

  const fetchSurveys = async () => {
    try {
      const result: WithApiResult<Survey[]> = await backendService.post(
        '/surveys/query',
        {}
      );
      if (result.kind === 'ok') {
        setSurveys(result.data);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Your Surveys
        </h1>
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
              <CardTitle>{survey.title}</CardTitle>
              <CardDescription>Last edited 2 days ago</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                10 questions • 100 responses
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate(`/${survey.id}/edit`)}
              >
                Edit
              </Button>
              <Button onClick={() => navigate(`/${survey.id}/results`)}>
                View Results
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
