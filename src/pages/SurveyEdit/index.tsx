import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import {
  CheckCheck,
  CopyIcon,
  Eye,
  PlusCircle,
  Save,
  Trash2,
} from 'lucide-react';
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
import { Question, Survey } from '@/features/surveys/type';
import { useUserStore } from '@/features/user/hooks';
import { unitAvailable } from '@/lib/options';
import { translations } from '@/locales/translations';
import formatError from '@/utils/formatError';

import ConfirmRemove from './ConfirmRemove';

export default function CreateSurvey() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id: surveyId } = useParams<{ id: string }>();
  const location = useLocation();
  const isNew = location.state?.isNew || false;
  const { t } = useTranslation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [copySuccess, setCopySuccess] = useState('');
  const [isRemove, setIsRemove] = useState(false);

  const {
    survey,
    getSurvey,
    handling,
    createSurvey,
    updateSurvey,
    deleteSurvey,
  } = useSurveyStore(
    useShallow((state) => ({
      survey: state.surveys?.[surveyId!],
      getSurvey: state.getSurveys,
      handling: state.handling,
      createSurvey: state.createSurvey,
      updateSurvey: state.updateSurvey,
      deleteSurvey: state.deleteSurvey,
    }))
  );

  const { userInfo } = useUserStore(
    useShallow((state) => ({
      userInfo: state.information,
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
    unit: z.string(),
    title: z.string(),
    description: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      unit: userInfo?.unit !== 'xbot' ? userInfo?.unit : '',
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
        unit: survey.unit,
      });
      setQuestions(survey.questions || []);
    }
  }, [form, survey]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!values.title || !values.description || !values.unit) {
        toast({
          title: 'Thiếu thông tin',
          description: 'Các thông tin bắc buộc không được để trống',
          variant: 'destructive',
        });
        return;
      }
      const data: Survey = {
        ...values,
        questions,
        lasted: {
          time: Date.now(),
          user: userInfo?.email || '',
        },
        id: surveyId!,
      };
      if (isNew) {
        await createSurvey(data);
      } else {
        await updateSurvey(surveyId!, data);
      }
      toast({
        title: 'Thành công',
        description: 'Khảo sát đã được lưu',
      });
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
      {isRemove ? (
        <ConfirmRemove
          onClose={() => setIsRemove(false)}
          onConfirm={() => {
            deleteSurvey(surveyId!);
            navigate('/');
          }}
        />
      ) : null}
      <div className="flex items-center justify-between mb-4 h-9">
        <h1 className="text-3xl font-bold sticky top-7">
          {t(isNew ? translations.actions.create : translations.actions.edit)}{' '}
          {t(translations.survey)}
        </h1>
        <div className="flex items-center">
          {!isNew ? (
            <>
              <Button
                size="sm"
                className="mr-2"
                variant="destructive"
                onClick={() => {
                  setIsRemove(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <div className="hidden md:block ml-2">Xóa</div>
              </Button>
              <Button
                size="sm"
                className="mr-2"
                onClick={() => {
                  setCopySuccess(survey?.id || '');
                  navigator.clipboard.writeText(
                    `${window.location.origin}/survey/${survey?.id}`
                  );
                  toast({
                    title: 'Sao chép link thành công',
                    description: 'Link khảo sát đã được sao chép vào clipboard',
                  });
                }}
              >
                {copySuccess !== survey?.id ? (
                  <CopyIcon className="h-4 w-4 " />
                ) : (
                  <CheckCheck className="h-4 w-4" />
                )}
                <div className="md:block hidden ml-2">Sao chép link</div>
              </Button>
              <Button
                size="sm"
                className="mr-2"
                onClick={() => {
                  navigate(`/survey/${surveyId}`, { state: { preview: true } });
                }}
              >
                <Eye className="h-4 w-4" />
                <div className="hidden md:block ml-2">Xem trước</div>
              </Button>
            </>
          ) : null}
          <Button size="sm" onClick={form.handleSubmit(onSubmit)}>
            <Save className="h-4 w-4" />
            <div className="hidden md:block ml-2">Lưu</div>
          </Button>
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
              name="unit"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel>
                    Đơn vị
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={userInfo?.unit !== 'xbot'}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px] ml-4">
                        <SelectValue placeholder="Chọn đơn vị" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(unitAvailable).map(([key, unit]) => (
                        <SelectItem key={key} value={key}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tiêu đề
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
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
                  <FormLabel>
                    Mô tả
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
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
                              const wb = XLSX.read(content, {
                                type: 'binary',
                              });
                              const ws = wb.Sheets[wb.SheetNames[0]];
                              const data = XLSX.utils.sheet_to_json(ws);
                              const params: string[] = data
                                .map((d: any) => d['Cột phương án'])
                                .filter((d: any) => !!d);
                              if (params.length) {
                                updateQuestion([keyIndex, 'params'], params);
                              } else {
                                toast({
                                  title: 'Lỗi',
                                  description:
                                    'File không có dữ liệu hoặc không đúng định dạng. Vui lòng kiểm tra lại',
                                  variant: 'destructive',
                                });
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
                            const ws = XLSX.utils.json_to_sheet([], {
                              header: ['Cột phương án'],
                            });
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
    </div>
  );
}
