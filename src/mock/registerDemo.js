let registerDemo = {
  token: 666666
}

export default {
  'post|/add': (req, res) => {
    return {
      status: 200,
      data: registerDemo
    }
  }
}
