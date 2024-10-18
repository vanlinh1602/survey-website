import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Question } from '@/features/surveys/type';

type Props = {
  question: Question;
  questionId: string;
  onChange: (path: string[], value: string) => void;
  error: string;
  value: string;
};

export const RadioQuestion = ({
  question,
  onChange,
  questionId,
  error,
  value,
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
        <RadioGroup
          value={value}
          onValueChange={(v) => {
            onChange([questionId], v);
          }}
        >
          {question.params?.map((option, index) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem
                value={index.toString()}
                id={`${questionId}-${option}`}
              />
              <Label htmlFor={`${questionId}-${option}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
