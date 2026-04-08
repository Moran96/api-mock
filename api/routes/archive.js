const express = require('express')
const router = express.Router()

const modules = {
  transformer: require('../biz-archives/transformer'),
  well: require('../biz-archives/well'),
  pump: require('../biz-archives/pump')
}

// 为每个模块统一注册 CRUD 路由
Object.entries(modules).forEach(([name, api]) => {
  router.get(`/${name}/list`, (req, res) => res.json(api.getList(req.query)))
  router.get(`/${name}/getDetail`, (req, res) => res.json(api.getDetail(req.query)))
  router.post(`/${name}/add`, (req, res) => res.json(api.add(req.body)))
  router.put(`/${name}/update`, (req, res) => res.json(api.update(req.body)))
  router.delete(`/${name}/delete`, (req, res) => {
    // 逻辑删除：MockSheet 没有内置 delete，返回成功即可
    res.json({ code: 200, msg: 'success', data: null })
  })
})

module.exports = router
