import { UA } from 'jssip';
import { RTCSession } from 'jssip/lib/RTCSession';
export default abstract class SipClass {
  public static ua: UA | undefined;
  public static call: RTCSession;
  public static remoteAudio: any;

  public static ringtone: any;

  public static dtmf0: any;
  public static dtmf1: any;
  public static dtmf2: any;
  public static dtmf3: any;
  public static dtmf4: any;
  public static dtmf5: any;
  public static dtmf6: any;
  public static dtmf7: any;
  public static dtmf8: any;
  public static dtmf9: any;
  public static dtmfStar: any;
  public static dtmfHash: any;
  public static dtmfTone: any;
}
