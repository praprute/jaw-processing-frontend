import { createReduxAsyncTask } from '@moonshot-team/saga-toolkit'
import { put } from 'redux-saga/effects'
import axios from 'axios'

import { configAPI } from '../configApi'
import {
    IDeleteGetInPayload,
    INoticeTargetPendingDto,
    IOrderDetailDto,
    IOrderDto,
    IPayloadTransferFishSauce,
    IPayloadTransferSaltWater,
    ISubmitGetIn,
    MODULE_NAME,
} from './type'

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
        start_date: string
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

export const submitTransferSaltWaterTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'submitTransferSaltWater',
    defaultData: {} as string,
    defaultPayload: {} as IPayloadTransferSaltWater,
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(
                    `${process.env.NEXT_PUBLIC_HOST}/exportSaltWaterToNewPuddleTask/`,
                    action.payload,
                    config,
                )
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

export const getNoticeTargetPendingTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getNoticeTargetPending',
    defaultData: {} as INoticeTargetPendingDto[],
    defaultPayload: {} as { puddle_id: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const { puddle_id } = action.payload
                const config = yield configAPI()
                const { data } = yield axios.get(`${process.env.NEXT_PUBLIC_HOST}/getTargetPending/${puddle_id}`, config)
                yield put(actions.success(data.message))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const submitGetInFishSaurceTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'submitGetInFishSaurce',
    defaultData: {} as { success: string; message: any },
    defaultPayload: {} as ISubmitGetIn,
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(`${process.env.NEXT_PUBLIC_HOST}/submitImportFish/`, action.payload, config)
                yield put(actions.success(data))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const deleteTransactionGetInTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'deleteTransactionGetIn',
    defaultData: {} as { success: string; message?: any },
    defaultPayload: {} as IDeleteGetInPayload,
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.delete(`${process.env.NEXT_PUBLIC_HOST}/cancelGetIn/`, {
                    headers: config.headers,
                    data: action.payload,
                })
                yield put(actions.success(data))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const updateProcessDescritionSubOrderTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'updateProcessDescritionSubOrder',
    defaultData: {} as { success: string; message?: any },
    defaultPayload: {} as { process: number; subOrderId: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.put(
                    `${process.env.NEXT_PUBLIC_HOST}/updateProcessDescritionSubOrder/`,
                    action.payload,
                    config,
                )
                yield put(actions.success(data))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const submitCloseProcessTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'submitCloseProcess',
    defaultData: {} as string,
    defaultPayload: {} as {
        order_id: number
        type_process: number
        amount_items: number
        amount_unit_per_price: number
        amount_price: number
        remaining_items: number
        remaining_unit_per_price: number
        remaining_price: number
        approved: number
        volume: number
        remaining_volume: number
        date_action: string
    },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(`${process.env.NEXT_PUBLIC_HOST}/closeProcess/`, action.payload, config)
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

export const submitAddOnSaltWaterTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'submitAddOnSaltWater',
    defaultData: {} as { success: string },
    defaultPayload: {} as {
        order_id: number
        type_process: number
        amount_items: number
        amount_unit_per_price: number
        amount_price: number
        remaining_items: number
        remaining_unit_per_price: number
        remaining_price: number
        volume: number
        remaining_volume: number
        process?: number
        new_stock: number
        idreceipt: number
        id_puddle: number
        date_action?: string
    },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(`${process.env.NEXT_PUBLIC_HOST}/addOnSaltWaterTask`, action.payload, config)
                const res: { success: string; message: any } = data
                yield put(actions.success({ success: res.success }))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})
export const submitAddOnFishSauceTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'submitAddOnFishSauce',
    defaultData: {} as { success: string },
    defaultPayload: {} as {
        order_id: number
        type_process: number
        amount_items: number
        amount_unit_per_price: number
        amount_price: number
        remaining_items: number
        remaining_unit_per_price: number
        remaining_price: number
        volume: number
        remaining_volume: number
        process?: number
        new_stock: number
        idreceipt: number
        id_puddle: number
        date_action: string
    },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(
                    `${process.env.NEXT_PUBLIC_HOST}/addOnFishSauceWaterTask`,
                    action.payload,
                    config,
                )
                const res: { success: string; message: any } = data
                yield put(actions.success({ success: res.success }))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

