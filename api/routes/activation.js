const express = require('express')
const router = express.Router()
const ProjectsApi = require('../gnss/projects')
const CodesApi = require('../gnss/codes')
const KeyApi = require('../gnss/key')

// Projects
router.get('/project/list', function (req, res) {
  res.json(ProjectsApi.getList(req.query))
})

router.post('/project/save', function (req, res) {
  res.json(ProjectsApi.add(req.body))
})

router.post('/project/update', function (req, res) {
  res.json(ProjectsApi.update(req.body))
})

// Codes
router.get('/code/list', function (req, res) {
  res.json(CodesApi.getList(req.query))
})

router.post('/code/save', function (req, res) {
  res.json(CodesApi.add(req.body))
})

// Key
router.get('/getPubKey', function (req, res) {
  res.json(KeyApi.getPublicKey(req.query))
})

router.post('/refreshPublicKey', function (req, res) {
  res.json(KeyApi.refreshPublicKey(req.body))
})

router.get('/checkPlatformActivated', function (req, res) {
  res.json(KeyApi.checkPlatformActivated(req.query))
})

router.get('/getServerInfo', function (req, res) {
  res.json(KeyApi.getServerInfo(req.query))
})

router.post('/activate', function (req, res) {
  res.json(KeyApi.activate(req.body))
})

router.get('/getPlatformActivationInfo', function (req, res) {
  res.json(KeyApi.getPlatformActivationInfo(req.query))
})

module.exports = router
