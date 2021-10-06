import {
  EndEvent,
  SendingEvent,
  IncomingEvent,
  OutgoingEvent,
  ConnectingEvent,
  MediaConstraints,
  IncomingInfoEvent,
  OutgoingInfoEvent,
  RTCSessionEventMap,
} from 'jssip/lib/RTCSession';

import {
  ConnectedEvent,
  UAConnectingEvent,
  UnRegisteredEvent,
  OutgoingRTCSessionEvent,
  IncomingRTCSessionEvent,
} from 'jssip/lib/UA';

import { IncomingResponse } from 'jssip/lib/SIPMessage';
import { DisconnectEvent } from 'jssip/lib/WebSocketInterface';

import toast from 'react-hot-toast';

import { startRingTone, stopRingTone } from '../Sounds';

import JSipClass from '../Class';

import { store } from '../../config/store';

const { dispatch } = store;

let eventCodeCallback: React.Dispatch<React.SetStateAction<number>>;
let eventIncomingCall: React.Dispatch<React.SetStateAction<boolean>>;
let eventInCallCallback: React.Dispatch<React.SetStateAction<boolean>>;

export const setCallbackEventCode = (
  fn: React.Dispatch<React.SetStateAction<number>>,
) => {
  eventCodeCallback = fn;
};

export const setCallbackInCall = (
  fn: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  eventInCallCallback = fn;
};

export const setCallbackIncomingCall = (
  fn: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  eventIncomingCall = fn;
};

/** log events when registering */
export const registrationEventHandlers = () => {
  JSipClass.ua?.on('connecting', function (e: UAConnectingEvent) {
    console.log('connecting: ', e);
  });

  JSipClass.ua?.on('connected', function (e: ConnectedEvent) {
    console.log('connected: ', e);
  });

  JSipClass.ua?.on('disconnected', function (e: DisconnectEvent) {
    console.log('disconnected--: ', e);
    eventCodeCallback(1006);
    JSipClass?.ua?.stop();
  });

  JSipClass.ua?.on('registered', function ({ response }) {
    eventCodeCallback(response.status_code);

    console.log('registered: ', response);
  });

  JSipClass.ua?.on('unregistered', function (e: UnRegisteredEvent) {
    console.log('unregistered: ', e);
  });

  JSipClass.ua?.on('registrationFailed', function (e: UnRegisteredEvent) {
    eventCodeCallback(e.response.status_code);
    console.log('registrationFailed with cause: ', e.cause);
    console.log('registrationFailed response: ', e.response);
    JSipClass.ua?.stop();
    JSipClass.ua?.unregister({ all: true });
    JSipClass.ua = undefined;
  });

  JSipClass?.ua?.on(
    'newRTCSession',
    function (e: IncomingRTCSessionEvent | OutgoingRTCSessionEvent) {
      JSipClass.remoteAudio = document.getElementById('audio_remote');
      console.log('newRTCSession', e);
      JSipClass.call = e.session;

      dispatch.actions.setCallNumberAsync(e.session.remote_identity.uri.user);

      if (JSipClass.call.direction === 'incoming') {
        console.log('incoming call');

        eventIncomingCall(true);
        eventInCallCallback(true);

        dispatch.actions.setInCallAsync(true);
        dispatch.actions.setFailToCallAsync(false);
        dispatch.actions.setMessageAsync('Chamada recebida');

        startRingTone();
      }

      if (JSipClass.call.direction === 'outgoing') {
        console.log('outgoing');

        dispatch.actions.setInCallAsync(true);
        dispatch.actions.setFailToCallAsync(false);
        dispatch.actions.setMessageAsync('Chamada em andamento');
      }

      JSipClass.call.on(
        'progress',
        function (e: IncomingEvent | OutgoingEvent) {
          console.log('progress -- ', e);
        },
      );

      JSipClass.call.on(
        'accepted',
        function (e: IncomingEvent | OutgoingEvent) {
          console.log('accepted -- ', e);
        },
      );

      JSipClass.call.on(
        'newInfo',
        function (e: IncomingInfoEvent | OutgoingInfoEvent) {
          console.log('newInfo', e);
        },
      );

      JSipClass.call.on(
        'confirmed',
        function (e: IncomingEvent | OutgoingEvent) {
          console.log('confirmed --', e);
        },
      );

      JSipClass.call.on('ended', function (e: EndEvent) {
        console.log('ended --', e);

        eventIncomingCall(false);
        eventInCallCallback(false);

        dispatch.actions.setInCallAsync(false);
        dispatch.actions.setCallEndedAsync(true);
        dispatch.actions.setMessageAsync('Chamada encerrada');
        dispatch.actions.setCallNumberAsync('');
      });

      JSipClass.call.on('failed', function (e: EndEvent) {
        console.log('failed --', e);

        stopRingTone();

        eventIncomingCall(false);
        eventInCallCallback(false);

        dispatch.actions.setInCallAsync(false);
        dispatch.actions.setCallEndedAsync(true);
        dispatch.actions.setFailToCallAsync(true);

        if (e.cause === 'Canceled') {
          toast.error('O chamador encerrou a chamada.');
        } else {
          dispatch.actions.setMessageAsync('Falha na ligação');
        }
        dispatch.actions.setCallNumberAsync('');
      });
    },
  );
};

/** log callbacks for call events  */
export const eventHandlersCall: Partial<RTCSessionEventMap> = {
  connecting: function (e: ConnectingEvent) {
    console.log('CONNECTING: ', e);
  },

  sending: function (e: SendingEvent) {
    console.log('SENDING: call is sending', e);
    eventInCallCallback(true);
  },

  progress: function (e: IncomingEvent | OutgoingEvent) {
    console.log('PROGRESS: call is in progress', e);
    JSipClass.call.connection.addEventListener('track', (ev: RTCTrackEvent) => {
      JSipClass.remoteAudio.srcObject = ev.streams[0];
      JSipClass.remoteAudio.play();
    });
  },

  accepted: function (e: IncomingEvent | OutgoingEvent) {
    console.log('ACCEPTED: call accepted ', e);
  },

  confirmed: function (e: IncomingEvent | OutgoingEvent) {
    console.log('CONFIRMED: call confirmed', e);
  },

  ended: function (e: EndEvent) {
    eventIncomingCall(false);
    eventInCallCallback(false);
    console.log('ENDED: ', e);
  },

  failed: function (e: EndEvent) {
    console.log('FAILED: ');
    console.log('call failed with originator: ' + e.originator);
    console.log('call failed with cause:      ' + e.cause);
    console.log('call failed with message:    ' + e.message);
  },

  muted: function (e: MediaConstraints) {
    console.log('Mute', e);
  },

  unmuted: function (e: MediaConstraints) {
    console.log('unMuted', e);
  },
};

/** log callbacks DTMF events */
export const eventHandlersDtmf = {
  sending: function (e: IncomingResponse) {
    console.log('sending', e);
  },

  succeeded: function (e: IncomingResponse) {
    console.log('succeeded', e);
  },

  failed: function (e: IncomingResponse) {
    console.log('failed', e);
  },
};
