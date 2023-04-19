import { createReduxAsyncTask } from '@moonshot-team/saga-toolkit'
import { put } from 'redux-saga/effects'
import axios from 'axios'

import { configAPI } from '../configApi'
import { IDtoFishWeight, IListFishWeight, IListFishWeightLog, ILogSaltBillDto, MODULE_NAME } from './type'

export const getReceiveFishWeightPaginationTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getReceiveFishWeightPagination',
    defaultData: {} as IListFishWeight,
    defaultPayload: {} as { page: number; offset: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const { page, offset } = action.payload
                const config = yield configAPI()
                const { data } = yield axios.get(
                    `${process.env.NEXT_PUBLIC_HOST}/getReceiveFishWeightPaginationTask/${page}/${offset}`,
                    config,
                )

                yield put(actions.success(data))
            } catch (error: any) {
                const errorResponse = yield error.json()
                yield put(actions.failure(errorResponse))
            }
        },
})

export const fillterReceiveWeightFishTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'fillterReceiveWeightFish',
    defaultData: {} as IDtoFishWeight[],
    defaultPayload: {} as {
        no?: string
        weigh_in?: string
        weigh_out?: string
        weigh_net?: string
        time_in?: string
        time_out?: string
        vehicle_register?: string
        customer_name?: string
        product_name?: string
        store_name?: string
    },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(
                    `${process.env.NEXT_PUBLIC_HOST}/fillterReceiveWeightFish`,
                    action.payload,
                    config,
                )
                yield put(actions.success(data.message))
            } catch (error: any) {
                const errorResponse = yield error.json()
                yield put(actions.failure(errorResponse))
            }
        },
})

export const createReceiveWeightFishTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'createReceiveWeightFish',
    defaultData: {} as { success: string },
    defaultPayload: {} as {
        no: string
        weigh_net: number
        price_per_weigh: number
        amount_price: number
        vehicle_register: string
        customer_name: string
        product_name: string
        store_name: string
        description?: string
    },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(
                    `${process.env.NEXT_PUBLIC_HOST}/submitCreateReceiveWeightFish`,
                    action.payload,
                    config,
                )

                const res: { success: string; message: any } = data
                yield put(actions.success({ success: res.success }))
            } catch (error: any) {
                const errorResponse = yield error.json()
                yield put(actions.failure(errorResponse))
            }
        },
})

export const insertLogBillOpenOrderTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'insertLogBillOpenOrder',
    defaultData: {} as { success: string },
    defaultPayload: {} as {
        new_stock: number
        idreceipt: number
        order_target: number
        id_puddle: number
    },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(`${process.env.NEXT_PUBLIC_HOST}/updateStockTask`, action.payload, config)

                const res: { success: string; message: any } = data
                yield put(actions.success({ success: res.success }))
            } catch (error: any) {
                const errorResponse = yield error.json()
                yield put(actions.failure(errorResponse))
            }
        },
})

export const getReceiveWeightFishByOrderIdTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getReceiveWeightFishByOrderId',
    defaultData: {} as IListFishWeightLog[],
    defaultPayload: {} as {
        order_id: number
    },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const { order_id } = action.payload
                const config = yield configAPI()
                const { data } = yield axios.get(
                    `${process.env.NEXT_PUBLIC_HOST}/getReceiveWeightFishByOrdersIdTask/${order_id}`,
                    config,
                )

                const res: IListFishWeightLog[] = data
                yield put(actions.success(res))
            } catch (error: any) {
                const errorResponse = yield error.json()
                yield put(actions.failure(errorResponse))
            }
        },
})

// Salt
export const getReceiveSaltPaginationTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getReceiveSaltPagination',
    defaultData: {} as any,
    defaultPayload: {} as { page: number; offset: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const { page, offset } = action.payload
                const config = yield configAPI()
                const { data } = yield axios.get(
                    `${process.env.NEXT_PUBLIC_HOST}/getReceiveSaltBillPaginationTask/${page}/${offset}`,
                    config,
                )

                yield put(actions.success(data))
            } catch (error: any) {
                const errorResponse = yield error.json()
                yield put(actions.failure(errorResponse))
            }
        },
})

export const fillterReceiveSaltTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'fillterReceiveSalt',
    defaultData: {} as IDtoFishWeight[],
    defaultPayload: {} as {
        no?: string
        weigh_net?: string
        customer_name?: string
        product_name?: string
        stock?: string
    },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(
                    `${process.env.NEXT_PUBLIC_HOST}/fillterReceiveSaltTask`,
                    action.payload,
                    config,
                )
                yield put(actions.success(data.message))
            } catch (error: any) {
                const errorResponse = yield error.json()
                yield put(actions.failure(errorResponse))
            }
        },
})

export const createReceiveSaltTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'createReceiveSalt',
    defaultData: {} as { success: string },
    defaultPayload: {} as {
        no: string
        weigh_net: number
        price_per_weigh: number
        price_net: number
        customer: string
        product_name: string
    },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(`${process.env.NEXT_PUBLIC_HOST}/createSaltBillTask`, action.payload, config)

                const res: { success: string; message: any } = data
                yield put(actions.success({ success: res.success }))
            } catch (error: any) {
                const errorResponse = yield error.json()
                yield put(actions.failure(errorResponse))
            }
        },
})

export const getLogReceiveSaltByOrdersIdTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getLogReceiveSaltByOrdersId',
    defaultData: {} as ILogSaltBillDto[],
    defaultPayload: {} as {
        order_id: number
    },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const { order_id } = action.payload
                const config = yield configAPI()
                const { data } = yield axios.get(
                    `${process.env.NEXT_PUBLIC_HOST}/getLogReceiveSaltByOrdersIdTask/${order_id}`,
                    config,
                )
                const res: ILogSaltBillDto[] = data
                yield put(actions.success(res))
            } catch (error: any) {
                const errorResponse = yield error.json()
                yield put(actions.failure(errorResponse))
            }
        },
})
