import { createReduxAsyncTask } from '@moonshot-team/saga-toolkit'
import { put } from 'redux-saga/effects'
import axios from 'axios'
import Cookies from 'js-cookie'

import { IResAuth, IResUserInfo, MODULE_NAME } from './type'
import { configAPI } from '../configApi'

export const myToken = async () => {
    const token = Cookies.get('accessToken')
    return token
}

export const loginTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'loginTask',
    defaultData: {} as IResAuth,
    defaultPayload: {} as { userName: string; password: string },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(`${process.env.NEXT_PUBLIC_HOST}/signin`, action.payload, config)
                Cookies.set('accessToken', data.message.token, {
                    expires: new Date(Date.now() + 36000 * 1000),
                })
                yield put(actions.success(data))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})
export const userInfoTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'userInfo',
    defaultData: {} as IResUserInfo,
    saga: ({ actions }) =>
        function* () {
            try {
                const config = yield configAPI()
                const token = yield myToken()
                const { data } = yield axios.get(`${process.env.NEXT_PUBLIC_HOST}/info`, config)
                let info = { success: data.success, message: { ...data.message[0], accessToken: token } }
                yield put(actions.success(info))
            } catch (error: any) {
                yield put(actions.failure({ success: 'error', message: error.response?.data[0]?.message }))
            }
        },
})
