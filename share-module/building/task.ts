/* eslint-disable prefer-const */
import { createReduxAsyncTask } from '@moonshot-team/saga-toolkit'
import { put } from 'redux-saga/effects'
import axios from 'axios'

import { myToken } from '../auth'
import { IAllBuildingAndPuddleDto, IAllPuddleDto, ICountingPuddle, IResAllBuilding, IResAllPuddleDto, MODULE_NAME } from './type'
import { configAPI } from '../configApi'

export const getAllBuildingTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'getAllBuilding',
    defaultData: {} as IAllBuildingAndPuddleDto[],
    saga: ({ actions }) =>
        function* (action) {
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

export const createPuddleTask = createReduxAsyncTask({
    moduleName: MODULE_NAME,
    name: 'createPuddle',
    defaultData: {} as any,
    defaultPayload: {} as { building_id: number },
    saga: ({ actions }) =>
        function* (action) {
            try {
                const { building_id } = action.payload
                const config = yield configAPI()
                const { data } = yield axios.post(`${process.env.NEXT_PUBLIC_HOST}/createPuddle`, { building_id }, config)
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
