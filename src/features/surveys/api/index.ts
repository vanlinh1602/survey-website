import { toast } from '@/components/hooks/use-toast';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { Survey } from '../type';

export const getSurvey = async (id: string): Promise<Survey | null> => {
  try {
    const result: WithApiResult<Survey> = await backendService.post(
      '/surveys/get',
      { id }
    );
    if (result.kind === 'ok') {
      return result.data;
    } else {
      throw new Error(formatError(result));
    }
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
    const result: WithApiResult<Survey[]> = await backendService.post(
      '/surveys/query'
    );
    if (result.kind === 'ok') {
      return result.data;
    } else {
      throw new Error(formatError(result));
    }
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
    const { id, ...data } = survey;
    const result: WithApiResult<{ id: string }> = await backendService.post(
      '/surveys/create',
      {
        data: {
          ...data,
          _id: id,
        },
      }
    );
    if (result.kind === 'ok') {
      return result.data.id;
    } else {
      throw new Error(formatError(result));
    }
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
    const result: WithApiResult<boolean> = await backendService.post(
      '/surveys/update',
      {
        id,
        data,
      }
    );
    if (result.kind === 'ok') {
      return result.data;
    } else {
      throw new Error(formatError(result));
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return false;
  }
};
