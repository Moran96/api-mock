const express = require('express')
const router = express.Router()
const DashboardApi = require('../gnss/dashboard')

router.get('/line', function (req, res) {
  res.json(DashboardApi.getCurve())
})

router.get('/pie', function (req, res) {
  res.json(DashboardApi.getPie())
})

router.get('/overview', function (req, res) {
  res.json(DashboardApi.getOverview(req))
})

router.get('/getStationInfo', function (req, res) {
  res.json(DashboardApi.getStationInfo())
})

module.exports = router
