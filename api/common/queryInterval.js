const maxCounts = 5
let count = 0

function queryInterval() {
  if (count <= maxCounts) {
    count++
    return {
      code: 200,
      msg: `pending ${count}`,
      data: 0 // 失败-1 等待0 成功1
    }
  } else {
    count = 0
    return {
      code: 20092,
      msg: 'success',
      data: 1 // 失败-1 等待0 成功1
    }
  }
}

module.exports = {
  queryInterval
}
