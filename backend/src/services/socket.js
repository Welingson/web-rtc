import { Server } from 'socket.io';

export const io = new Server({
    cors: {
        origin: true
    }
}).listen(3333).on("connection", (socket)=>{

    
    socket.on("logged", (user)=>{
        socket.join(user);
    })

    socket.on("offerCall", (user)=>{
        io.to(user.user).emit("answerCall", user.from);
    })
})


