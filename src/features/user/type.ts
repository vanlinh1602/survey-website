export type User = {
  uid: string;
  email: string;
  avatar: string;
  displayName: string;
};

export type UserStoreState = {
  handling: boolean;
  information?: User;
};

export type UserStoreActions = {
  login: () => Promise<void>;
  logout: () => Promise<void>;
};
