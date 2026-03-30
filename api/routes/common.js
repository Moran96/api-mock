const express = require('express')
const router = express.Router()
const DemoApi = require('../demo')
const CommonApi = require('../common')

router.get('/get', function (req, res) {
  res.json(DemoApi.getList(req.query))
})

router.get('/getDetail', function (req, res) {
  res.json(DemoApi.getDetail(req.query))
})

router.get('/getNoPage', function (req, res) {
  res.json(DemoApi.getListNoPage())
})

router.post('/add', function (req, res) {
  res.json(CommonApi.add)
})

router.post('/update', function (req, res) {
  res.json(CommonApi.update)
})

router.delete('/remove', function (req, res) {
  res.json(DemoApi.remove(req.query))
})

module.exports = router
