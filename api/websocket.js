const expressWs = require('express-ws')

function useWebsocket (app, url = '/socket/test') {
  expressWs(app)

  app.ws(url, function (ws, req){
    ws.send('WebSocket connect success.')

    ws.on('message', function (msg) {
      console.log('[MSG]', Date.now())
      console.log(msg)
      let timer = setTimeout(() => {
        ws.send(msg)
        clearTimeout(timer)
        timer = null
      }, 100)
    })
  })
}

module.exports = useWebsocket
