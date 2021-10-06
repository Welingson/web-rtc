import JsSIP from 'jssip';
import { AnswerOptions } from 'jssip/lib/RTCSession';

import { CallOptions } from 'jssip/lib/UA';

import JSipClass from '../JSSIP/Class';

import {
  registrationEventHandlers,
  eventHandlersCall,
  eventHandlersDtmf,
} from './Events';

import { startDtmfTone, stopRingTone } from './Sounds';

const socket = new JsSIP.WebSocketInterface(
  `wss://${process.env.REACT_APP_URL_WS}`,
);
/** register */
export const registerRamal = (
  password: string,
  ramal: string,
  displayName: string,
) => {
  const configuration = {
    sockets: [socket],
    register: true,
    uri: `sip:${ramal}${process.env.REACT_APP_URI}`,
    password: password,
    display_name: displayName,
    realm: process.env.REACT_APP_REALM as string,
    register_expires: 1800,
    outbound_proxy_set: process.env.REACT_APP_OUTBOUND_PROXY_SET as string,
    authorization_user: ramal,
    // hack_via_ws: true,
  };

  console.log(configuration);
  
  JSipClass.ua = new JsSIP.UA(configuration);
  
  JSipClass.ua.start();
  registrationEventHandlers();
};

/** Unregister */
export const unRegister = () => {
  var options = {
    all: true,
  };
  JSipClass?.ua?.unregister(options);
  registrationEventHandlers();
  JSipClass.ua = undefined;
};

/** Make call */
export const makeCall = (target: string) => {
  JSipClass.remoteAudio = document.getElementById('audio_remote');

  const options: CallOptions = {
    eventHandlers: eventHandlersCall,
    mediaConstraints: { audio: true, video: false },
  };

  console.log(JSipClass.ua);
  
  if (JSipClass.ua) {
    if (target) {
      JSipClass.call = JSipClass.ua.call(target, options);
    } else {
      alert('Target is undefined');
    }
  } else {
    alert('UA is undefined');
  }
};

/** answer */
export const answer = () => {
  JSipClass.remoteAudio = document.getElementById('audio_remote');
  const options: AnswerOptions = {
    rtcOfferConstraints: {
      offerToReceiveAudio: true,
      offerToReceiveVideo: false,
    },
    mediaConstraints: {
      audio: true, // only audio calls
      video: false,
    },
  };

  try {
    if (JSipClass.call) {
      stopRingTone();
      JSipClass.call.answer(options);
      addStream();
    }
  } catch (error) {
    console.log(error);
  }
};

function addStream() {
  JSipClass.call.connection.addEventListener('addstream', (ev) => {
    /**
     * Embora o tipo Event não define o objeto stream, nos logs
     * do console é possível encontrá-lo.
     */
    const { stream } = ev as any;
    JSipClass.remoteAudio.srcObject = stream;
    JSipClass.remoteAudio.play();
  });
}

/** reject call (or hang up it) */
export const hangUp = () => {
  const options = {
    status_code: 603,
    reason_phrase: 'Decline',
  };
  stopRingTone();
  JSipClass.call.terminate(options);
};

/** send DTMF */
export const sendDTMFTone = (tone: string) => {
  const options = {
    duration: 160,
    eventHandlers: eventHandlersDtmf,
  };
  startDtmfTone(tone);
  JSipClass.call.sendDTMF(tone, options);
};

export const mute = () => {
  const options = { audio: true, video: true };
  JSipClass.call.mute(options);
};

export const unMute = () => {
  const options = { audio: true, video: false };
  JSipClass.call.unmute(options);
};

export const isMuted = () => JSipClass.call.isMuted().audio;
