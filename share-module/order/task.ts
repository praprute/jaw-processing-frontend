import { createReduxAsyncTask } from '@moonshot-team/saga-toolkit'
import { put } from 'redux-saga/effects'
import axios from 'axios'

import { configAPI } from '../configApi'
import { MODULE_NAME } from './type'

export const createOrderTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'createOrder',
    defaultData: {} as string,
    defaultPayload: {} as {
        order_name: string
        uuid_puddle: string
        status_puddle_order: number
        fish: number
        salt: number
        laber: number
        description: string
        volume: number
        fish_price: number
        salt_price: number
        laber_price: number
        amount_items: number
    },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(`${process.env.NEXT_PUBLIC_HOST}/createOrder`, action.payload, config)
                yield put(actions.success(data.success))
            } catch (error: any) {
                // const errorResponse = yield error.response.data.json()
                yield put(actions.failure(error.response.data))
            }
        },
})