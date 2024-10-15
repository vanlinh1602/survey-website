import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

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
import { Question, Survey } from '@/features/surveys/type';
import { generateID } from '@/lib/utils';
import { translations } from '@/locales/translations';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';

export default function CreateSurvey() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id: surveyId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [questions, setQuestions] = useState<CustomObject<Question>>({});
  const [waiting, setWaiting] = useState(false);

  const updateQuestion = (
    id: string,
    path: (string | number)[],
    value: string
  ) => {
    setQuestions((pre) => {
      const updated = _.cloneDeep(pre);
      _.set(updated, [id, ...path], value);
      console.log(updated);

      return updated;
    });
  };

  const formSchema = z.object({
    logo: z.string().optional(),
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
    try {
      if (surveyId != 'new') {
        (async () => {
          const result: WithApiResult<Survey> = await backendService.post(
            '/surveys/get',
            { id: surveyId }
          );
          if (result.kind === 'ok') {
            form.reset({
              title: result.data.title,
              description: result.data.description,
              logo: result.data.logo,
            });
            setQuestions(result.data.questions);
          } else {
            toast({
              title: 'Error',
              description: formatError(result),
              variant: 'destructive',
            });
          }
        })();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: formatError(error),
        variant: 'destructive',
      });
    }
  }, [form, surveyId, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setWaiting(true);
    try {
      if (surveyId === 'new') {
        const result: WithApiResult<{ id: string }> = await backendService.post(
          '/surveys/create',
          {
            data: {
              ...values,
              questions,
              lasted: {
                time: Date.now(),
              },
              _id: generateID(),
            },
          }
        );
        if (result.kind === 'ok') {
          navigate(`/${result.data.id}`);
        }
      } else {
        const result = await backendService.post('/surveys/update', {
          id: surveyId,
          data: {
            ...values,
            questions,
            lasted: {
              time: Date.now(),
            },
          },
        });
        if (result.kind === 'ok') {
          toast({
            title: 'Success',
            description: 'Survey updated successfully',
          });
        } else {
          toast({
            title: 'Error',
            description: formatError(result),
            variant: 'destructive',
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setWaiting(false);
    }
  };

  return (
    <div className="container mx-auto">
      {waiting ? <Waiting /> : null}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-6">
          {t(
            surveyId === 'new'
              ? translations.actions.create
              : translations.actions.edit
          )}{' '}
          {t(translations.survey)}
        </h1>
        <div>
          {surveyId !== 'new' ? (
            <Button
              className="mr-4"
              onClick={() => {
                navigate(`/${surveyId}`);
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
            <FormField
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
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <BundledEditor
                      initialValue={field.value}
                      onChange={(_e, editor) => {
                        const content = editor.getContent();
                        field.onChange(content);
                      }}
                      init={{
                        height: 150,
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
            {Object.entries(questions).map(([key, question], index) => (
              <Card key={`question-${key}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Question {index + 1}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setQuestions((pre) => {
                        const updated = { ...pre };
                        _.unset(updated, key);
                        return updated;
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">Loại câu hỏi</div>
                  <Select
                    value={question.type}
                    onValueChange={(value) =>
                      updateQuestion(key, ['type'], value)
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
                  <div className="text-sm">Nhập câu hỏi</div>
                  <Input
                    placeholder="Enter question text"
                    value={question.text}
                    onChange={(e) =>
                      updateQuestion(key, ['text'], e.target.value)
                    }
                  />
                  {(question.type === 'radio' ||
                    question.type === 'select' ||
                    question.type === 'checkbox') && (
                    <div className="space-y-2">
                      <div className="text-sm">Nhập phương án</div>

                      {question?.params?.map((paramValue, paramIndex) => (
                        <Input
                          key={`param-${key}-${paramIndex}`}
                          placeholder={`Option ${paramIndex + 1}`}
                          value={paramValue}
                          onChange={(e) => {
                            updateQuestion(
                              key,
                              ['params', paramIndex],
                              e.target.value
                            );
                          }}
                        />
                      ))}
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            updateQuestion(
                              key,
                              ['params', question.params?.length || 0],
                              ''
                            );
                          }}
                        >
                          Thêm phương án
                        </Button>

                        {/* <DropzoneModal
                          content="Import Phương án"
                          onSubmit={(files) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const content = reader.result as string;
                              console.log(content);
                            };
                            reader.readAsBinaryString(files[0]);
                          }}
                        /> */}
                      </div>
                    </div>
                  )}
                  {question.type === 'questionGroup' && (
                    <div className="space-y-2">
                      <div className="text-sm">Nhập câu hỏi phụ</div>
                      {question?.subQuestions?.map((paramValue, paramIndex) => (
                        <div className="flex space-x-3">
                          <Input
                            key={`param-${key}-${paramIndex}`}
                            placeholder={`Câu hỏi phụ ${paramIndex + 1}`}
                            value={paramValue.content}
                            onChange={(e) => {
                              updateQuestion(
                                key,
                                ['subQuestions', paramIndex, 'content'],
                                e.target.value
                              );
                            }}
                          />

                          <Input
                            key={`param-${key}-${paramIndex}`}
                            placeholder={`Text mẫu hiện trong ô nhập ${
                              paramIndex + 1
                            }`}
                            value={paramValue.placeholder}
                            onChange={(e) => {
                              updateQuestion(
                                key,
                                ['subQuestions', paramIndex, 'placeholder'],
                                e.target.value
                              );
                            }}
                          />
                        </div>
                      ))}
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            updateQuestion(
                              key,
                              [
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
                setQuestions((pre) => ({
                  ...pre,
                  [generateID()]: {
                    type: 'input',
                    text: '',
                  },
                }));
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
