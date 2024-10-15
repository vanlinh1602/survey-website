import _ from 'lodash';
import { SheetIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';

import { toast } from '@/components/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Response } from '@/features/responses/type';
import { Survey } from '@/features/surveys/type';
import { backendService } from '@/services';

// const data = [
//   { name: 'Strongly Disagree', value: 10 },
//   { name: 'Disagree', value: 20 },
//   { name: 'Neutral', value: 30 },
//   { name: 'Agree', value: 25 },
//   { name: 'Strongly Agree', value: 15 },
// ];

export default function ViewResults() {
  const { id: surveyId } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey>();
  const [responses, setResponses] = useState<Response[]>([]);

  const fetchData = async () => {
    try {
      const surveyResult: WithApiResult<Survey> = await backendService.post(
        '/surveys/get',
        {
          id: surveyId,
        }
      );
      if (surveyResult.kind === 'ok') {
        setSurvey(surveyResult.data);
      }

      const responseResult: WithApiResult<Response[]> =
        await backendService.post('/responses/query', {
          query: { surveyId },
        });
      if (responseResult.kind === 'ok') {
        setResponses(responseResult.data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
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
      Object.entries(response.answers).forEach(([key, value]) => {
        switch (survey?.questions[key].type) {
          case 'input': {
            _.set(tmp, [0, key], value);
            break;
          }
          case 'radio':
          case 'select': {
            _.set(
              tmp,
              [0, key],
              _.get(survey?.questions[key].params, [value as string], '')
            );
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
                .map((v) => _.get(survey?.questions[key].params, [v], ''))
                .join(', ')
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
    XLSX.writeFile(wb, 'survey_responses.xlsx');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Thống kê khảo sát</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Survey Summary</CardTitle>
          <CardDescription>Overview of survey responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold">{responses.length}</h3>
              <p className="text-muted-foreground">Total Responses</p>
            </div>
            <div
              className="text-center flex items-center flex-col cursor-pointer"
              onClick={exportExcel}
            >
              <h3 className="text-2xl font-bold">
                <SheetIcon className="text-center" />
              </h3>
              <p className="text-muted-foreground">Xuất Excel</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <Tabs defaultValue="chart" className="mb-6">
        <TabsList>
          <TabsTrigger value="chart">Chart View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Response Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Response Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Response</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.value}</TableCell>
                      <TableCell>
                        {((item.value / 100) * 100).toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Individual Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Respondent</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>Respondent {i + 1}</TableCell>
                  <TableCell>{new Date().toLocaleDateString()}</TableCell>
                  <TableCell>{Math.floor(Math.random() * 5) + 1}</TableCell>
                  <TableCell>Sample comment {i + 1}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> */}
    </div>
  );
}
