const { pagination, filterSearch } = require('../../utils/search')
const Mock = require('mockjs')
const dataMap = Mock.mock({
  'list|4': [
    {
      'id|+1': 1,
      receiverType: '@name',
      'satelliteSystems|1': ['1', '99'],
      tsCreateTime: Date.now()
    }
  ]
})

function getList(query) {
  const list = dataMap.list
  // 查询
  const filtered = filterSearch(list, query, 'satelliteSystems', 'receiverType')
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
    id: _createId(),
    receiverType: params.receiverType,
    satelliteSystems: params.satelliteSystems,
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
    receiverType: params.receiverType,
    satelliteSystems: params.satelliteSystems
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

function _createId() {
  const max = dataMap.list.reduce((max, item) => Math.max(max, item.id), 0)
  return max + 1
}

module.exports = {
  add,
  update,
  getList,
  remove
}
