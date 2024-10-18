import _ from 'lodash';
import { AlertCircle, Trash2 } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Question } from '@/features/surveys/type';

type Props = {
  question: Question;
  questionId: string;
  onChange: (path: (string | number)[], value: string | any) => void;
  error: string;
  value: string[][];
};

export const QuestionGroup = ({
  question,
  onChange,
  questionId,
  error,
  value: responses = [],
}: Props) => {
  return (
    <Card key={questionId} className="mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-base">
          <span>
            {question.text}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </span>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              onChange([questionId, responses.length || 0], [] as string[]);
            }}
          >
            Thêm câu trả lời
          </Button>
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
        <div className="space-y-2 ">
          {_.range(responses.length || 1).map((response) => (
            <Accordion
              type="single"
              collapsible
              defaultValue={`item-${response}`}
            >
              <AccordionItem value={`item-${response}`}>
                <AccordionTrigger>
                  <div className="flex items-center">
                    Câu trả lời {response + 1}
                    {response ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newResponses = _.cloneDeep(responses);
                          newResponses.splice(response, 1);
                          onChange([questionId], newResponses);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    ) : null}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className={`px-2 gap-2 grid grid-cols-1  md:${
                      question.subQuestions?.length === 1
                        ? 'grid-cols-1'
                        : 'grid-cols-2'
                    }`}
                  >
                    {question.subQuestions?.map((subQuestion, index) => (
                      <div>
                        <div className="mb-1">{subQuestion.content}</div>
                        <Input
                          value={responses?.[response]?.[index] || ''}
                          onChange={(e) => {
                            const newResponses = _.cloneDeep(responses);
                            _.set(
                              newResponses,
                              [response, index],
                              e.target.value
                            );
                            onChange(
                              [questionId, response, index],
                              e.target.value
                            );
                          }}
                          placeholder={
                            subQuestion.placeholder || 'Nhập câu trả lời'
                          }
                        />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
