export type Response = {
  id: string;
  surveyId: string;
  user?: string;
  answers: CustomObject<string | string[] | string[][]>;
  createdAt: number;
};
