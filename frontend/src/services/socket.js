import { io } from 'socket.io-client';

let socket = null;

const initClientIO = () => {
    socket = io(import.meta.env.VITE_API_URL, {
        autoConnect: true,
        auth: {
            token: localStorage.getItem('user')
                ? JSON.parse(localStorage.getItem('user')).token : false
        }
    });

    return socket;
}

export const getClientIO = () => {

    if (!socket) {
        return initClientIO()
    }
    return socket;
}
