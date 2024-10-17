import _ from 'lodash';
import { X } from 'lucide-react';

import { Question, Survey } from '@/features/surveys/type';

import { Response } from '../../type';

type Props = {
  onClose: () => void;
  survey: Survey;
  responses: Response;
};

const getTextRespone = (question: Question, value: any) => {
  switch (question.type) {
    case 'input':
      return (
        <div>
          <b>{question.text}:</b>
          <span className="ml-2">{value}</span>
        </div>
      );
    case 'radio':
    case 'select':
      return (
        <div>
          <b>{question.text}:</b>
          <span className="ml-2">{_.get(question, ['params', value], '')}</span>
        </div>
      );
    case 'checkbox': {
      const text = (value as string[])
        .map((v) => _.get(question, ['params', v], ''))
        .join(', ');
      return (
        <div>
          <b>{question.text}:</b>
          <span className="ml-2">{text}</span>
        </div>
      );
    }
    case 'questionGroup':
      return (
        <div>
          <div className="mb-2 font-bold">{question.text}:</div>
          {(value as string[][]).map((v, k) => (
            <div className="border-t-2">
              <div className="font-bold italic">Câu trả lời {k + 1}:</div>
              {v.map((vv, kk) => (
                <div key={kk}>
                  <b>{question.subQuestions?.[kk].content}:</b>
                  <span className="ml-2">{vv}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    default:
      return '';
  }
};

const ResponseDetail = ({ onClose, survey, responses }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Chi tiết phản hồi</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>
        </div>
        <div>
          {Object.entries(JSON.parse(responses.answers || '{}')).map(
            ([questionId, response]) => (
              <div className="w-full pb-2 border-2 rounded-lg my-2 p-2">
                {getTextRespone(
                  _.get(survey.questions, [questionId]),
                  response
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponseDetail;
