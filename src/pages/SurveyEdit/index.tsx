import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { z } from 'zod';
import { useShallow } from 'zustand/shallow';

import { BundledEditor, DropzoneModal, Waiting } from '@/components';
import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSurveyStore } from '@/features/surveys/hooks';
import { Question } from '@/features/surveys/type';
import { translations } from '@/locales/translations';
import formatError from '@/utils/formatError';

export default function CreateSurvey() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id: surveyId } = useParams<{ id: string }>();
  const location = useLocation();
  const isNew = location.state?.isNew || false;
  const { t } = useTranslation();
  const [questions, setQuestions] = useState<Question[]>([]);

  const { survey, getSurvey, handling, createSurvey, updateSurvey } =
    useSurveyStore(
      useShallow((state) => ({
        survey: state.surveys?.[surveyId!],
        getSurvey: state.getSurveys,
        handling: state.handling,
        createSurvey: state.createSurvey,
        updateSurvey: state.updateSurvey,
      }))
    );

  const updateQuestion = (path: (string | number)[], value: any) => {
    setQuestions((pre) => {
      const updated = _.cloneDeep(pre);
      _.set(updated, path, value);
      return updated;
    });
  };

  const formSchema = z.object({
    title: z.string(),
    description: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    if (!isNew && !survey) {
      getSurvey(surveyId!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyId]);

  useEffect(() => {
    if (survey) {
      form.reset({
        title: survey.title,
        description: survey.description,
      });
      setQuestions(survey.questions || []);
    }
  }, [form, survey]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isNew) {
        const data = {
          ...values,
          questions,
          lasted: {
            time: Date.now(),
          },
          id: surveyId!,
        };
        await createSurvey(data);
        navigate(`/survey/${surveyId}`);
      } else {
        const data = {
          ...values,
          questions,
          lasted: {
            time: Date.now(),
          },
        };
        await updateSurvey(surveyId!, { id: surveyId!, ...data });
        toast({
          title: 'Success',
          description: 'Survey updated successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: formatError(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto">
      {handling ? <Waiting /> : null}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-6">
          {t(isNew ? translations.actions.create : translations.actions.edit)}{' '}
          {t(translations.survey)}
        </h1>
        <div>
          {!isNew ? (
            <Button
              className="mr-4"
              onClick={() => {
                navigate(`/survey/${surveyId}`);
              }}
            >
              Xem trước
            </Button>
          ) : null}
          <Button onClick={form.handleSubmit(onSubmit)}>Lưu</Button>
        </div>
      </div>
      <Form {...form}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t(translations.surveyDetail)}</CardTitle>
            <CardDescription>
              Nhập thông tin cơ bản cho khảo sát của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <>
                      <div className="flex items-center">
                        {field.value && (
                          <img
                            src={field.value}
                            alt="Logo"
                            className="w-14 h-14 object-cover rounded-full mr-4"
                          />
                        )}
                        <DropzoneModal
                          content="Upload Logo"
                          onSubmit={(files) => {
                            // convert file to base64
                            const reader = new FileReader();
                            reader.onload = () => {
                              field.onChange(reader.result as string);
                            };
                            reader.readAsDataURL(files[0]);
                          }}
                        />
                      </div>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Nhập URL logo"
                      />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập tiêu đề" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <BundledEditor
                      onChange={(_e, editor) => {
                        const content = editor.getContent();
                        field.onChange(content);
                      }}
                      initialValue={field.value}
                      init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                          'advlist',
                          'anchor',
                          'autolink',
                          'help',
                          'image',
                          'link',
                          'lists',
                          'searchreplace',
                          'table',
                          'wordcount',
                        ],
                        toolbar:
                          'undo redo | blocks | ' +
                          'bold italic forecolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | help',
                        content_style:
                          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Questions</CardTitle>
            <CardDescription>
              Add and configure your survey questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, keyIndex) => (
              <Card key={`question-${keyIndex}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Question {keyIndex + 1}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setQuestions((pre) => {
                        return pre.filter((_q, index) => {
                          return index !== keyIndex;
                        });
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`question-${keyIndex}-require`}
                      checked={question.required || false}
                      onCheckedChange={(checked) => {
                        updateQuestion([keyIndex, 'required'], checked);
                      }}
                    />
                    <label htmlFor="terms" className="text-sm">
                      Bắc buộc
                    </label>
                  </div>
                  <div className="text-sm font-medium">Loại câu hỏi</div>
                  <Select
                    value={question.type}
                    onValueChange={(value) =>
                      updateQuestion([keyIndex], {
                        type: value,
                        text: '',
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(translations.questionTypes).map(
                        ([type, value]) => (
                          <SelectItem key={type} value={type}>
                            {t(value)}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <div className="text-sm font-medium">Nhập câu hỏi</div>
                  <Input
                    placeholder="Enter question text"
                    value={question.text}
                    onChange={(e) =>
                      updateQuestion([keyIndex, 'text'], e.target.value)
                    }
                  />
                  {(question.type === 'radio' ||
                    question.type === 'select' ||
                    question.type === 'checkbox') && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Nhập phương án</div>
                      {question?.params?.map((paramValue, paramIndex) => (
                        <Input
                          key={`param-${keyIndex}-${paramIndex}`}
                          placeholder={`Option ${paramIndex + 1}`}
                          value={paramValue}
                          onChange={(e) => {
                            updateQuestion(
                              [keyIndex, 'params', paramIndex],
                              e.target.value
                            );
                          }}
                        />
                      ))}
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => {
                            updateQuestion(
                              [
                                keyIndex,
                                'params',
                                question.params?.length || 0,
                              ],
                              ''
                            );
                          }}
                        >
                          Thêm phương án
                        </Button>

                        <DropzoneModal
                          content="Import Phương án"
                          accept={{ 'xlsx, xls': ['.xlsx', '.xls'] }}
                          onSubmit={(files) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const content = reader.result as string;
                              const wb = XLSX.read(content, { type: 'binary' });
                              const ws = wb.Sheets[wb.SheetNames[0]];
                              const data = XLSX.utils.sheet_to_json(ws);
                              const params: string[] = data.map(
                                (d: any) => d['Cột phương án']
                              );
                              if (params.length) {
                                updateQuestion([keyIndex, 'params'], params);
                              }
                            };
                            reader.readAsBinaryString(files[0]);
                          }}
                        />
                        <Button
                          variant="outline"
                          className="ml-2"
                          size="sm"
                          onClick={() => {
                            const wb = XLSX.utils.book_new();
                            const ws = XLSX.utils.json_to_sheet([
                              {
                                'Cột phương án': '',
                              },
                            ]);
                            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                            XLSX.writeFile(wb, 'file_mẫu_nhập.xlsx');
                          }}
                        >
                          Tải file nhập mẫu
                        </Button>
                      </div>
                    </div>
                  )}
                  {question.type === 'questionGroup' && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        Nhập câu hỏi phụ
                      </div>
                      {question?.subQuestions?.map((paramValue, paramIndex) => (
                        <div className="grid grid-cols-2 space-x-3">
                          <div>
                            <div className="text-sm mb-2">
                              Câu hỏi phụ {paramIndex + 1}
                            </div>
                            <div>
                              <Input
                                key={`param-${keyIndex}-${paramIndex}`}
                                placeholder={`Câu hỏi phụ ${paramIndex + 1}`}
                                value={paramValue.content}
                                onChange={(e) => {
                                  updateQuestion(
                                    [
                                      keyIndex,
                                      'subQuestions',
                                      paramIndex,
                                      'content',
                                    ],
                                    e.target.value
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="text-sm mb-2">
                              Placeholder cho câu {paramIndex + 1}
                            </div>
                            <Input
                              key={`param-${keyIndex}-${paramIndex}`}
                              placeholder={`Text mẫu hiện trong ô nhập ${
                                paramIndex + 1
                              }`}
                              value={paramValue.placeholder}
                              onChange={(e) => {
                                updateQuestion(
                                  [
                                    keyIndex,
                                    'subQuestions',
                                    paramIndex,
                                    'placeholder',
                                  ],
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            updateQuestion(
                              [
                                keyIndex,
                                'subQuestions',
                                question.subQuestions?.length || 0,
                                'content',
                              ],
                              ''
                            );
                          }}
                        >
                          Thêm câu hỏi
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            <Button
              onClick={() => {
                setQuestions((pre) => [...pre, { type: 'input', text: '' }]);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </CardContent>
        </Card>
      </Form>

      {/* <Card>
        <CardHeader>
          <CardTitle>Survey Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="anonymous" />
            <Label htmlFor="anonymous">Allow anonymous responses</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="multiple-responses" />
            <Label htmlFor="multiple-responses">
              Allow multiple responses per user
            </Label>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card> */}
    </div>
  );
}
