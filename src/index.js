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


io.on('connection',(socket) => {

    console.log('New Websocket connection')
    // console.log(io.sockets.sockets.keys())
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

})


server.listen(port, () => {
    console.log(`server is up on port: ${port}`)
})