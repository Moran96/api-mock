const createMockSheet = require('../../utils/MockSheet')

// Task3 RetailAdder 国家配置
const mySheet = createMockSheet({
  mockContent: {
    list: [
      { id: 1, country: 'DE', countryName: '德国', networkFee: 0.08, taxSurcharge: 0.05, margin: 0.02, vatRate: 19.0, exportMode: 'A', exportFactor: 0.75, exportDeduction: 0.03, exportFit: null, updatedAt: 1743300000000 },
      { id: 2, country: 'NL', countryName: '荷兰', networkFee: 0.075, taxSurcharge: 0.05, margin: 0.015, vatRate: 21.0, exportMode: 'A', exportFactor: 0.8, exportDeduction: 0.02, exportFit: null, updatedAt: 1743300000000 },
      { id: 3, country: 'BE', countryName: '比利时', networkFee: 0.1, taxSurcharge: 0.04, margin: 0.015, vatRate: 21.0, exportMode: 'B', exportFactor: null, exportDeduction: null, exportFit: 0.06, updatedAt: 1743300000000 },
      { id: 4, country: 'FR', countryName: '法国', networkFee: 0.06, taxSurcharge: 0.035, margin: 0.015, vatRate: 20.0, exportMode: 'B', exportFactor: null, exportDeduction: null, exportFit: 0.1, updatedAt: 1743300000000 },
      { id: 5, country: 'ES', countryName: '西班牙', networkFee: 0.05, taxSurcharge: 0.035, margin: 0.01, vatRate: 21.0, exportMode: 'A', exportFactor: 1.0, exportDeduction: 0.005, exportFit: null, updatedAt: 1743300000000 },
      { id: 6, country: 'IE', countryName: '爱尔兰', networkFee: 0.08, taxSurcharge: 0.025, margin: 0.015, vatRate: 23.0, exportMode: 'B', exportFactor: null, exportDeduction: null, exportFit: 0.21, updatedAt: 1743300000000 },
      { id: 7, country: 'LT', countryName: '立陶宛', networkFee: 0.05, taxSurcharge: 0.025, margin: 0.01, vatRate: 21.0, exportMode: 'B', exportFactor: null, exportDeduction: null, exportFit: 0.05, updatedAt: 1743300000000 },
      { id: 8, country: 'HU', countryName: '匈牙利', networkFee: 0.04, taxSurcharge: 0.025, margin: 0.01, vatRate: 27.0, exportMode: 'C', exportFactor: null, exportDeduction: null, exportFit: null, updatedAt: 1743300000000 },
      { id: 9, country: 'RO', countryName: '罗马尼亚', networkFee: 0.04, taxSurcharge: 0.025, margin: 0.01, vatRate: 19.0, exportMode: 'C', exportFactor: null, exportDeduction: null, exportFit: null, updatedAt: 1743300000000 },
      { id: 10, country: 'AU', countryName: '澳大利亚', networkFee: 0.1, taxSurcharge: 0.03, margin: 0.01, vatRate: 10.0, exportMode: 'A', exportFactor: 1.0, exportDeduction: 0.0, exportFit: null, updatedAt: 1743300000000 }
    ]
  },
  queryFilter: {
    fuzzy: 'country,countryName',
    precise: 'exportMode'
  },
  onBeforeAdd: (record) => {
    record.updatedAt = Date.now()
  },
  onBeforeUpdate: (record) => {
    record.updatedAt = Date.now()
  }
})

module.exports = {
  getList: (q) => mySheet.getList(q),
  add: (p) => mySheet.add(p),
  update: (p) => mySheet.update(p)
}
