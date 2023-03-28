import { createReduxAsyncTask } from '@moonshot-team/saga-toolkit'
import { put } from 'redux-saga/effects'
import axios from 'axios'

import { configAPI } from '../configApi'
import { ITypeProcess, MODULE_NAME } from './type'

export const getTypeProcessTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getTypeProcess',
    defaultData: {} as ITypeProcess[],
    saga: ({ actions }) =>
        function* () {
            try {
                const config = yield configAPI()
                const { data } = yield axios.get(`${process.env.NEXT_PUBLIC_HOST}/getAllTypeProcess`, config)
                yield put(actions.success(data.message))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const submitTypeProcessTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'submitTypeProcess',
    defaultData: {} as { success: string },
    defaultPayload: {} as { process_name: string },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(`${process.env.NEXT_PUBLIC_HOST}/createTypeProcess`, action.payload, config)
                yield put(actions.success(data))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})
