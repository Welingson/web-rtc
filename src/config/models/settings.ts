import { createModel } from '@rematch/core';

export interface SettingsState {
  drawer: boolean;
}

export const settings = createModel()({
  state: {
    drawer: true,
  } as SettingsState,
  reducers: {
    toggleDrawer(state) {
      return {
        ...state,
        drawer: !state.drawer,
      };
    },
  },
  effects: (dispatch) => ({}),
});
