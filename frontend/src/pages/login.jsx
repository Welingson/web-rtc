import { React, useState } from 'react'
import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { socket } from '../services/socket';


export function Login() {

    const {authState, updateAuthState} = useAuth();

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const data = await api.post('auth/login', {
                user: user,
                password: password
            }).then((response) => {
                return response.data;
            });

            updateAuthState(data.data, data.token);

            socket.emit("logged", data.data.user)

            navigate('/')

        } catch (error) {
            console.error('Falha ao tentar realizar login: ', error);
        }

    }

    return (
        <>
            <h1>Login</h1>
            <div>
                <form action="" onSubmit={handleLogin}>
                    <label htmlFor="userName">
                        Usuário
                        <input type="text"
                            name="userName"
                            id="userName"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                        />
                    </label>
                    <label htmlFor="password">
                        Senha
                        <input type="password"
                            name="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </label>
                    <button type='submit' disabled={!user.length || !password.length}>Login</button>
                </form>
            </div>
        </>
    )
}