const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const useWebsocket = require('./api/websocket')
useWebsocket(app, '/socket/test')

const useHttpApis = require('./api/http')
useHttpApis(app)

app.listen(8000, () => {
  console.log('listen', 'http://localhost:8000/')
})
