import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { UsersService } from '@/services/users';

import { login, signOut } from './api';
import { User, UserStoreActions, UserStoreState } from './type';

const initialState: UserStoreState = {
  handling: false,
  users: {},
};

export const useUserStore = create<UserStoreState & UserStoreActions>()(
  devtools((set) => ({
    ...initialState,
    login: async () => {
      set(
        () => ({
          handling: true,
          information: undefined,
        }),
        false,
        { type: 'user/login' }
      );
      const information = await login();
      set(
        () => ({
          handling: false,
          information,
        }),
        false,
        { type: 'user/login', information }
      );
    },
    logout: async () => {
      set(() => ({ handling: true }), false, {
        type: 'user/logout',
      });
      await signOut();
      set(() => ({ handling: false, information: undefined }), false, {
        type: 'user/logout',
      });
      window.location.reload();
    },
    addUser: async (email: string, userInfo: Partial<User>) => {
      set(
        () => ({
          handling: true,
        }),
        false,
        { type: 'user/addUser', email }
      );
      await UsersService.createUser(email, userInfo);
      set(
        (state) => ({
          handling: false,
          users: {
            ...state.users,
            [email]: {
              uid: userInfo.uid || '',
              email,
              avatar: userInfo.avatar || '',
              displayName: userInfo.displayName || '',
              unit: userInfo.unit || '',
            },
          },
        }),
        false,
        {
          type: 'user/addUser',
          email,
        }
      );
    },
    updateUser: async (email: string, userInfo: Partial<User>) => {
      set(
        () => ({
          handling: true,
        }),
        false,
        { type: 'user/updateUser', email }
      );
      await UsersService.updateUser(email, userInfo);
      set(
        (state) => ({
          handling: false,
          users: {
            ...state.users,
            [email]: {
              uid: userInfo.uid || '',
              email,
              avatar: userInfo.avatar || '',
              displayName: userInfo.displayName || '',
              unit: userInfo.unit || '',
            },
          },
        }),
        false,
        {
          type: 'user/updateUser',
          email,
        }
      );
    },
    deleteUser: async (email: string) => {
      set(
        () => ({
          handling: true,
        }),
        false,
        { type: 'user/deleteUser', email }
      );
      await UsersService.deleteUser(email);
      set(
        (state) => {
          const users = { ...state.users };
          delete users[email];
          return {
            handling: false,
            users,
          };
        },
        false,
        { type: 'user/deleteUser', email }
      );
    },
    getUsers: async (filter) => {
      set(
        () => ({
          handling: true,
        }),
        false,
        { type: 'user/getUsers' }
      );
      const users = await UsersService.queryUsers(filter);
      set(
        () => ({
          handling: false,
          users: users.reduce((acc, user) => {
            acc[user.email] = user;
            return acc;
          }, {} as Record<string, User>),
        }),
        false,
        { type: 'user/getUsers' }
      );
    },
  }))
);
