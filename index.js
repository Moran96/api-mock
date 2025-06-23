const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()

const useWebsocket = require('./api/websocket')
useWebsocket(app, '/socket/test')

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const CommonApi = require('./api/common')

app.post('/common/update', function (req, res) {
  res.json(CommonApi.update)
})

app.listen(8000, () => {
  console.log('listen', 'http://localhost:8000/')
})
