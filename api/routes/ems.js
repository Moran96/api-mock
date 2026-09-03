const express = require('express')
const router = express.Router()

const CommonApi = require('../common')
const PriceSourceApi = require('../ems/priceSource')
const BiddingZoneApi = require('../ems/biddingZone')
const RetailAdderApi = require('../ems/retailAdder')

// Task1 电价数据源
router.get('/priceSource/list', (req, res) => res.json(PriceSourceApi.getList(req.query)))
// 启用 & 停用（复用全局 post demo）
router.post('/priceSource/enable', (req, res) => res.json(CommonApi.update))
router.post('/priceSource/disable', (req, res) => res.json(CommonApi.update))

// Task2 竞价区映射表
router.get('/biddingZone/list', (req, res) => res.json(BiddingZoneApi.getList(req.query)))

// Task3 RetailAdder 国家配置
router.get('/retailAdder/list', (req, res) => res.json(RetailAdderApi.getList(req.query)))
router.post('/retailAdder/add', (req, res) => res.json(RetailAdderApi.add(req.body)))
router.put('/retailAdder/update', (req, res) => res.json(RetailAdderApi.update(req.body)))
router.delete('/retailAdder/delete', (req, res) => res.json(CommonApi.remove))

module.exports = router
