import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  createSurvey,
  deleteSurvey,
  getSurvey,
  querySurveys,
  updateSurvey,
} from './api';
import { Survey, SurveyStoreAction, SurveyStoreState } from './type';

const initialState: SurveyStoreState = {
  handling: false,
};

export const useSurveyStore = create<SurveyStoreState & SurveyStoreAction>()(
  devtools((set) => ({
    ...initialState,
    getSurveys: async (id: string) => {
      set(
        () => ({
          handling: true,
        }),
        false,
        { type: 'survey/getSurveys', id }
      );
      const surveys = await getSurvey(id);
      if (surveys) {
        set(
          (state) => ({
            handling: false,
            surveys: {
              ...(state.surveys || {}),
              [id]: surveys,
            },
          }),
          false,
          { type: 'survey/getSurveys', id }
        );
      } else {
        set(
          () => ({
            handling: false,
          }),
          false,
          { type: 'survey/getSurveys', id }
        );
      }
    },
    querySurveys: async (filter) => {
      set(
        () => ({
          handling: true,
        }),
        false,
        { type: 'survey/querySurveys' }
      );
      const surveys = await querySurveys(filter);
      set(
        () => ({
          handling: false,
          surveys: surveys.reduce((acc, survey) => {
            acc[survey.id] = survey;
            return acc;
          }, {} as Record<string, Survey>),
        }),
        false,
        { type: 'survey/querySurveys' }
      );
    },
    createSurvey: async (data) => {
      set(
        () => ({
          handling: true,
        }),
        false,
        { type: 'survey/createSurvey', data }
      );
      const surveyId = await createSurvey(data);
      set(
        (state) => ({
          handling: false,
          surveys: {
            ...(state.surveys || {}),
            [surveyId]: data,
          },
        }),
        false,
        { type: 'survey/createSurvey', data }
      );
    },
    updateSurvey: async (id, data) => {
      set(
        () => ({
          handling: true,
        }),
        false,
        { type: 'survey/updateSurvey', data }
      );
      await updateSurvey(id, data);
      set(
        (state) => ({
          handling: false,
          surveys: {
            ...(state.surveys || {}),
            [data.id]: data,
          },
        }),
        false,
        { type: 'survey/updateSurvey', data }
      );
    },
    deleteSurvey: async (id) => {
      set(
        () => ({
          handling: true,
        }),
        false,
        { type: 'survey/deleteSurvey', id }
      );
      await deleteSurvey(id);
      set(
        (state) => {
          const newSurveys = { ...state.surveys };
          delete newSurveys[id];
          return {
            handling: false,
            surveys: newSurveys,
          };
        },
        false,
        { type: 'survey/deleteSurvey', id }
      );
    },
  }))
);