// getAllFeeLaborPerBuildingByBuilding
export const getFeeLaborPerBuildingByBuildingTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getFeeLaborPerBuildingByBuilding',
    defaultData: {} as {
        idlabor_price_per_building: number
        building: number
        price: number
        date_create: string
    },
    defaultPayload: {} as { id_building: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const { id_building } = action.payload
                const config = yield configAPI()
                const { data } = yield axios.get(
                    `${process.env.NEXT_PUBLIC_HOST}/getFeeLaborPerBuildingByBuilding/${id_building}`,
                    config,
                )
                yield put(actions.success(data.message[0]))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const getAllFeeLaborFermentTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getAllFeeLaborFerment',
    defaultData: {} as {
        idlabor_price_ferment: number
        price: number
        date_create: string
    },
    saga: ({ actions }) =>
        function* () {
            try {
                const config = yield configAPI()
                const { data } = yield axios.get(`${process.env.NEXT_PUBLIC_HOST}/getAllFeeLaborFerment`, config)
                yield put(actions.success(data.message[0]))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})
export const updateFeeLaborFermentTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'updateFeeLaborFerment',
    defaultData: {} as any,
    defaultPayload: {} as { id_price: number; price: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.put(`${process.env.NEXT_PUBLIC_HOST}/updateFeeLaborFerment`, action.payload, config)
                yield put(actions.success(data.message[0]))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const getAllFeeLaborPerBuildingTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getAllFeeLaborPerBuilding',
    defaultData: {} as {
        idlabor_price_per_building: number
        building: number
        price: number
        date_create: string
        idbuilding: number
        name: string
    }[],
    saga: ({ actions }) =>
        function* () {
            try {
                const config = yield configAPI()
                const { data } = yield axios.get(`${process.env.NEXT_PUBLIC_HOST}/getAllFeeLaborPerBuilding`, config)
                yield put(actions.success(data.message))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const updateFeeLaborPerBuildingTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'updateFeeLaborPerBuilding',
    defaultData: {} as any,
    defaultPayload: {} as { id_price: number; price: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.put(
                    `${process.env.NEXT_PUBLIC_HOST}/updateFeeLaborPerBuilding`,
                    action.payload,
                    config,
                )
                yield put(actions.success(data.message[0]))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const getListFishTypeTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getListFishType',
    defaultData: {} as {
        idfish_type: number
        name: string
    }[],
    saga: ({ actions }) =>
        function* () {
            try {
                const config = yield configAPI()
                const { data } = yield axios.get(`${process.env.NEXT_PUBLIC_HOST}/getListFishType`, config)
                yield put(actions.success(data.message))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const createFishTypeTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'createFishType',
    defaultData: {} as any,
    defaultPayload: {} as { name: string },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(`${process.env.NEXT_PUBLIC_HOST}/createFishType`, action.payload, config)
                yield put(actions.success(data.message))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const deleteFishTypeTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'deleteFishType',
    defaultData: {} as any,
    defaultPayload: {} as { idfish_type: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const { idfish_type } = action.payload
                const config = yield configAPI()
                const { data } = yield axios.delete(`${process.env.NEXT_PUBLIC_HOST}/deleteFishType/${idfish_type}`, config)
                yield put(actions.success(data.message))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

// Settign Working Status

export const getWorkingStatusTypeTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getWorkingStatusType',
    defaultData: {} as {
        idworking_status: number
        title: string
        color: string
    }[],
    saga: ({ actions }) =>
        function* () {
            try {
                const config = yield configAPI()
                const { data } = yield axios.get(`${process.env.NEXT_PUBLIC_HOST}/getListWorkingStatus`, config)
                yield put(actions.success(data.message))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const createWorkingStatusTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'createWorkingStatus',
    defaultData: {} as any,
    defaultPayload: {} as { title: string; color: string },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.post(`${process.env.NEXT_PUBLIC_HOST}/createWorkingStatus`, action.payload, config)
                yield put(actions.success(data.message))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const deleteWorkingStatusTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'deleteWorkingStatus',
    defaultData: {} as any,
    defaultPayload: {} as { idworking_status: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const { idworking_status } = action.payload
                const config = yield configAPI()
                const { data } = yield axios.delete(
                    `${process.env.NEXT_PUBLIC_HOST}/deleteWorkingStatus/${idworking_status}`,
                    config,
                )
                yield put(actions.success(data.message))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})
