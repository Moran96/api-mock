const express = require('express')
const router = express.Router()
const EngineApi = require('../gnss/engine')
const PostDataApi = require('../gnss/postData')

router.get('/detail', function (req, res) {
  res.json(EngineApi.getDetail(req.query))
})

router.post('/save', function (req, res) {
  res.json(EngineApi.add(req.body))
})

router.put('/update', function (req, res) {
  res.json(EngineApi.update(req.body))
})

router.get('/data', function (req, res) {
  res.json(PostDataApi.getList(req.query))
})

module.exports = router
