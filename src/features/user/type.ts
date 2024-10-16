export type User = {
  uid: string;
  email: string;
  avatar: string;
  unit: string;
  displayName: string;
};

export type UserStoreState = {
  handling: boolean;
  information?: User;
  users: CustomObject<User>;
};

export type UserStoreActions = {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  addUser: (email: string, userInfo: Partial<User>) => Promise<void>;
  updateUser: (email: string, userInfo: Partial<User>) => Promise<void>;
  deleteUser: (email: string) => Promise<void>;
  getUsers: (filter?: CustomObject<string>) => Promise<void>;
};
