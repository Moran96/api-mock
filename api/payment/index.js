let count = 0

function getPayStatus(params) {
  count++

  let status = 1
  if (count === 5) {
    status = 2
  } else if (count >= 10) {
    status = 3
  }
  return {
    msg: 'Update Success',
    code: 200,
    data: {
      count: count,
      payStatus: status,
    }
  }
}


function payWechat(params) {
  count = 0
  return {
    msg: 'Update Success',
    code: 200,
    data: {
      payLimitSecond: 30,
      paymentId: 123456789,
      code_url: '132131321313'
    }
  }
}

module.exports = {
  getPayStatus: getPayStatus,
  payWechat: payWechat
}