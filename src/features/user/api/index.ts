import { getAuth } from 'firebase/auth';

import { toast } from '@/components/hooks/use-toast';
import { auth } from '@/services/firebase';
import { UsersService } from '@/services/users';
import formatError from '@/utils/formatError';

import { User } from '../type';

export const login = async () => {
  try {
    const user = getAuth().currentUser;
    const result = await UsersService.getUser(user?.email || '');
    if (result) {
      const updateUser = {
        email: user?.email || '',
        avatar: user?.photoURL || '',
        displayName: user?.displayName || '',
        uid: user?.uid || '',
      };
      await UsersService.updateUser(user?.email || '', updateUser);
      return {
        ...result,
        ...updateUser,
      };
    } else {
      throw new Error(
        'Tài khoảng chưa được cấp quyền vui lòng liên hệ quản trị viên'
      );
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
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: formatError(error),
    });
  }
};

export const addUser = async (email: string, userInfo: Partial<User>) => {
  try {
    await UsersService.updateUser(email, userInfo);
    return {
      email,
      ...userInfo,
    };
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: formatError(error),
    });
  }
};
