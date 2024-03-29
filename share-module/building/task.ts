import { createReduxAsyncTask } from '@moonshot-team/saga-toolkit'
import { put } from 'redux-saga/effects'
import axios from 'axios'

import { IAllBuildingAndPuddleDto, IAllPuddleDto, IDetailPuddle, IResAllPuddleDto, MODULE_NAME } from './type'
import { configAPI } from '../configApi'
import { myToken } from '../auth/task'

export const getAllBuildingTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getAllBuilding',
    defaultData: {} as IAllBuildingAndPuddleDto[],
    saga: ({ actions }) =>
        function* () {
            try {
                const config = yield configAPI()
                const { data } = yield axios.get(`${process.env.NEXT_PUBLIC_HOST}/getAllBuilding`, config)

                let dataBuilding: IAllBuildingAndPuddleDto[] = []
                if (data.message.length > 0) {
                    for (const items of data.message) {
                        const { data } = yield axios.get(
                            `${process.env.NEXT_PUBLIC_HOST}/getCountingPuddleFromBuilding/${items.idbuilding}`,
                            config,
                        )
                        dataBuilding.push({ ...items, allPuddle: data?.message?.puddle })
                    }
                    yield put(actions.success(dataBuilding))
                }
            } catch (error: any) {
                const errorResponse = yield error.json()
                yield put(actions.failure(errorResponse))
            }
        },
})

export const getPuddleByIdBuildingTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getPuddleByIdBuilding',
    defaultData: {} as IAllPuddleDto[],
    defaultPayload: {} as { building_id: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const { building_id } = action.payload
                const config = yield configAPI()
                const { data } = yield axios.get(`${process.env.NEXT_PUBLIC_HOST}/getAllPuddle/${building_id}`, config)
                if (data.success === 'success') {
                    yield put(actions.success(data.message as IAllPuddleDto[]))
                }
            } catch (error: any) {
                const errorResponse = yield error.json()
                yield put(actions.failure(errorResponse))
            }
        },
})

export const getPuddleDetailByIdTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getPuddleDetailById',
    defaultData: {} as IDetailPuddle,
    defaultPayload: {} as { puddle_id: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const { puddle_id } = action.payload
                const config = yield configAPI()
                const { data } = yield axios.get(`${process.env.NEXT_PUBLIC_HOST}/getDetailPuddleById/${puddle_id}`, config)
                if (data.success === 'success') {
                    yield put(actions.success(data.message[0] as IDetailPuddle))
                }
            } catch (error: any) {
                const errorResponse = yield error.json()
                yield put(actions.failure(errorResponse))
            }
        },
})

export const createPuddleTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'createPuddle',
    defaultData: {} as any,
    defaultPayload: {} as { building_id: number; serial: string },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const { building_id, serial } = action.payload
                const config = yield configAPI()
                const { data } = yield axios.post(`${process.env.NEXT_PUBLIC_HOST}/createPuddle`, { building_id, serial }, config)
                yield put(actions.success(data))
            } catch (error: any) {
                const errorResponse = yield error.json()
                yield put(actions.failure(errorResponse))
            }
        },
})

export const getPuddleByIdBuilding = async (building_id: number) => {
    try {
        const getToken = await myToken()
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/getAllPuddle/${building_id}`, {
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                Authorization: `Bearer ${getToken}`,
            },
        })

        return data as IResAllPuddleDto
    } catch (e: any) {
        return { success: 'error', message: e.response?.data[0]?.message }
    }
}

export const changeWorkingStatusPuddleTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'changeWorkingStatusPuddle',
    defaultData: {} as any,
    defaultPayload: {} as { puddle_id: number; working_status: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.put(
                    `${process.env.NEXT_PUBLIC_HOST}/changeWorkingStatusPuddle`,
                    action.payload,
                    config,
                )
                yield put(actions.success(data.message))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const updateStatusTopSaltTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'updateStatusTopSalt',
    defaultData: {} as any,
    defaultPayload: {} as { idpuddle: number; topSalt: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.put(
                    `${process.env.NEXT_PUBLIC_HOST}/updateStatusTopSaltTask`,
                    action.payload,
                    config,
                )
                yield put(actions.success(data.message))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const updateDateStartFermantTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'updateDateStartFermant',
    defaultData: {} as any,
    defaultPayload: {} as { idpuddle: number; start_date: string },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const config = yield configAPI()
                const { data } = yield axios.put(
                    `${process.env.NEXT_PUBLIC_HOST}/updateDateStartFermantTask`,
                    action.payload,
                    config,
                )
                yield put(actions.success(data.message))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

export const getLastedSubOrderByIdTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getLastedSubOrderById',
    defaultData: {} as any,
    defaultPayload: {} as { puddle_id: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const { puddle_id } = action.payload
                const config = yield configAPI()
                const { data } = yield axios.get(
                    `${process.env.NEXT_PUBLIC_HOST}/getLastedSubOrderById?puddle_id=${puddle_id}`,
                    config,
                )
                yield put(actions.success(data.message))
            } catch (error: any) {
                yield put(actions.failure(error.response.data))
            }
        },
})

// export const getLastedSubOrderByIdTask = async (building_id: number) => {
//     try {
//         const getToken = await myToken()
//         const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/getLastedSubOrderById/${building_id}`, {
//             headers: {
//                 Accept: 'application/json',
//                 'Content-type': 'application/json',
//                 'Access-Control-Allow-Credentials': true,
//                 Authorization: `Bearer ${getToken}`,
//             },
//         })

//         return data as IResAllPuddleDto
//     } catch (e: any) {
//         return { success: 'error', message: e.response?.data[0]?.message }
//     }
// }
