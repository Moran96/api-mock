const { pagination, filterSearch } = require('../../utils/search')
const Mock = require('mockjs')
const dataMap = Mock.mock({
  'list|40': [
    {
      'goodsId|+1': 10000,
      "goodsName": "@name",
      "goodsDesc": "",
      "goodsPrice": "@float(0, 99999, 0, 2)",
      "orgName": "Fake Org",
      "goodsImg|1": ['http://localhost:8000/static/001.jpeg', 'http://localhost:8000/static/002.jpeg'],
      "goodsUrl": "@url",
      "goodsNum": "@integer(0, 9999)",
      "goodsStatus|1": [true, false],
      "tsCreateTime": Date.now()
      // "tempType|1": ['INDUSTRY_SCENE', 'INDEPENDENT', 'INDUSTRY_SCENE'],
      // "status|1": ['UN_PUBLISH', 'PUBLISHED'],
      // 'permission|1': true
    }
  ]
})

function getList (query) {
  const list = dataMap.list
  // 查询
  const filtered = filterSearch(list, query, 'goodsId,goodsStatus', 'goodsName')
  // 分页
  const paged = pagination(filtered, { page: query.pageNum, step: query.pageSize })

  const res = {
    msg: 'success',
    code: 200,
    rows: paged,
    total: filtered.length
  }
  return res
}

function add (params) {
  const target = {
    goodsName: params.goodsName,
    goodsDesc: params.goodsDesc,
    goodsId: parseInt(params.goodsId),
    goodsPrice: params.goodsPrice,
    goodsNum: params.goodsNum,
    goodsImg: params.goodsImg,
    goodsUrl: params.goodsUrl,
    goodsStatus: false,
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

function update (params) {
  const target = dataMap.list.find(item => item.goodsId === params.goodsId)

  const targetUpdate = {
    ...params
  }

  Object.assign(target, targetUpdate)

  const res = {
    msg: 'success',
    code: 200,
    data: null
  }
  return res
}

function remove (body) {
  body.ids.forEach(id => {
    const targetIdx = dataMap.list.findIndex(item => item.goodsId === id)
    dataMap.list.splice(targetIdx, 1)
  })
  // const targetIdx = dataMap.list.findIndex(item => item.goodsId === body.goodsId)
  // dataMap.list.splice(targetIdx, 1)
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
