import { init, RematchDispatch, RematchRootState } from '@rematch/core';
import createPersistPlugin from '@rematch/persist';
import storage from 'redux-persist/lib/storage';

import { models, RootModel } from './models/models';

const persistPlugin = createPersistPlugin<
  typeof models,
  RootModel,
  Record<string, never>
>({
  key: 'antares',
  storage,
  whitelist: ['Token', 'User', 'settings', 'Client'],
  version: 1,
});

export const store = init<RootModel>({
  models,
  plugins: [persistPlugin],
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
