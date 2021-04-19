let loginDemo = {
  token: 1234567890
}

export default {
  'post|/authenticate': (req, res) => {
    console.log(req)
    return {
      status: 200,
      data: loginDemo
    }
  }
}
