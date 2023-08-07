import { Server } from 'socket.io';

let io = null;

export const initIO = (server) => {

    io = new Server(server, {
        cors: {
            origin: true
        }
    })

    return io;

}

export const getIO = () => {
    return io ? io : console.error("Socket não iniciado");
}