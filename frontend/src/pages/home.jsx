import { React, useEffect, useState } from "react"

import { api } from "../api/api"

import { useAuth } from "../context/authContext";

import {
  getUserMedia,
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
import { Call } from "../components/Call";

export function Home() {

  const [users, setUsers] = useState([]);
  const { authState, clearAuthState } = useAuth();

  const [openModalCall, setOpenModalCall] = useState(false);

  const [userCall, setUserCall] = useState('')
  const [callEvents, setCallEvents] = useState('');

  useEffect(() => {
    socket.emit('createRoom', authState.user);

    return () => {
      socket.off('createRoom')
    }
  }, []);

  useEffect(() => {

    function loggedUser(user) {
      setUsers(prevUsers => [...prevUsers, user.data])
    }

    function loggedOut(user) {
      setUsers(users.filter((u) => u.id !== user.id))
    }

    async function offerCall(from) {
      console.log("Chamada recebida de " + from);

      if (confirm("Chamada recebida de " + from)) {
        if (await getUserMedia()) {
          socket.emit("answerCall", { from: authState.user, to: from });
          setOpenModalCall(true);
          setUserCall(from)
        }
      }
    }

    async function answerCall(user) {
      console.log(user + " aceitou sua chamada");
      if (await getUserMedia()) {

        //seta o nome do usuário que faz a chamada
        setCaller(authState.user);

        //seta o nome do usuário que aceita a chamada
        setReceiver(user);

        //seta true
        setIsCaller();

        createPeerConnection();
        initCreateOffer();

        setCallEvents('')

      };

    }

    function candidate(event) {
      initIceCandidate(event);
    }


    function offer(sessionDesc) {
      console.log("Oferta recebida de: " + sessionDesc.caller, sessionDesc);

      //seta o usuário receptor
      setReceiver(authState.user);
      //seta o usuário que faz a chamada
      setCaller(sessionDesc.caller)
      initCreateAnswer(sessionDesc.event);
    }

    function answer(event) {
      initSetRemoteDescription(event);
    }

    socket.on('login', loggedUser)
    socket.on('logout', loggedOut);

    socket.on('offerCall', offerCall);
    socket.on('answerCall', answerCall);
    socket.on('candidate', candidate);
    socket.on('offer', offer)
    socket.on('answer', answer)

    return () => {
      socket.off('login', loggedUser)
      socket.off('logout', loggedOut)

      socket.off('offerCall', offerCall);
      socket.off('answerCall', answerCall);
      socket.off('candidate', candidate);
      socket.off('offer', offer)
      socket.off('answer', answer)

    }

  }, [users])

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

  //emite uma notificação de chamada
  const handleCall = (user) => {
    setOpenModalCall(true);
    setUserCall(user);
    setCallEvents('waitingReply');

    socket.emit('offerCall', { to: user, from: authState.user });

  }
  //desconecta o usuário
  const handleLogout = async () => {
    await api.post('/logout', { id: authState.id });

    clearAuthState();

  }

  const closeModal = () => {
    setOpenModalCall(false);
  }


  return (
    <>
      <section>
        <h1>Usuários</h1>

        <p>Usuário logado: {authState.user}</p>
        <button onClick={handleLogout}>Sair</button>
        <hr />

        <UsersTable users={users} handleCall={handleCall} />

        {openModalCall && <Call closeModal={closeModal} userCall={userCall} callEvents={callEvents}/>}
      </section>

    </>
  )
}