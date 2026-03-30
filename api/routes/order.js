const express = require('express')
const router = express.Router()
const OrderApi = require('../biz/order')

router.get('/list', function (req, res) {
  res.json(OrderApi.getList(req.query))
})

router.get('/detail', function (req, res) {
  res.json(OrderApi.getDetail(req.query))
})

module.exports = router
