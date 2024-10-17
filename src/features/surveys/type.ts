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
  title: string;
  description: string;
  questions: Question[];
  lasted?: {
    time: number;
  };
};

export type SurveyStoreState = {
  handling: boolean;
  surveys?: CustomObject<Survey>;
};

export type SurveyStoreAction = {
  getSurveys: (id: string) => Promise<void>;
  querySurveys: () => Promise<void>;
  createSurvey: (data: Survey) => Promise<void>;
  updateSurvey: (id: string, data: Survey) => Promise<void>;
};
