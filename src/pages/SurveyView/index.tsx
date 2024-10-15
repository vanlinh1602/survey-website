'use client';

import Parser from 'html-react-parser';
import _ from 'lodash';
import { AlertCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { SearchableSelect, Waiting } from '@/components';
import { useToast } from '@/components/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Survey } from '@/features/surveys/type';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';
export default function SurveyView() {
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [responses, setResponses] = useState<
    CustomObject<string | string[] | string[][]>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [surveyData, setSurveyData] = useState<Survey>();
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const fetchSurvey = async () => {
    try {
      setLoading(true);
      const result: WithApiResult<Survey> = await backendService.post(
        '/surveys/get',
        { id }
      );
      if (result.kind === 'ok') {
        setSurveyData(result.data);
      } else {
        toast({
          title: 'Error',
          description: formatError(result),
          variant: 'destructive',
        });
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

  useEffect(() => {
    fetchSurvey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTextChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => ({ ...prev, [questionId]: '' }));
  };

  const handleMultipleChoiceChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => ({ ...prev, [questionId]: '' }));
  };

  const handleCheckboxChange = (
    questionId: string,
    value: string,
    checked: boolean
  ) => {
    setResponses((prev) => {
      const currentValues = (prev[questionId] as string[]) || [];
      if (checked) {
        return { ...prev, [questionId]: [...currentValues, value] };
      } else {
        return {
          ...prev,
          [questionId]: currentValues.filter((v) => v !== value),
        };
      }
    });
    setErrors((prev) => ({ ...prev, [questionId]: '' }));
  };

  const hanleQuestionGroupChange = (
    questionId: string,
    path: (string | number)[],
    value: any
  ) => {
    setResponses((prev) => {
      const currentValues = _.cloneDeep(prev);
      _.set(currentValues, [questionId, ...path], value);
      return currentValues;
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
        return;
      }
      const data = {
        surveyId: id,
        answers: responses,
      };
      const result: WithApiResult<{ id: string }> = await backendService.post(
        '/responses/create',
        { data }
      );
      if (result.kind === 'ok') {
        setIsSent(true);
      } else {
        toast({
          title: 'Error',
          description: formatError(result),
          variant: 'destructive',
        });
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
        <img
          src={surveyData?.logo}
          alt="survey"
          className="w-32 h-32 object-cover rounded-full mb-6"
        />
        {Parser(surveyData?.title ?? '')}
      </div>
      <div className="mb-5">{Parser(surveyData?.description ?? '')}</div>

      {Object.entries(surveyData?.questions ?? {}).map(
        ([questionId, question]) => (
          <Card key={questionId} className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                {question.text}
                {question.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </CardTitle>
              {errors[questionId] && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Thiếu thông tin</AlertTitle>
                  <AlertDescription>{errors[questionId]}</AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              {question.type === 'questionGroup' ? (
                <div className="flex justify-end">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      hanleQuestionGroupChange(
                        questionId,
                        [(responses?.[questionId] as string[][])?.length || 0],
                        []
                      )
                    }
                  >
                    Thêm câu trả lời
                  </Button>
                </div>
              ) : null}

              {question.type === 'input' && (
                <Input
                  value={(responses[questionId] as string) || ''}
                  onChange={(e) => handleTextChange(questionId, e.target.value)}
                  placeholder="Enter your answer"
                />
              )}
              {question.type === 'radio' && (
                <RadioGroup
                  value={responses[questionId] as string}
                  onValueChange={(value) =>
                    handleMultipleChoiceChange(questionId, value)
                  }
                >
                  {question.params?.map((option, index) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={index.toString()}
                        id={`${questionId}-${option}`}
                      />
                      <Label htmlFor={`${questionId}-${option}`}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {question.type === 'checkbox' && (
                <div className="space-y-2">
                  {question.params?.map((option, index) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${questionId}-${option}`}
                        checked={(
                          (responses[questionId] as string[]) || []
                        ).includes(index.toString())}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            questionId,
                            index.toString(),
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={`${questionId}-${option}`}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              {question.type === 'questionGroup' && (
                <div className="space-y-2 ">
                  {_.range(
                    (responses?.[questionId] as string[][])?.length || 1
                  ).map((response) => (
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
                                  setResponses((prev) => {
                                    const currentValues = _.cloneDeep(prev);
                                    const currentResponse =
                                      currentValues[questionId];
                                    (currentResponse as string[][])?.splice(
                                      response,
                                      1
                                    );
                                    return currentValues;
                                  });
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            ) : null}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="px-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {question.subQuestions?.map(
                              (subQuestion, index) => (
                                <div>
                                  <div className="mb-1">
                                    {subQuestion.content}
                                  </div>
                                  <Input
                                    value={
                                      responses?.[questionId]?.[response]?.[
                                        index
                                      ] || ''
                                    }
                                    onChange={(e) =>
                                      hanleQuestionGroupChange(
                                        questionId,
                                        [response, index],
                                        e.target.value
                                      )
                                    }
                                    placeholder={
                                      subQuestion.placeholder ||
                                      'Nhập câu trả lời'
                                    }
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              )}

              {question.type === 'select' && (
                <SearchableSelect
                  options={
                    question.params?.map((option, index) => ({
                      value: index.toString(),
                      label: option,
                    })) || []
                  }
                  onSelect={(value) =>
                    handleMultipleChoiceChange(questionId, value)
                  }
                  placeholder="Chọn câu trả lời"
                  value={responses[questionId] as string}
                />
              )}
            </CardContent>
          </Card>
        )
      )}

      <div className="mt-6">
        <Button onClick={handleSubmit} className="w-full">
          Gửi khảo sát
        </Button>
      </div>
    </div>
  );
}
