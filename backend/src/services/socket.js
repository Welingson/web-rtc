import { Server } from 'socket.io';

export const io = new Server({
    cors: {
        origin: true
    }
}).listen(3333).on("connection", (socket) => {

    socket.on("createRoom", (user) => {
        socket.join(user);
    })

    socket.on("offerCall", (user) => {
        io.to(user.to).emit("offerCall", user.from);
    })

    socket.on("answerCall", (user) => {
        io.to(user.to).emit("answerCall", user.from);

    })

    socket.on("candidate", (event)=>{
        io.to(event.sendTo).emit("candidate", event);
    })

    socket.on("offer", (event) => {
        io.to(event.receiver).emit("offer", { event: event.sdp, caller: event.caller })
    })

    socket.on("answer", (event) => {
        io.to(event.caller).emit("answer", event.sdp);
    })
})