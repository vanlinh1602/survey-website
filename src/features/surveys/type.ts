export type City = {
  name: string;
  districts?: CustomObject<City>;
  wards?: CustomObject<City>;
};

export type Question = {
  type:
    | 'input'
    | 'radio'
    | 'checkbox'
    | 'questionGroup'
    | 'select'
    | 'textarea'
    | 'unit';
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
  deleteSurvey: (id: string) => Promise<void>;
};
