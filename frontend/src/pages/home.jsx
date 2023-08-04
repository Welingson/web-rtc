import { React, useEffect, useState } from "react"

import { api } from "../api/api"

import { useAuth } from "../context/authContext";

import {
  emitCallNotification,
  emitReplyCallNotification,
  emitCloseConnection,
  emitRejectCall,
  getUserMedia,
  closeConnection,
  createPeerConnection,
  initCreateOffer,
  initCreateAnswer,
  initIceCandidate,
  setCaller,
  setIsCaller,
  setReceiver,
  initSetRemoteDescription
} from "../services/call";

import { socket } from "../services/socket";
import { UsersTable } from "../components/UserTable";
import { Call, WaitingReply, DisconnectCall, IncomingCall } from "../components/Call";

export function Home() {

  //lista de usuários
  const [users, setUsers] = useState([]);

  //dados de autenticação
  const { authState, clearAuthState } = useAuth();

  //controla o componente de chamada 
  const [openModalCall, setOpenModalCall] = useState(false);

  const [openModalWaitingReply, setOpenModalWaitingReply] = useState(false);
  const [openModalDisconnect, setOpenModalDisconnect] = useState(false);
  const [disconnectMessage, setDisconnectMessage] = useState('');
  const [openIncomingCall, setOpenIncomingCall] = useState(false);
  const [userCall, setUserCall] = useState(null)

  const [waitingReplyAudio, setWaitingReplyAudio] = useState(null);
  const [incomingCallAudio, setIncomingCallAudio] = useState(null);

  //carrega os usuários
  useEffect(() => {

    const loadUsers = async () => {

      try {

        const data = await api.get('/user').then((response) => {
          return response.data.data;
        });

        if (data) setUsers(data)

      } catch (error) {
        console.error('Falha ao buscar dados: ', error);
      }
    }

    loadUsers();

  }, [])

  /**
  * quando o componente é montado o servidor socket cria
  * a room do usuário
   */
  useEffect(() => {


    socket.emit('createRoom', authState.user);
    return () => {
      socket.off('createRoom')
    }
  }, []);

  //atualiza a lista de usuários quando há login e logout
  useEffect(() => {

    function loggedUser(user) {
      setUsers(prevUsers => [...prevUsers, user.data])
    }
    function loggedOut(user) {
      setUsers(users.filter((u) => u.id !== user.id))
    }

    socket.on('login', loggedUser)
    socket.on('logout', loggedOut);

    return () => {
      socket.off('login', loggedUser)
      socket.off('logout', loggedOut)
    }

  })

  useEffect(()=>{

  
    setWaitingReplyAudio(document.getElementById('waitingReply'));
    setIncomingCallAudio(document.getElementById('incomingCall'));

    document.getElementById('waitingReply').addEventListener('click', ()=>{
      waitingReplyAudio.play();
    })

    document.getElementById('incomingCall').addEventListener('click', ()=>{
      incomingCallAudio.play();
    })


  }, [waitingReplyAudio, incomingCallAudio])

  //troca de informações de chamada
  useEffect(() => {

    //recebe a oferta de chamada
    function callNotification(from) {

      setUserCall(from)
      setOpenIncomingCall(true)

      //toque de chamada recebida
      // handlePlayIncomingCallSound();

    }

    //receba a resposta da oferta de chamada
    async function replyCallNotification(user) {
      if (await getUserMedia()) {

        //seta o nome do usuário que faz a chamada
        setCaller(authState.user);

        //seta o nome do usuário que aceita a chamada
        setReceiver(user);

        //seta true para controle de candidatos ICE
        setIsCaller();

        createPeerConnection();
        initCreateOffer();

        //fecha o modal de 'aguardando resposta'
        setOpenModalWaitingReply(false)
        //abre o modal de chamada
        setOpenModalCall(true)

      };

    }

    function rejectedCall(user) {
      setOpenModalWaitingReply(false);
      setDisconnectMessage(`${user} rejeitou sua chamada.`);
      setOpenModalDisconnect(true);
    }

    function candidate(event) {
      initIceCandidate(event);
    }


    function offer(sessionDesc) {

      //seta o usuário receptor
      setReceiver(authState.user);
      //seta o usuário que faz a chamada
      setCaller(sessionDesc.caller)
      initCreateAnswer(sessionDesc.event);
    }

    function answer(event) {
      initSetRemoteDescription(event);
    }

    function handleCloseConnection(user) {
      closeConnection();
      setOpenModalCall(false);
      setDisconnectMessage(`${user} desconectou.`)
      setOpenModalDisconnect(true);
    }



    socket.on('callNotification', callNotification);
    socket.on('replyCallNotification', replyCallNotification);
    socket.on('rejectedCall', rejectedCall)

    socket.on('candidate', candidate);
    socket.on('offer', offer)
    socket.on('answer', answer)
    socket.on('closeConnection', handleCloseConnection);


    return () => {
      socket.off('callNotification', callNotification);
      socket.off('replyCallNotification', replyCallNotification);
      socket.off('rejectedCall', rejectedCall)

      socket.off('candidate', candidate);
      socket.off('offer', offer);
      socket.off('answer', answer);
      socket.off('closeConnection', handleCloseConnection);

    }

  }, [users])

  const handlePlayWaitingReplySound = () => {
    console.log(waitingReplyAudio);
  }

  const handlePlayIncomingCallSound = () => {
    console.log(incomingCallAudio);
  }

  const handleIncomingCall = async (responseCall) => {

    if (!responseCall) {
      emitRejectCall({ from: authState.user, to: userCall })
      setOpenIncomingCall(false);
      return;
    }

    if (await getUserMedia()) {
      emitReplyCallNotification({ from: authState.user, to: userCall })
      setOpenIncomingCall(false)
      setOpenModalCall(true)
    }
  }


  //emite uma notificação de chamada
  const handleCallNotification = (user) => {

    emitCallNotification({ to: user, from: authState.user })

    setUserCall(user);
    setOpenModalWaitingReply(true);
    // handlePlayWaitingReplySound();

  }

  //oculta o componente de info de chamada e encerra conexão webrtc
  const closeCall = () => {
    setOpenModalCall(false);

    if (closeConnection()) emitCloseConnection({ from: authState.user, to: userCall })

  }

  //fecha o componente de 'usuário desconectou'
  const closeDisconnecModal = () => {
    setOpenModalDisconnect(false);
  }

  //desconecta o usuário
  const handleLogout = async () => {
    await api.post('/logout', { id: authState.id });

    clearAuthState();

  }

  return (
    <>
      <section>
        <h1>Home</h1>

        <p>Usuário logado: {authState.user}</p>
        <button onClick={handleLogout}>Sair</button>
        <hr />

        <UsersTable users={users} handleCallNotification={handleCallNotification} />

        {openModalCall &&
          <Call
            closeCall={closeCall}
            userCall={userCall}
          />
        }
        {openModalDisconnect &&
          <DisconnectCall
            // userCall={userCall}
            message={disconnectMessage}
            closeDisconnecModal={closeDisconnecModal}
          />
        }
        {
          openModalWaitingReply &&
          <WaitingReply userCall={userCall} />
        }
        {
          openIncomingCall &&
          <IncomingCall
            userCall={userCall}
            handleIncomingCall={handleIncomingCall}
          />
        }

      </section>
    </>
  )
}