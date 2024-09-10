const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()

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

app.listen(8000, () => {
  console.log('listen', 'http://localhost:8000/')
})