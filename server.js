const WebSocket = require('ws')
const express = require('express')
const path = require('path')
const http = require('http')
const config = require('./config.js')
const { start, handle } = require('./backend/index.js')

const app = express()
const httpServer = http.createServer(app)

app.use(express.static('./www'))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/www/index.html'))
})

// start the frontend
console.log('listening on port ' + config.primaryPort)
httpServer.listen(config.primaryPort)

// start the backend
const wss = new WebSocket.Server({ server: httpServer })
async function init () {
    await start()

    // start listening
    wss.on('connection', client => {
        try {
            client.on('message', str => {
                let obj
                try {
                    obj = JSON.parse(str)
                    if (!('topic' in obj) || !('data' in obj)) return // dismiss
                } catch (err) { return } // dismiss

              handle({
                client,
                topic: obj.topic,
                data: obj.data,
              })
            })
        } catch (err) {} // dismiss
    })
}
init()

