import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Question } from '@/features/surveys/type';

type Props = {
  question: Question;
  questionId: string;
  onChange: (path: string[], value: string[]) => void;
  error: string;
  value: string[];
};

export const CheckBoxQuestion = ({
  question,
  onChange,
  questionId,
  error,
  value: checked,
}: Props) => {
  return (
    <Card key={questionId} className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-base">
          {question.text}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </CardTitle>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Thiếu thông tin</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {question.params?.map((option, index) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${questionId}-${option}`}
                checked={checked?.includes(index.toString())}
                onCheckedChange={(check) => {
                  const updated = check
                    ? [...(checked || []), index.toString()]
                    : checked?.filter((item) => item !== index.toString());
                  onChange([questionId], updated);
                }}
              />
              <Label htmlFor={`${questionId}-${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
