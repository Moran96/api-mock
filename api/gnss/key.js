const Mock = require('mockjs')

function getPublicKey(query) {
  const target = Mock.mock(/[a-zA-Z0-9]{1000}/)
  const res = {
    msg: 'success',
    code: 200,
    data: target
  }
  return res
}

function refreshPublicKey() {
  return {
    msg: 'success',
    code: 200,
    data: ''
  }
}

function checkPlatformActivated(query) {
  const status = query.status ? Number(query.status) : 0
  // 0-未激活 1-正常 -1-已过期
  return {
    msg: 'success',
    code: 200,
    data: status
  }
}

function getServerInfo(query) {
  return {
    msg: 'success',
    code: 200,
    data: {
      uuid: Mock.mock('@guid'),
      mac: Mock.mock(/([0-9A-Fa-f]{2}[-]){5}([0-9A-Fa-f]{2})/)
    }
  }
}

function getPlatformActivationInfo(query) {
  return {
    msg: 'success',
    code: 200,
    data: {
      // uuid: Mock.mock('@guid'),
      uuid: Mock.mock(/([0-9A-F]{100})/),
      mac: Mock.mock(/([0-9A-Fa-f]{2}[-]){5}([0-9A-Fa-f]{2})/),
      deviceCounts: Mock.mock('@integer(1, 1000)'),
      activatedDays: Mock.mock('@integer(1, 1000)'),
      activeTime: Mock.mock('@time(T)'),
      hoursCanUse: 120
    }
  }
}

const MessageMap = {
  0: 'Success',
  1: '服务器UUID不匹配，激活失败',
  2: '激活码已失效，激活失败',
  3: '网卡MAC地址不匹配，激活失败'
}

function activate(params) {
  let data = {
    result: 0, // 0-失败 1-成功
    info: ''
  }

  const activationCode = params.activationCode || ''
  const t = activationCode.length % 4

  data.result = t === 0 ? 1 : 0
  data.info = MessageMap[t]

  return {
    msg: 'success',
    code: 200,
    data
  }
}

module.exports = {
  getPublicKey,
  refreshPublicKey,
  checkPlatformActivated,
  getServerInfo,
  activate,
  getPlatformActivationInfo
}
