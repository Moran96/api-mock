const createMockSheet = require('../../utils/MockSheet')

const mySheet = createMockSheet({
  mockContent: {
    'list|2': [
      {
        'id|+1': 1,
        engineName: '@name',

        // 基准站 只有一个
        baseStation: {
          stationId: 1,
          stationName: '基准站01'
        }, // string
        // 监测站 存在多个
        monitorStations: [
          { stationId: 1, stationName: 'Name1' },
          { stationId: 2, stationName: 'Name2' },
          { stationId: 3, stationName: 'Name3' },
          { stationId: 4, stationName: 'Name4' }
        ],
        stationInstanceInfos: [
          { stationId: 1, stationName: 'Name1', instanceStatus: 1 },
          { stationId: 2, stationName: 'Name2', instanceStatus: 2 },
          { stationId: 3, stationName: 'Name3', instanceStatus: 4 },
          { stationId: 4, stationName: 'Name4', instanceStatus: 8 }
        ],

        // 解算数据时长（分钟）
        'dataDuration|+1': [15, 30, 45, 60],
        // 结果输出间隔（秒）
        outputInterval: '@integer(60, 120)',
        // 解算间隔模式
        'calcIntervalMode|+1': ['ALL_TIME', 'CUSTOMIZE'],

        // 采样间隔（秒）
        'sampleInterval|1': [15, 30, 45, 60],
        // 采样间隔模式：0-设备上报为准，1-自定义
        'sampleMode|+1': [0, 1],

        // 卫星系统
        satelliteSystems: ['BDS', 'GAL', 'QZSS'],
        // 截止高度角（°），范围0-90
        cutoffAngle: '@float(0, 90, 0, 1)',

        // endTime 解算开始&结束时间
        startTime: '@time(T)',
        endTime: '@time(T)',

        // 电离层模型: AUTO, Klobuchar
        'ionosphereModel|+1': ['AUTO', 'Klobuchar'],
        // 对流层模型：AUTO, Kropfield
        'troposphereModel|+1': ['AUTO', 'KHopfield'],

        // 运行状态：0-停止，1-启动
        'status|+1': [0, 1], // int
        createTime: Date.now()
      }
    ]
  },
  queryFilter: {
    fuzzy: 'engineName',
    precise: 'status'
  },
  onBeforeAdd: (item) => {
    console.log(item)
  },
  onBeforeUpdate: (item) => {
    console.log(item)
  },
  onBeforeUpdate: () => {}
})

module.exports = {
  add: (p) => mySheet.add(p),
  update: (p) => mySheet.update(p),
  getList: (q) => mySheet.getList(q),
  getDetail: (q) => mySheet.getDetail(q)
}
