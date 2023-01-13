import { myToken } from '../auth'

export const configAPI = async () => {
  const getToken = await myToken()
  return {
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      'Access-Control-Allow-Credentials': true,
      Authorization: `Bearer ${getToken}`
    }
  }
}
