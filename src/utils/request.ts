import axios from 'axios'
import QS from 'qs'
import { Message } from '@arco-design/web-vue'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import type { QueryDataArgs } from '@/types'

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

// 请求总入口
const getQueryData = async (
  api: string,
  {
    method = 'get',
    params,
    option = {},
    returnErrorResult = false
  }: QueryDataArgs
) => {
  try {
    let result: any = null

    switch (method) {
      case 'get':
        result = await request.get(api, { params, ...option })
        break
      case 'post':
        result = await request.post(api, QS.stringify(params), {
          ...option
        })
        break
    }

    if (returnErrorResult || result?.code === 0 || result?.code === 200) {
      return result
    } else {
      Message.error(result?.message || '请求出错，再试试吧~')
    }
  } catch (error: any) {
    Message.error(error.response?.data?.message || error.message)
  }
}

export default getQueryData
