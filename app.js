const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const app = express();
const port = 4000 || process.env.PORT;

// Cors is used for inter communication between url
const users = [];
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server);
io.on('connection',(socket)=>{
    socket.on('joined',({user})=>{
        users[socket.id] = user;
        console.log(`${user} has joined`);
        socket.broadcast.emit('Userjoined',{user:'Admin',message:`${users[socket.id]} had joined`});
        socket.emit('welcome',{user:'Admin',message:`Welcom to the Chat, ${users[socket.id]}`})
    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:'Admin',message:`${users[socket.id]} had left`});
        console.log("user had left")
    })
    socket.on('message',({message,id})=>{
        console.log(message,id)
        io.emit('sendMsg',{user:users[id],message,id}
        );
    });
})
app.get('/',(req,res)=>{
    res.send("IamWorking");
})
server.listen(port,()=>{
    console.log(`server is working on http://localhost:${port}`)
})