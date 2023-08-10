import { Server } from 'socket.io';

import jwt from 'jsonwebtoken';

let io = null;

export const initIO = (server) => {

    io = new Server(server, {
        cors: {
            origin: true
        }
    }).use((socket, next) => {
        const token = socket.handshake.auth.token;

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decode) => {
            if (error) return next(new Error('Unauthorized'))

            next();
        })

    })

    return io;

}

export const getIO = () => {
    return io ? io : console.error("Socket não iniciado");
}