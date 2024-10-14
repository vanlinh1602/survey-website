export type Question = {
  type: 'input' | 'radio' | 'checkbox' | 'questionGroup';
  text: string;
  required?: boolean;
  params?: string[];
};

export type Survey = {
  id: string;
  logo?: string;
  title: string;
  description: string;
  questions: CustomObject<Question>;
};
