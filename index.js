const path = require('path')
const express = require('express')
const expressWs = require('express-ws')
const cors = require('cors')
const app = express()

expressWs(app)

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const Configuration = require('./api/configuration')

const ScreenData = require('./api/screen/demo.js')

app.get('/screen-data', function (req, res) {
  res.json(ScreenData.list(req.query))
})

app.get('/system/dataview/template/page', function (req, res) {
  res.json(Configuration.temp.getList(req.query))
})


app.post('/system/dataview/template/add', function (req, res) {
  res.json(Configuration.temp.add(req.body))
})

app.ws('/socket/test', function (ws, req){
  ws.send('WebSocket connect success.')

  ws.on('message', function (msg) {
    console.log('[MSG]', Date.now())
    // console.log(msg)
    let timer = setTimeout(() => {
      // ws.send(msg)
      clearTimeout(timer)
      timer = null
    }, 100)
  })
})

app.listen(8000, () => {
  console.log('listen', 'http://localhost:8000/')
})
