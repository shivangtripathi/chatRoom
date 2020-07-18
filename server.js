const express = require('express');
const http = require('http');
const socketio = require('socket.io')
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('utils/user.js');
const formatMessage = require( 'utils/messages.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server)

const botName = 'Magnus Chat';
const port = process.env.PORT || 3000;

app.use(express.static('public')));

//run on connection
io.on('connection',socket=>{

    socket.on('joinRoom',({username,room})=>{

        const user = userJoin(socket.id,username,room);
        //room functionality built in socket.io
        socket.join(user.room);

         //new connection
    socket.emit('message', formatMessage(botName,'Welcome to MagnusChord!')); //welcome user
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined chatroom.`)); //notfiying new user

    //send users and room info
    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    })

    })
           //listen for msg
        socket.on('chatMessage',(message)=>{
            const user = getCurrentUser(socket.id);
            io.to(user.room).emit('message', formatMessage(user.username,message)) } )

        //user disconnect
        socket.on('disconnect',()=>{
            const user = userLeave(socket.id);
            if(user){
                io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`))}

            io.to(user.room).emit('roomUsers',{
                    room:user.room,
                    users:getRoomUsers(user.room)
                })   
        })
})




server.listen(port, () => console.log(`Server running on port ${port}`));
