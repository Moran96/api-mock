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
app.listen(8000, () => {
  console.log('listen', 'http://localhost:8000/')
})
