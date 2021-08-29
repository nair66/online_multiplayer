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

io.on('connection',(socket) => {

    connectedClientsCount = io.sockets.sockets.size
    console.log('New Websocket connection')
    // console.log(io.sockets.sockets.keys())
    io.emit('clientCountUpdate',connectedClientsCount)
    socket.emit('cardSelectionUpdate',[...selectedElements])

    socket.on('cardClicked',(cardItemIndex) => {
        // console.log(socket.id)
        if(!selectedElements.has(cardItemIndex)){

            selectedElements.add(cardItemIndex) 
        }
        else{

            selectedElements.delete(cardItemIndex)
        }
        io.emit('cardSelectionUpdate',[...selectedElements])
    })
    
    socket.on('disconnect',() => {
        io.emit('clientCountUpdate',connectedClientsCount)
    })
})


server.listen(port, () => {
    console.log(`server is up on port: ${port}`)
})