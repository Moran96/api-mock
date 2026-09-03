const createMockSheet = require('../../utils/MockSheet')

// 围绕中心点生成不规则多边形围栏
// 外层顶点数 > 3，内层固定 2 项: [lng, lat]
function genPoints(lat, lng) {
  const count = 6 + Math.floor(Math.random() * 4) // 6~9 个顶点
  const radius = 0.002 + Math.random() * 0.004
  const points = []
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.1
    const r = radius * (0.75 + Math.random() * 0.5)
    points.push([
      Number((lng + r * Math.cos(angle)).toFixed(6)),
      Number((lat + r * Math.sin(angle)).toFixed(6))
    ])
  }
  return points
}

// 地块管理表
const mySheet = createMockSheet({
  mockContent: {
    'list|30': [
      {
        'id|+1': 1,
        name: '@cword(2,3)地块',
        areas: '@float(1, 100, 2, 2)',
        'zoneCounts|1-20': 1,
        'deviceCounts|0-50': 1,
        // 'farmId|+1': 1,
        farmId: 1,
        farmName: '@cword(2,3)农场',
        lat: '@float(22, 24.5, 6, 6)',
        lng: '@float(111.5, 114.5, 6, 6)'
      }
    ]
  },
  queryFilter: {
    fuzzy: 'name,farmName',
    precise: 'farmId'
  }
})

// 为每条记录补充围栏坐标 points
mySheet.list.forEach((item) => {
  item.points = genPoints(item.lat, item.lng)
})

module.exports = {
  getList: (q) => mySheet.getList(q),
  getDetail: (q) => mySheet.getDetail(q),
  add: (p) => mySheet.add(p),
  update: (p) => mySheet.update(p)
}
