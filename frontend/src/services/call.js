import { getClientIO } from "./socket";

let localStream;
let rtcPeerConnection;
let remoteStream;

let isCaller = false;
let receiver = null;
let caller = null;
const socketClient = getClientIO();

let remoteAudio = document.getElementById("remoteAudio");

let iceServers = {
    iceServers: [
        { 'urls': 'stun:stun.l.google.com:19302' },
        {
            urls: "turn:a.relay.metered.ca:80",
            username: "98679aeddcb9c63ef7c54377",
            credential: "uvWhBrBHzlp78zIV",
        },
        {
            urls: "turn:a.relay.metered.ca:80?transport=tcp",
            username: "98679aeddcb9c63ef7c54377",
            credential: "uvWhBrBHzlp78zIV",
        },
        {
            urls: "turn:a.relay.metered.ca:443",
            username: "98679aeddcb9c63ef7c54377",
            credential: "uvWhBrBHzlp78zIV",
        },
        {
            urls: "turn:a.relay.metered.ca:443?transport=tcp",
            username: "98679aeddcb9c63ef7c54377",
            credential: "uvWhBrBHzlp78zIV",
        },
    ],
}

export const createSocketRoom = (user) => {
    socketClient.emit('createRoom', user);
}

export const getUserMedia = async () => {

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        addLocalStream(stream);
        return true;

    } catch (error) {
        console.log('Falha ao acessar mídia do usuário: ' + error);
        return false
    }

}

function addLocalStream(stream) {
    localStream = stream
}

function onAddTrack(event) {
    if (event.track.kind === 'audio') {
        remoteAudio.srcObject = event.streams[0];
    }

    // if (event.track.kind === 'video') {
    //     remoteVideo.srcObject = event.streams[0];
    // }

}

export const setIsCaller = () => {
    isCaller = true;
}

export const setReceiver = (userReceiver) => {
    receiver = userReceiver
}

export const setCaller = (userCaller) => {
    caller = userCaller

}

function setLocalAndOffer(sessionDesc) {

    rtcPeerConnection.setLocalDescription(sessionDesc)

    socketClient.emit('offer', {
        type: 'offer',
        sdp: sessionDesc,
        receiver: receiver,
        caller: caller
    })
}

export const initCreateOffer = () => {

    rtcPeerConnection.createOffer({ offerToReceiveAudio: true })
        .then(desc => setLocalAndOffer(desc))
        .catch(e => console.log(e))
}

function setLocalAndAnswer(sessionDesc) {

    rtcPeerConnection.setLocalDescription(sessionDesc);

    socketClient.emit('answer', {
        type: 'answer',
        sdp: sessionDesc,
        caller: caller
    })
}

export const initSetRemoteDescription = (event) => {
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
}

export const initCreateAnswer = (event) => {

    createPeerConnection();

    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));

    rtcPeerConnection.createAnswer()
        .then(desc => setLocalAndAnswer(desc))
        .catch(e => console.log(e))
}

function onIceCandidate(event) {
    let user = isCaller ? receiver : caller;

    if (event.candidate) {
        socketClient.emit("candidate", {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
            sendTo: user
        })
    }
}

export const initIceCandidate = (event) => {
    var candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate
    });

    rtcPeerConnection.addIceCandidate(candidate);

}

export const createPeerConnection = () => {

    rtcPeerConnection = new RTCPeerConnection(iceServers)

    rtcPeerConnection.onicecandidate = onIceCandidate;
    rtcPeerConnection.ontrack = onAddTrack;
    rtcPeerConnection.addStream(localStream);

}

//encerra conexão webrtc juntamente com a transmissão de audio
export const closeConnection = () => {

    if (!rtcPeerConnection) {
        return false;
    }

    rtcPeerConnection.close();
    localStream.getTracks().forEach(track => track.stop())

    return true;

}

//envia uma notificação de chamada
export const emitCallNotification = (users) => {
    socketClient.emit('callNotification', users)
}

//envia notificaçaõ de resposta da notificação de chamada
export const emitReplyCallNotification = (users) => {
    socketClient.emit('replyCallNotification', users)
}

//envia notificação de usuário desconectado
export const emitCloseConnection = (users) => {
    socketClient.emit('closeConnection', users)
}

//envia notificação de rejeição de chamada
export const emitRejectCall = (users) => {
    socketClient.emit('rejectedCall', users);
}