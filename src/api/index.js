import axios from 'axios'

axios.defaults.baseURL = '/api'

function axiosWrapper (url, method, params, data) {
  return axios({url: url, method: method, params: params, data: data}).then(res => {
    if (res.status === 200) {
      return res.data
    } else {
      this.$message.error(res.status)
    }
  })
}

export {
  axiosWrapper
}
