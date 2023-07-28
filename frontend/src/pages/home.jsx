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

export function Home() {

  const [users, setUsers] = useState([]);
  const { authState, clearAuthState } = useAuth();

  useEffect(() => {
    socket.emit('createRoom', authState.user.user);

    return () => {
      socket.off('createRoom')
    }
  }, []);

  useEffect(() => {

    function loggedUser(user) {
      setUsers(prevUsers => [...prevUsers, user.user])
    }

    function loggedOut(user) {
      setUsers(users.filter((u) => u.id !== user.id))
    }

    async function offerCall(from) {
      console.log("Chamada recebida de " + from);

      if (confirm("Chamada recebida de " + from)) {
        if (await getUserMedia()) {
          socket.emit("answerCall", { from: authState.user.user, to: from });

        }
      }

      // if (await getUserMedia()) {

      // }

    }

    async function answerCall(user) {
      console.log(user + " aceitou sua chamada");
      if (await getUserMedia()) {

        //seta o nome do usuário que faz a chamada
        setCaller(authState.user.user);

        //seta o nome do usuário que aceita a chamada
        setReceiver(user);

        //seta true
        setIsCaller();

        createPeerConnection();
        initCreateOffer();

      };

    }

    function candidate(event) {
      initIceCandidate(event);
    }

    function offer(sessionDesc) {
      console.log("Oferta recebida de: " + sessionDesc.caller, sessionDesc);

      //seta o usuário receptor
      setReceiver(authState.user.user);

      //seta o usuário que faz a chamada
      setCaller(sessionDesc.caller)

      initCreateAnswer(sessionDesc.event);
    }

    function answer(event) {
      initSetRemoteDescription(event);
    }

    socket.on('logged', loggedUser)
    socket.on('loggedOut', loggedOut);
    socket.on('offerCall', offerCall);
    socket.on('answerCall', answerCall);
    socket.on('candidate', candidate);
    socket.on('offer', offer)
    socket.on('answer', answer)

    return () => {
      socket.off('logged', loggedUser)
      socket.off('loggedOut', loggedOut)
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

        const data = await api.get('/').then((response) => {
          return response.data;
        });

        if (data) setUsers(data)

      } catch (error) {
        console.error('Falha ao buscar dados: ', error);

      }
    }

    loadUsers();

  }, [])

  //emite uma oferta de chamada
  const handleCall = (user) => {
    socket.emit('offerCall', { to: user, from: authState.user.user });

  }
  //desconecta o usuário
  const handleLogout = async () => {
    await api.post('/auth/logout', { id: authState.user.id });

    clearAuthState();

  }



  return (
    <>
      <h1>Usuários</h1>

      <p>Usuário logado: {authState.user.user}</p>
      <button onClick={handleLogout}>Sair</button>
      <hr />

      <table>
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            if (user.user !== authState.user.user) {
              return (
                <tr key={index}>
                  <td>{user.user}</td>
                  <td><button onClick={() => { handleCall(user.user) }}>Ligar</button></td>
                </tr>
              )
            }
          })}
        </tbody>
      </table >
    </>
  )
}