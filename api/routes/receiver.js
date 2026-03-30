const express = require('express')
const router = express.Router()
const ReceiverApi = require('../gnss/receiver')

router.get('/getList', function (req, res) {
  res.json(ReceiverApi.getList(req.query))
})

router.post('/add', function (req, res) {
  res.json(ReceiverApi.add(req.body))
})

router.post('/update', function (req, res) {
  res.json(ReceiverApi.update(req.body))
})

router.delete('/remove', function (req, res) {
  res.json(ReceiverApi.remove(req.query))
})

module.exports = router
