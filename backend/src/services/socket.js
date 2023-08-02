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

// export const io = new Server({
//     cors: {
//         origin: true
//     }
// }).listen(3333).on("connection", (socket) => {

//     //cria a sala quando o usuário entra no home do app após login
//     socket.on("createRoom", (user) => {
//         socket.join(user);
//     })

//     //envia para outro usuário uma notificação de chamada
//     socket.on("offerCall", (user) => {
//         io.to(user.to).emit("offerCall", user.from);
//     })

//     //envia notificação quando o usuário aceita chamada
//     socket.on("answerCall", (user) => {
//         io.to(user.to).emit("answerCall", user.from);

//     })

//     //adiciona os candidados ICE
//     socket.on("candidate", (event)=>{
//         io.to(event.sendTo).emit("candidate", event);
//     })

//     //envia oferta (offer)
//     socket.on("offer", (event) => {
//         io.to(event.receiver).emit("offer", { event: event.sdp, caller: event.caller })
//     })

//     //envia responsta (answer)
//     socket.on("answer", (event) => {
//         io.to(event.caller).emit("answer", event.sdp);
//     })
// })