import { Question } from '@/features/surveys/type';

import { CheckBoxQuestion } from './CheckBox';
import { InputQuestion } from './Input';
import { QuestionGroup } from './QuestionGroup';
import { RadioQuestion } from './Radio';
import { SelectQuestion } from './Select';
import { TextAreaQuestion } from './TextArea';
import { UnitQuestion } from './Unit';

type Props = {
  question: Question;
  questionId: string;
  value: any;
  onChange: (path: (string | number)[], value: any) => void;
  error: string;
};

export const QuestionView = (props: Props) => {
  switch (props.question.type) {
    case 'checkbox':
      return <CheckBoxQuestion {...props} />;
    case 'radio':
      return <RadioQuestion {...props} />;
    case 'input':
      return <InputQuestion {...props} />;
    case 'select':
      return <SelectQuestion {...props} />;
    case 'textarea':
      return <TextAreaQuestion {...props} />;
    case 'questionGroup':
      return <QuestionGroup {...props} />;
    case 'unit':
      return <UnitQuestion {...props} />;
    default:
      return null;
  }
};
