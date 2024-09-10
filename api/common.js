function postAdd() {
  return {
    msg: 'Add Success',
    code: 200,
    data: null
  }
}

function putEdit() {
  return {
    msg: 'Update Success',
    code: 200,
    data: null
  }
}

function deleteRemove() {
  return {
    msg: 'Delete Success',
    code: 200,
    data: null
  }
}

const CommonApi = {
  add: postAdd(),
  update: putEdit(),
  remove: deleteRemove()
}

module.exports = CommonApi
