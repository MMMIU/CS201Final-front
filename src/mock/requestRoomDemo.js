let loginDemo = {
  roomNumber: 1
}

export default {
  'post|/requestroom': option => {
    return {
      status: 200,
      data: loginDemo
    }
  }
}
