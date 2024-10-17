import { getAuth } from 'firebase/auth';

import { toast } from '@/components/hooks/use-toast';
import { backendService } from '@/services';
import { auth } from '@/services/firebase';
import formatError from '@/utils/formatError';

import { User } from '../type';

export const login = async () => {
  try {
    const user = getAuth().currentUser;
    const token: string = (await user?.getIdToken(true)) || '';
    const result: WithApiResult<{ user: User }> = await backendService.post(
      '/api/auth',
      {
        token,
        user: {
          uid: user?.uid || '',
          email: user?.email || '',
          avatar: user?.photoURL || '',
          displayName: user?.displayName || '',
        },
      }
    );
    if (result.kind === 'ok') {
      return result.data.user;
    } else {
      throw new Error(formatError(result));
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: formatError(error),
      variant: 'destructive',
    });
    return undefined;
  }
};

export const signOut = async () => {
  try {
    auth.signOut();
    await backendService.post('/api/signOut');
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: formatError(error),
    });
  }
};
