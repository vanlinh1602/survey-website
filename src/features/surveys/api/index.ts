import { toast } from '@/components/hooks/use-toast';
import { SurveysService } from '@/services/surveys';
import formatError from '@/utils/formatError';

import { Survey } from '../type';

export const getSurvey = async (id: string): Promise<Survey | null> => {
  try {
    const result = await SurveysService.getSurvey(id);
    return result;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return null;
  }
};

export const querySurveys = async (): Promise<Survey[]> => {
  try {
    const result = await SurveysService.querySurveys();
    return result;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return [];
  }
};

export const createSurvey = async (survey: Survey): Promise<string> => {
  try {
    await SurveysService.createSurvey(survey);
    return survey.id;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return '';
  }
};

export const updateSurvey = async (
  id: string,
  data: Partial<Survey>
): Promise<boolean> => {
  try {
    await SurveysService.updateSurvey(id, data);
    return true;
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return false;
  }
};
