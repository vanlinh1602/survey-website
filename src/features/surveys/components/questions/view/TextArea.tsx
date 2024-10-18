import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Question } from '@/features/surveys/type';

type Props = {
  question: Question;
  questionId: string;
  onChange: (path: string[], value: string) => void;
  error: string;
  value: string;
};

export const TextAreaQuestion = ({
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
        <textarea
          className="w-full p-2 border rounded-md text-sm font-normal"
          value={value}
          onChange={(e) => {
            onChange([questionId], e.target.value);
          }}
          placeholder="Nhập câu trả lời của bạn"
        />
      </CardContent>
    </Card>
  );
};
