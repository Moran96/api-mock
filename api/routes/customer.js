const express = require('express')
const router = express.Router()
const CustomerApi = require('../biz/customer')

router.get('/list', function (req, res) {
  res.json(CustomerApi.getList(req.query))
})

router.get('/detail', function (req, res) {
  res.json(CustomerApi.getDetail(req.query))
})

module.exports = router
