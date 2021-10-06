import { createModel } from '@rematch/core';

type actionsType = {
  autoAnswer: boolean;
  inCall: boolean;
  failToCall: boolean;
  callEnded: boolean;
  callNumber: string;
  message: string;
};

export const actions = createModel()({
  state: {
    autoAnswer: false,
    inCall: false,
    failToCall: false,
    callEnded: false,
    callNumber: '',
    message: '',
  } as actionsType,
  reducers: {
    setAutoAnswer(state, payload) {
      return { ...state, autoAnswer: payload };
    },
    setInCall(state, payload) {
      return { ...state, inCall: payload };
    },
    setFailToCall(state, payload) {
      return { ...state, failToCall: payload };
    },
    setCallEnded(state, payload) {
      return { ...state, callEnded: payload };
    },
    setCallNumber(state, payload) {
      return { ...state, callNumber: payload };
    },
    setMessage(state, payload) {
      return { ...state, message: payload };
    },
  },
  effects: (dispatch) => ({
    async setAutoAnswerAsync(autoAnswer: boolean) {
      dispatch.actions.setAutoAnswer(autoAnswer);
    },

    async setInCallAsync(inCall: boolean) {
      dispatch.actions.setInCall(inCall);
    },

    async setFailToCallAsync(failToCall: boolean) {
      dispatch.actions.setFailToCall(failToCall);
    },

    async setCallNumberAsync(callNumber: string) {
      dispatch.actions.setCallNumber(callNumber);
    },

    async setMessageAsync(message: string) {
      dispatch.actions.setMessage(message);
    },

    async setCallEndedAsync(callEnded: boolean) {
      dispatch.actions.setCallEnded(callEnded);
    },
  }),
});
