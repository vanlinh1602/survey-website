export type Question = {
  type: 'input' | 'radio' | 'checkbox' | 'questionGroup' | 'select';
  text: string;
  required?: boolean;
  placeholder?: string;
  params?: string[];
  subQuestions?: {
    content: string;
    placeholder?: string;
  }[];
};

export type Survey = {
  id: string;
  logo?: string;
  title: string;
  description: string;
  questions: CustomObject<Question>;
  lasted?: {
    time: number;
  };
};
