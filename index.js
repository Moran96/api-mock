require('dotenv').config()

const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()

// 静态资源文件
app.use('/static', express.static(path.join(__dirname, 'public')))

// CORS
app.use(cors())

app.use(express.urlencoded({ extended: false }))

// JSON
app.use(express.json())

// WS
const useWebsocket = require('./api/websocket')
useWebsocket(app, '/socket/test')

// HTTP
const useHttpApis = require('./api/http')
useHttpApis(app)

// Start
const os = require('os')

function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return 'localhost'
}

const PORT = 8000
app.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP()
  console.log(`App running at:`)
  console.log(`- Local:   http://localhost:${PORT}/`)
  console.log(`- Network: http://${ip}:${PORT}/`)
})
