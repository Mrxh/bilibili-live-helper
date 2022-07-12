import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const request = axios.create(<AxiosRequestConfig>{
  timeout: 60000
})

request.interceptors.response.use(
  (result: AxiosResponse) => result.data,

  (error: AxiosError) => {
    if (error.message.includes('timeout')) {
      return Promise.reject({ code: 408, message: '服务器请求超时' })
    } else if (error.message.includes('50')) {
      return Promise.reject({ code: 500, message: '服务器连接失败' })
    } else {
      return Promise.reject(error)
    }
  }
)

export default request
