const { pagination, filterSearch } = require('../../utils/search')
const Mock = require('mockjs')
const dataMap = Mock.mock({
  'list|40': [
    {
      'id|+1': 1,
      orgId: 925,
      "templateName": "@name",
      "source|1": ['EXTEND', 'OWNER'],
      "cover|1": ['http://localhost:8000/static/001.jpeg', 'http://localhost:8000/static/002.jpeg'],
      "desc": "",
      "tempType|1": ['INDUSTRY_SCENE', 'INDEPENDENT', 'INDUSTRY_SCENE'],
      "status|1": ['UN_PUBLISH', 'PUBLISHED'],
      'permission|1': true
    }
  ]
})

function getList (query) {
  const list = dataMap.list
  // 查询
  const filtered = filterSearch(list, query, 'source,tempType,status', 'templateName')
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
    id: Date.now().toString(),
    orgId: params.orgId,
    tempType: params.tempType,
    templateName: params.templateName,
    source: 'OWNER',
    desc: params.desc,
    permission: params.permission,
    extendType: params.extendType,
    orgTypes: params.orgTypes
  }

  dataMap.list.push(target)
  const res = {
    msg: 'success',
    code: 200,
    data: null
  }
  return res
}

function remove (body) {
  const targetIdx = dataMap.list.findIndex(item => item.id === body.id)
  dataMap.list.splice(targetIdx, 1)
  return {
    msg: 'SUCCESS',
    code: 200,
    data: null
  }
}

module.exports = {
  add,
  getList,
  remove
}
