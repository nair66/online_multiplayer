const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname,'../public')
app.use(express.static(publicDirPath))
selectedElements = new Set([])
connectedClientsCount = 0
actor_id = ''


io.on('connection',(socket) => {

    connectedClientsCount = io.sockets.sockets.size
    console.log('New Websocket connection')
    connectedClients = Array.from(io.sockets.sockets.keys())

    if(connectedClientsCount == 1){
        // console.log(actor_id)
        io.emit('waitMessage')
    }
    else if(connectedClientsCount > 1 && actor_id == ''){
        actor_id = socket.id
        socket.emit('actorMessage')
        socket.broadcast.emit('guesserMessage')
    }
    else if(actor_id != ''){
        socket.emit('guesserMessage')
    }


    console.log(connectedClients)
    io.emit('clientCountUpdate',connectedClientsCount)
    socket.emit('cardSelectionUpdate',[...selectedElements])

    socket.on('cardClicked',(cardItemIndex) => {
        
        if(socket.id == actor_id){
            // console.log(socket.id)
            if(!selectedElements.has(cardItemIndex)){

                selectedElements.add(cardItemIndex) 
            }
            else{

                selectedElements.delete(cardItemIndex)
            }
            io.emit('cardSelectionUpdate',[...selectedElements])
        }

    })
    
    socket.on('disconnect',() => {
        connectedClientsCount = io.sockets.sockets.size
        io.emit('clientCountUpdate',connectedClientsCount)

        if(socket.id == actor_id){
            // console.log(socket.id)
            // console.log(actor_id)
            actor_id = ''

        if(connectedClientsCount == 1){
            // console.log(actor_id)
            io.emit('waitMessage')
        }
        else if(connectedClientsCount > 1 && actor_id == ''){
            connectedClients = Array.from(io.sockets.sockets.keys())
            actor_id = connectedClients[0]
            actor_socket = io.sockets.sockets.get(actor_id)
            actor_socket.emit('actorMessage')
            actor_socket.broadcast.emit('guesserMessage')
            // io.to(actor_id).broadcast.emit('guesserMessage')
        }


        }

    })
})


server.listen(port, () => {
    console.log(`server is up on port: ${port}`)
})