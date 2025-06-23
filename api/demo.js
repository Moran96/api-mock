const { pagination, filterSearch } = require('../utils/search')
const Mock = require('mockjs')
const dataMap = Mock.mock({
  'list|40': [
    {
      'shopId|+1': 1,
      shopName: '@name',
      'shopType|1': ['1', '99'],
      shopDesc: '',
      orgName: 'Fake Org',
      tsCreateTime: Date.now()
    }
  ]
})

function getList(query) {
  const list = dataMap.list
  // 查询
  const filtered = filterSearch(list, query, 'shopType', 'shopName')
  // 分页
  const paged = pagination(filtered, {
    page: query.pageNum,
    step: query.pageSize
  })

  const res = {
    msg: 'success',
    code: 200,
    rows: paged,
    total: filtered.length
  }
  return res
}

function add(params) {
  const target = {
    shopId: parseInt(params.shopId),
    shopType: params.shopType,
    shopName: params.shopName,
    shopDesc: params.shopDesc,
    orgName: 'Fake Org',
    tsCreateTime: Date.now()
  }

  dataMap.list.push(target)
  const res = {
    msg: 'success',
    code: 200,
    data: null
  }
  return res
}

function update(params) {
  const target = dataMap.list.find((item) => item.shopId === params.shopId)

  const targetUpdate = {
    shopId: parseInt(params.shopId),
    shopType: params.shopType,
    shopName: params.shopName,
    shopDesc: params.shopDesc
  }

  Object.assign(target, targetUpdate)

  const res = {
    msg: 'success',
    code: 200,
    data: null
  }
  return res
}

function remove(body) {
  const targetIdx = dataMap.list.findIndex(
    (item) => item.shopId === body.shopId
  )
  dataMap.list.splice(targetIdx, 1)
  return {
    msg: 'SUCCESS',
    code: 200,
    data: null
  }
}

module.exports = {
  add,
  update,
  getList,
  remove
}
