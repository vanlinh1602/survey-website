import { BACKEND } from '@/lib/config';

import Api from './api';

export const backendService = new Api({
  baseURL: BACKEND,
  withCredentials: true,
});
