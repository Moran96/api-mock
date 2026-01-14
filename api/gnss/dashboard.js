const Mock = require('mockjs')

function generateTarget(len = 24) {
  const x = []

  for (let i = 0; i < len; i++) {
    const m = 30 * i
    // HH:MM
    const h = Math.floor(m / 60)
    const s = Math.floor(m % 60)

    const timeStr = `${h.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`
    x.push(timeStr)
  }

  const dataY = Mock.mock({
    'y|24': ['@integer(0, 100)']
  })

  return {
    dataCode: ['demoKey'],
    value: {
      data: [
        {
          dataCode: 'demoKey',
          x,
          y: dataY.y
        }
      ]
    }
  }
}

function generatePie(codesStr) {
  const dataCode = codesStr.split(',')

  const dataArr = dataCode.map((code) => {
    return {
      dataCode: code,
      value: Mock.mock('@integer(0, 100)')
    }
  })

  return {
    dataCode,
    value: {
      data: dataArr
    }
  }
}

function generateOverview() {
  const total = Mock.mock('@integer(0, 20000)')

  const mockText = `@integer(0, ${total})`

  const onlineCount = Mock.mock(mockText)
  const offlineCount = total - onlineCount

  const runCount = Mock.mock(mockText)
  const stopCount = total - runCount

  const referenceCount = Mock.mock(mockText)
  const monitorCount = total - referenceCount

  return {
    total,
    referenceCount,
    monitorCount,
    onlineCount,
    offlineCount,
    runCount,
    stopCount
  }
}

function getCurve() {
  return {
    code: 200,
    msg: 'Success',
    data: generateTarget()
  }
}

function getPie() {
  return {
    code: 200,
    msg: 'Success',
    data: generatePie('postSuccess,postFail')
  }
}

function getOverview(req) {
  console.log(Object.keys(req))
  return {
    code: 200,
    msg: 'Success',
    data: generateOverview()
  }
}

function getStationInfo() {
  return {
    code: 200,
    msg: 'Success',
    data: {
      dataCode: ['ip', 'os', 'cpu', 'ram'],
      value: {
        data: [
          { dataCode: 'ip', value: Mock.mock('@ip') },
          { dataCode: 'os', value: 'Windows11' },
          { dataCode: 'cpu', value: Mock.mock('@integer(0, 100)') / 100 },
          { dataCode: 'ram', value: Mock.mock('@integer(0, 100)') / 100 }
        ]
      }
    }
  }
}

module.exports = {
  getCurve,
  getPie,
  getOverview,
  getStationInfo
}
