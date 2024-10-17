import { toast } from '@/components/hooks/use-toast';
import { ResponsesService } from '@/services/responses';
import formatError from '@/utils/formatError';

import { Response } from '../type';

export const getResponses = async (surveyId: string): Promise<Response[]> => {
  try {
    const responseResult = ResponsesService.queryResponses(surveyId);
    return responseResult;
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
    const responseResult = await ResponsesService.createResponse(data);
    return { id: responseResult };
  } catch (error: any) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return { id: '' };
  }
};
