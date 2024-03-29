import { getIO } from "./socket.js";

export const callSignaling = () => {

    const io = getIO();

    io.on("connection", (socket) => {
      
        // cria a sala quando o usuário entra no home do app após login
        socket.on("createRoom", (user) => {
            socket.join(user);
        })

        //envia para outro usuário uma notificação de chamada
        socket.on("callNotification", (user) => {
            io.to(user.to).emit("callNotification", user.from);
        })

        //envia notificação quando o usuário aceita chamada
        socket.on("replyCallNotification", (user) => {
            io.to(user.to).emit("replyCallNotification", user.from);
        })

        //envia notificação de chamada recusada
        socket.on("rejectedCall", (user) => {
            io.to(user.to).emit("rejectedCall", user.from);
        })

        //adiciona os candidados ICE
        socket.on("candidate", (event) => {
            io.to(event.sendTo).emit("candidate", event);
        })

        //envia oferta (offer)
        socket.on("offer", (event) => {
            io.to(event.receiver).emit("offer", { event: event.sdp, caller: event.caller })
        })

        //envia responsta (answer)
        socket.on("answer", (event) => {
            io.to(event.caller).emit("answer", event.sdp);
        })

        //sinalização de encerramento de conexão webrtc
        socket.on("closeConnection", (user) => {
            io.to(user.to).emit("closeConnection", user.from);
        })
    })
}