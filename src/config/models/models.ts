import { Models } from '@rematch/core';

import { User } from './user';
import { Client } from './client';
import { Token } from './token';
import { pausas } from './pausas';
import { agente } from './agente';
import { actions } from './actions';
import { settings } from './settings';

export interface RootModel extends Models<RootModel> {
  Token: typeof Token;
  User: typeof User;
  Client: typeof Client;
  pausas: typeof pausas;
  agente: typeof agente;
  actions: typeof actions;
  settings: typeof settings;
}

export const models: RootModel = { Token, User, Client, pausas, agente, actions, settings };
