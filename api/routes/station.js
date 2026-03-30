const express = require('express')
const router = express.Router()
const StationApi = require('../gnss/station')
const DemoApi = require('../demo')

router.get('/getDetail', function (req, res) {
  res.json(DemoApi.getDetail(req.query))
})

router.post('/', function (req, res) {
  res.json(StationApi.createStationCode())
})

router.get('/list', function (req, res) {
  res.json(DemoApi.getListForSelect(req.query))
})

module.exports = router
