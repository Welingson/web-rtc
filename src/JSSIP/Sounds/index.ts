import JSipClass from '../Class';

window.onload = (_event: any) => {
  JSipClass.dtmf0 = document.getElementById('dtmf-0');
  JSipClass.dtmf1 = document.getElementById('dtmf-1');
  JSipClass.dtmf2 = document.getElementById('dtmf-2');
  JSipClass.dtmf3 = document.getElementById('dtmf-3');
  JSipClass.dtmf4 = document.getElementById('dtmf-4');
  JSipClass.dtmf5 = document.getElementById('dtmf-5');
  JSipClass.dtmf6 = document.getElementById('dtmf-6');
  JSipClass.dtmf7 = document.getElementById('dtmf-7');
  JSipClass.dtmf8 = document.getElementById('dtmf-8');
  JSipClass.dtmf9 = document.getElementById('dtmf-9');
  JSipClass.dtmfStar = document.getElementById('dtmf-star');
  JSipClass.dtmfHash = document.getElementById('dtmf-hash');
  JSipClass.dtmfTone = document.getElementById('dtmf');

  JSipClass.ringtone = document.getElementById('ringtone');
};

/** <------------ audio functions ---------------> **/

/** DTMF tones */
export function startDtmfTone(tone: string) {
  try {
    switch (tone) {
      case '0':
        JSipClass.dtmf0.play();
        break;
      case '1':
        JSipClass.dtmf1.play();
        break;
      case '2':
        JSipClass.dtmf2.play();
        break;
      case '3':
        JSipClass.dtmf3.play();
        break;
      case '4':
        JSipClass.dtmf4.play();
        break;
      case '5':
        JSipClass.dtmf5.play();
        break;
      case '6':
        JSipClass.dtmf6.play();
        break;
      case '7':
        JSipClass.dtmf7.play();
        break;
      case '8':
        JSipClass.dtmf8.play();
        break;
      case '9':
        JSipClass.dtmf9.play();
        break;
      case '*':
        JSipClass.dtmfStar.play();
        break;
      case '#':
        JSipClass.dtmfHash.play();
        break;
      default:
        JSipClass.dtmfTone.play();
        break;
    }
  } catch (e) {
    console.log('start dtmf error', e);
  }
}

export function startRingTone() {
  try {
    JSipClass.ringtone.play();
  } catch (e) {
    console.log('start ringtone error', e);
  }
}

export function stopRingTone() {
  try {
    JSipClass.ringtone.pause();
  } catch (e) {
    console.log(e);
  }
}
