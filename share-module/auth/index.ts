import axios from 'axios'
import Cookies from 'js-cookie'
import { IResAuth, IResUserInfo } from './type'

export const myToken = async () => {
  const token = Cookies.get('token')
  return token
}

export const loginTask = async (index: { phone: string; password: string }) => {
  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/signin`, index, {
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        'Access-Control-Allow-Credentials': true
      }
    })
    Cookies.set('token', data.message.token, {
      expires: 999
    })

    return data as IResAuth
  } catch (e: any) {
    return { success: 'error', message: e.response?.data[0]?.message }
  }
}

export const userInfo = async (token: string) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/info`, {
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        Authorization: `Bearer ${token}`
      }
    })

    return data as IResUserInfo
  } catch (e: any) {
    return { success: 'error', message: e.response?.data[0]?.message }
  }
}
