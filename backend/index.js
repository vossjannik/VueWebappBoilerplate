const WebSocket = require('ws')

module.exports = {
  handle ({ client, topic, data }) {
    console.log('received: ' + topic)

    switch (topic) {
      default: {
        client.send(JSON.stringify({
          topic: 'error',
          data: 'received message with unknown topic: ' + topic,
        }))
        break
      }
    }
  },
  start () {
    // start database or whatever
  },
}
