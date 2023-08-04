import { React, useEffect, useState } from "react"

import { api } from "../api/api"

import { useAuth } from "../context/authContext";

import {
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
import { Call, WaitingReply, DisconnectCall } from "../components/Call";

export function Home() {

  //lista de usuários
  const [users, setUsers] = useState([]);

  //dados de autenticação
  const { authState, clearAuthState } = useAuth();

  //controla o componente de chamada 
  const [openModalCall, setOpenModalCall] = useState(false);

  const [openModalWaitingReply, setOpenModalWaitingReply] = useState(false);
  const [openModalDisconnect, setOpenModalDisconnect] = useState(false);

  const [userCall, setUserCall] = useState(null)

  useEffect(() => {

    //quando o componente é montado o servidor socket cria
    //a room do usuário
    socket.emit('createRoom', authState.user);
    return () => {
      socket.off('createRoom')
    }
  }, []);

  useEffect(() => {

    //atualiza a lista de usuários quando há login e logout
    function loggedUser(user) {
      setUsers(prevUsers => [...prevUsers, user.data])
    }
    function loggedOut(user) {
      setUsers(users.filter((u) => u.id !== user.id))
    }

    //recebe a oferta de chamada
    async function offerCall(from) {

      if (confirm("Chamada recebida de " + from)) {
        if (await getUserMedia()) {
          socket.emit("answerCall", { from: authState.user, to: from });
          setOpenModalCall(true);
          setUserCall(from)
        }
      }
    }

    //receba a resposta da oferta de chamada
    async function answerCall(user) {
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
      setOpenModalDisconnect(true);

    }

    socket.on('login', loggedUser)
    socket.on('logout', loggedOut);

    socket.on('offerCall', offerCall);
    socket.on('answerCall', answerCall);
    socket.on('candidate', candidate);
    socket.on('offer', offer)
    socket.on('answer', answer)
    socket.on('closeConnection', handleCloseConnection);


    return () => {
      socket.off('login', loggedUser)
      socket.off('logout', loggedOut)

      socket.off('offerCall', offerCall);
      socket.off('answerCall', answerCall);
      socket.off('candidate', candidate);
      socket.off('offer', offer);
      socket.off('answer', answer);
      socket.off('closeConnection', handleCloseConnection);

    }

  }, [users])


  //emite uma notificação de chamada
  const handleCall = (user) => {
    socket.emit('offerCall', { to: user, from: authState.user });
    setOpenModalWaitingReply(true);
    setUserCall(user);


  }

  //oculta o componente de info de chamada e encerra conexão webrtc
  const closeCall = () => {
    setOpenModalCall(false);

    if (closeConnection()) socket.emit('closeConnection', { from: authState.user, to: userCall })

  }

  const closeDisconnecModal = () => {
    setOpenModalDisconnect(false);
  }

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

  //desconecta o usuário
  const handleLogout = async () => {
    await api.post('/logout', { id: authState.id });

    clearAuthState();

  }

  return (
    <>
      <section>
        <h1>Usuários</h1>

        <p>Usuário logado: {authState.user}</p>
        <button onClick={handleLogout}>Sair</button>
        <hr />

        <UsersTable users={users} handleCall={handleCall} />

        {openModalCall &&
          <Call
            closeCall={closeCall}
            userCall={userCall}
          />
        }
        {openModalDisconnect &&
          <DisconnectCall
            userCall={userCall}
            closeDisconnecModal={closeDisconnecModal}
          />
        }
        {
          openModalWaitingReply &&
          <WaitingReply userCall={userCall} />
        }

      </section>

    </>
  )
}