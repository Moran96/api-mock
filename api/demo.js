const { pagination, filterSearch } = require('../utils/search')
const Mock = require('mockjs')
const dataMap = Mock.mock({
  'list|15': [
    {
      'id|+1': 1,
      groupName: '@name',
      num: '@integer(1, 1000)',
      stationName: '@name',
      orgName: '@name',
      productName: '@name',
      deviceName: '@name',
      // code: /[a-z][A-Z][0-9]{12}/,
      deviceId: 9212,
      productId: 3407,
      deviceKey: '867776054481608',
      productKey: 'p11rgR',
      'stationType|1': ['REFERENCE_STATION', 'MONITORING_STATION'],
      'receiverType|1': ['0', '1'],
      'dataFormat|1': ['0', '1'],
      'dataType|1': ['RTCM'],
      receiverSN: /[a-z][A-Z][0-9]{12}/,
      'ntripStatus|1': ['STOPPED', 'RUNNING'],
      'runStatus|1': ['0', '1', '2', '3', '4'],
      cutoffAngle: 2.12,
      antennaType: 'antennaType_1ec17f123fc8',
      antennaHeight: 0.0,
      'reportFormat|1': ['REAL_TIME_STREAM', 'FILE_STREAM'],
      'coordinateSystem|1': ['CGCS2000', 'WGS84', 'ITIF2008'],
      'coordinateType|1': ['GEODETIC_COORDINATE', 'EARTH_CENTERED'],
      'coordinateSource|1': ['AUTO_ACQUIRE', 'MANUAL_INPUT'],
      height: 0.0,
      coordX: 1.0,
      coordY: 2.0,
      coordZ: 3.0,
      coordB: 11.0,
      coordL: 22.0,
      coordH: 33.0,
      protocolType: 'NTRIP_CASTER',
      correctionX: 0.0,
      correctionY: 0.0,
      correctionZ: 0.0,
      ntrip_status: 'STOPPED',
      tsCreateTime: Date.now(),
      ntripMountPoint: 'mountpoint123',
      ntripUsername: 'user123'
    }
  ]
})

function getList(query) {
  const list = dataMap.list
  // 查询
  const filtered = filterSearch(list, query, 'code', 'stationName')
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

function getListForSelect(query) {
  const list = dataMap.list
  // 查询
  const filtered = filterSearch(list, query, 'stationType', 'stationName')
  // 分页
  const paged = pagination(filtered, {
    page: query.pageNum,
    step: query.pageSize
  })

  const res = {
    msg: 'success',
    code: 200,
    data: paged.map((item) => {
      return {
        id: item.id,
        stationName: item.stationName
      }
    })
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
  const target = Object.assign({}, params, {
    id: parseInt(params.id),
    orgName: 'Fake Org',
    tsCreateTime: Date.now()
  })

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

function getDetail(query) {
  const target = dataMap.list.find((item) => item.id === parseInt(query.id))
  const res = {
    msg: 'success',
    code: 200,
    data: Object.assign(
      {},
      target,
      Mock.mock({
        'list|0-7': [
          {
            name: /[0-9]{12}/,
            dk: /[a-z][A-Z][0-9]{12}/
          }
        ]
      })
    )
  }
  return res
}

module.exports = {
  add,
  update,
  getDetail,
  getList,
  getListNoPage,
  getListForSelect,
  remove
}
