const { pagination, filterSearch } = require('../utils/search')
const Mock = require('mockjs')
const dataMap = Mock.mock({
  'list|40': [
    {
      'id|+1': 1,
      name: '@name',
      code: /[a-z][A-Z][0-9]{12}/,
      'type|1': ['1', '99'],
      desc: '',
      area: 'Fake Area',
      parameters: 'Fake',
      tsCreateTime: Date.now()
    }
  ]
})

function getList(query) {
  const list = dataMap.list
  // 查询
  const filtered = filterSearch(list, query, 'code', 'name')
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

function getListNoPage() {
  return {
    msg: 'success',
    code: 200,
    data: dataMap.list
  }
}

function add(params) {
  const target = {
    id: parseInt(params.id),
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
  const target = dataMap.list.find((item) => item.id === params.id)

  const targetUpdate = {
    id: parseInt(params.id),
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
  const id = Number(body.id)
  const targetIdx = dataMap.list.findIndex((item) => item.id === id)
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
  getListNoPage,
  remove
}
