import { React, useEffect, useState } from "react"

import { api } from "../api/api"

import { useAuth } from "../context/authContext";

import { socket } from "../services/socket";

export function Home() {

  const [users, setUsers] = useState([]);
  const { authState, clearAuthState } = useAuth();

  useEffect(() => {

    function loggedUser(user) {
      setUsers(prevUsers => [...prevUsers, user.user])

    }

    function loggedOut(user) {

      setUsers(users.filter((u) => u.id !== user.id))
    }

    function answerCall(from) {
      console.log('Chamada recebida de: ' + from);
    }

    socket.on('logged', loggedUser)
    socket.on('loggedOut', loggedOut);
    socket.on('answerCall', answerCall);

    return () => {
      socket.off('logged', loggedUser)
      socket.off('loggedOut', loggedOut)
      socket.off('answerCall', answerCall);

    }

  }, [users])

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

  
  const handleCall = (user) => {

    socket.emit('offerCall', { user: user, from: authState.user.user });
  }

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