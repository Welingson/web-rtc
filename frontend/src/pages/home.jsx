import { React, useEffect, useState } from "react"

import { api } from "../api/api"

import { useAuth } from "../context/authContext";

import {
  createSocketRoom,
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

import { getClientIO } from "../services/socket";
import { UsersTable } from "../components/UserTable";
import { Call, WaitingReply, DisconnectCall, IncomingCall } from "../components/Call";
import { pauseAudio, playAudio } from "../utils/audioUtils";

export function Home() {

  //lista de usuários
  const [users, setUsers] = useState([]);

  //dados de autenticação
  const { authState, clearAuthState } = useAuth();

  //socket
  const socketClient = getClientIO();

  //controla o componente de chamada 
  const [openModalCall, setOpenModalCall] = useState(false);

  const [openModalWaitingReply, setOpenModalWaitingReply] = useState(false);
  const [openModalDisconnect, setOpenModalDisconnect] = useState(false);
  const [disconnectMessage, setDisconnectMessage] = useState('');
  const [openIncomingCall, setOpenIncomingCall] = useState(false);
  const [userCall, setUserCall] = useState(null)

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
    createSocketRoom(authState.user)
  }, []);

  //atualiza a lista de usuários quando há login e logout
  useEffect(() => {

    function loggedUser(user) {
      const loggedUser = (users.filter((u)=>u.user === user.data.user)).length;
      if(loggedUser === 0) setUsers(prevUsers => [...prevUsers, user.data]);

    }
    function loggedOut(user) {
      setUsers(users.filter((u) => u.id !== user.id))
    }

    socketClient.on('login', loggedUser)
    socketClient.on('logout', loggedOut);

    return () => {
      socketClient.off('login', loggedUser)
      socketClient.off('logout', loggedOut)
    }

  })


  //troca de informações de chamada
  useEffect(() => {

    //recebe a oferta de chamada
    function callNotification(from) {

      setUserCall(from)
      setOpenIncomingCall(true)
      setOpenModalDisconnect(false)

      //toque ao receber chamada
      playAudio('./audios/ringtone.wav', 1000)

    }

    //receba a resposta da oferta de chamada
    async function replyCallNotification(user) {

      //para a reprodução do toque
      pauseAudio()

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
      pauseAudio()
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

    socketClient.on('callNotification', callNotification);
    socketClient.on('replyCallNotification', replyCallNotification);
    socketClient.on('rejectedCall', rejectedCall)
    socketClient.on('candidate', candidate);
    socketClient.on('offer', offer)
    socketClient.on('answer', answer)
    socketClient.on('closeConnection', handleCloseConnection);
    
    //futura notificação de erro
    socketClient.on('connect_error', (err) => {
      console.log(err.message);
    });


    return () => {
      socketClient.off('callNotification', callNotification);
      socketClient.off('replyCallNotification', replyCallNotification);
      socketClient.off('rejectedCall', rejectedCall)
      socketClient.off('candidate', candidate);
      socketClient.off('offer', offer);
      socketClient.off('answer', answer);
      socketClient.off('closeConnection', handleCloseConnection);
      socketClient.off('connect_error');

    }

  }, [users])

  //ação do botão de "aceitar" ou "rejeitar" chamada
  const handleIncomingCall = async (responseCall) => {

    //para a reprodução do toque
    pauseAudio();

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

    return;
  }


  //emite uma notificação de chamada
  const handleCallNotification = (user) => {

    emitCallNotification({ to: user, from: authState.user })

    setUserCall(user);
    setOpenModalWaitingReply(true);
    
    //toque ao aguardar resposta
    playAudio('./audios/ringbacktone.wav', 1000);

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