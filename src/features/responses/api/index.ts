import { toast } from '@/components/hooks/use-toast';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { Response } from '../type';

export const getResponses = async (surveyId: string): Promise<Response[]> => {
  try {
    const responseResult: WithApiResult<Response[]> = await backendService.post(
      '/responses/query',
      {
        query: { surveyId },
      }
    );
    if (responseResult.kind === 'ok') {
      return responseResult.data;
    } else {
      throw new Error(formatError(responseResult));
    }
  } catch (error: any) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return [];
  }
};

export const createResponse = async (
  data: Partial<Response>
): Promise<{ id: string }> => {
  try {
    const responseResult: WithApiResult<Response> = await backendService.post(
      '/responses/create',
      {
        data,
      }
    );
    if (responseResult.kind === 'ok') {
      return responseResult.data;
    } else {
      throw new Error(formatError(responseResult));
    }
  } catch (error: any) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return { id: '' };
  }
};
