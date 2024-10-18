import _ from 'lodash';
import { SheetIcon } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { useShallow } from 'zustand/shallow';

import { Waiting } from '@/components';
import { toast } from '@/components/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import citiesJson from '@/data/cities.json';
import { getResponses } from '@/features/responses/api';
import { ResponseDetail } from '@/features/responses/components';
import { Response } from '@/features/responses/type';
import { useSurveyStore } from '@/features/surveys/hooks';
import { Question, Survey } from '@/features/surveys/type';

export default function ViewResults() {
  const { id: surveyId } = useParams<{ id: string }>();
  const [responses, setResponses] = useState<Response[]>([]);
  const [waiting, setWaiting] = useState(false);
  const [showDetail, setShowDetail] = useState<Response>();

  const { survey, getSurvey } = useSurveyStore(
    useShallow((state) => ({
      getSurvey: state.getSurveys,
      survey: state.surveys?.[surveyId!],
    }))
  );

  const fetchData = async () => {
    setWaiting(true);
    try {
      if (!survey) {
        getSurvey(surveyId || '');
      }
      const responseResult = await getResponses(surveyId || '');
      setResponses(responseResult);
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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportExcel = async () => {
    const header: CustomObject<string> = {};
    Object.entries(survey?.questions ?? {}).forEach(([key, value]) => {
      if (value.subQuestions) {
        value.subQuestions.forEach((subQuestion, index) => {
          header[`${key}-${index}`] = `${value.text} - ${subQuestion.content}`;
        });
      } else {
        header[key] = value.text;
      }
    });

    const result: CustomObject<string>[] = [];
    responses.forEach((response) => {
      const tmp: CustomObject<string>[] = [];
      const answersParsed = JSON.parse(response.answers);
      Object.entries(answersParsed).forEach(([key, value]) => {
        const question: Question = _.get(survey?.questions, [key]);
        switch (question.type) {
          case 'input':
          case 'textarea': {
            _.set(tmp, [0, key], value);
            break;
          }
          case 'radio':
          case 'select': {
            _.set(tmp, [0, key], _.get(question.params, [value as string], ''));
            break;
          }
          case 'questionGroup': {
            (value as string[][]).forEach((v, k) => {
              v.forEach((vv, kk) => {
                _.set(tmp, [k, `${key}-${kk}`], vv);
              });
            });
            break;
          }
          case 'checkbox': {
            _.set(
              tmp,
              [0, key],
              (value as string[])
                .map((v) => _.get(question.params, [v], ''))
                .join(', ')
            );
            break;
          }
          case 'unit': {
            const [province, district, ward] = value as string[];
            _.set(
              tmp,
              [0, key],
              `${_.get(citiesJson, [province, 'name'], '')} - ${_.get(
                citiesJson,
                [province, 'districts', district, 'name'],
                ''
              )} - ${_.get(
                citiesJson,
                [province, 'districts', district, 'wards', ward, 'name'],
                ''
              )}`
            );
            break;
          }
          default:
            break;
        }
      });
      result.push(...tmp);
    });

    const ws = XLSX.utils.json_to_sheet([header, ...result], {
      skipHeader: true,
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Responses');
    XLSX.writeFile(wb, 'thống_kê_khảo_sát.xlsx');
  };

  return (
    <div className="container mx-auto p-6">
      {waiting ? <Waiting /> : null}
      {showDetail ? (
        <ResponseDetail
          onClose={() => setShowDetail(undefined)}
          survey={survey as Survey}
          responses={showDetail}
        />
      ) : null}
      <h1 className="text-3xl font-bold mb-6">Thống kê khảo sát</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Survey Summary</CardTitle>
          <CardDescription>Overview of survey responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold">{responses.length}</h3>
              <p className="text-muted-foreground">Tổng phản hồi</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold">{survey?.questions.length}</h3>
              <p className="text-muted-foreground">Tổng câu hỏi</p>
            </div>
            <div className="flex items-center justify-center flex-col">
              <div className="text-center cursor-pointer" onClick={exportExcel}>
                <h3 className="text-2xl font-bold text-center flex justify-center">
                  <SheetIcon className="text-center" />
                </h3>
                <p className="text-muted-foreground">Xuất Excel</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tất cả phải hồi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người khảo sát</TableHead>
                <TableHead>Ngày thực hiện</TableHead>
                <TableHead>Số câu hỏi trả lời</TableHead>
                <TableHead>Chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((respondent, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {respondent.user || `Người thứ ${i + 1}`}
                  </TableCell>
                  <TableCell>
                    {moment(respondent.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {Object.keys(JSON.parse(respondent.answers)).length}
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-blue-500"
                      onClick={() => {
                        setShowDetail(respondent);
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
