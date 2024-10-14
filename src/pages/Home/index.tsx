import { PlusCircle } from 'lucide-react';
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
import { generateID } from '@/lib/utils';
import { translations } from '@/locales/translations';

export default function Component() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Your Surveys
        </h1>
        <Button
          onClick={() => {
            const id = generateID();
            navigate(`/${id}/edit`);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {t(translations.actions.create)}{' '}
          {t(translations.survey).toLowerCase()}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sample Survey Cards */}
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Customer Satisfaction Survey {i}</CardTitle>
              <CardDescription>Last edited 2 days ago</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                10 questions • 100 responses
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate(`/${i}/edit`)}>
                Edit
              </Button>
              <Button onClick={() => navigate(`/${i}/results`)}>
                View Results
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
