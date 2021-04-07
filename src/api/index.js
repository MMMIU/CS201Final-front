import axios from '_axios@0.21.1@axios'

function axiosWrapper (url, method, param, data) {
  return axios({url, method, param, data}).then(res => {
    if (res.data.status === 200) {
      return res.data
    }
  })
}

export {
  axiosWrapper
}
