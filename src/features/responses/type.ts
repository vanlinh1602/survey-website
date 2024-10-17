export type Response = {
  id: string;
  surveyId: string;
  user?: string;
  // answers: CustomObject<string | string[] | string[][]>;
  answers: string;
  createdAt: number;
};

export type AnswersParsed = CustomObject<string | string[] | string[][]>;
