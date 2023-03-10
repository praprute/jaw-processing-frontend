import { createReduxAsyncTask } from '@moonshot-team/saga-toolkit'
import { put } from 'redux-saga/effects'
import axios from 'axios'

import { configAPI } from '../configApi'
import { IOrderDetailDto, IOrderDto, IPayloadTransferFishSauce, MODULE_NAME } from './type'

export const createOrderTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'createOrder',
    defaultData: {} as string,
    defaultPayload: {} as {
        order_name: string
        uuid_puddle: string
        puddle_id: number
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

export const getAllOrdersFromPuddleIdTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getAllOrdersFromPuddleId',
    defaultData: {} as IOrderDto[],
    defaultPayload: {} as { puddle_id: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const { puddle_id } = action.payload
                const config = yield configAPI()
                const { data } = yield axios.get(`${process.env.NEXT_PUBLIC_HOST}/getAllOrdersFromPuddleId/${puddle_id}`, config)
                yield put(actions.success(data.message))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const getOrdersDetailFromIdTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getOrdersDetailFromId',
    defaultData: {} as IOrderDetailDto[],
    defaultPayload: {} as { order_id: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const { order_id } = action.payload
                const config = yield configAPI()
                const { data } = yield axios.get(`${process.env.NEXT_PUBLIC_HOST}/getOrderDetails/${order_id}`, config)
                yield put(actions.success(data.message))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const submitTransferTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'submitTransfer',
    defaultData: {} as string,
    defaultPayload: {} as IPayloadTransferFishSauce,
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(`${process.env.NEXT_PUBLIC_HOST}/exportFishSauce/`, action.payload, config)
                if (data.success === 'success') {
                    yield put(actions.success(data.success))
                } else {
                    yield put(actions.failure(data))
                }
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})
