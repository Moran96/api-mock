const express = require('express')
const router = express.Router()
const CGS = require('../configuration/index')

router.get('/deviceLocationList', function (req, res) {
  res.json(CGS.location.getList())
})

module.exports = router
