const express = require('express')
const router = express.Router()
const WalletApi = require('../biz/wallet')

router.get('/list', function (req, res) {
  res.json(WalletApi.getList(req.query))
})

module.exports = router
