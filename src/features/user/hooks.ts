import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { login, signOut } from './api';
import { UserStoreActions, UserStoreState } from './type';

const initialState: UserStoreState = {
  handling: false,
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
      set(() => ({ handling: true }), false, { type: 'user/logout' });
      await signOut();
      window.location.reload();
    },
  }))
);
