import { socket } from "./socket";

let localStream;
let rtcPeerConnection;
let remoteStream;

let isCaller = false;
let receiver = null;
let caller = null;

let remoteAudio = document.getElementById("remoteAudio");

let iceServers = {
    iceServers: [
        { 'urls': 'stun:stun.l.google.com:19302' },  
    ],
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

function onAddStream(event) {

    remoteAudio.srcObject = event.stream

    remoteStream = event.stream;
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

    socket.emit('offer', {
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

    socket.emit('answer', {
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

    console.log(event.candidate);

    if (event.candidate) {
        socket.emit("candidate", {
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

    rtcPeerConnection.onaddstream = onAddStream;
    rtcPeerConnection.addStream(localStream);



}




