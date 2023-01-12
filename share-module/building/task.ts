import { createReduxAsyncTask } from '@moonshot-team/saga-toolkit'
import { put } from 'redux-saga/effects'
import axios from 'axios'

import { myToken } from '../auth'
import { ICountingPuddle, IResAllBuilding, IResAllPuddleDto, MODULE_NAME } from './type'

export const getAllBuildingTasks = createReduxAsyncTask({
  moduleName: MODULE_NAME,
  name: 'getAllBuilding',
  defaultData: {} as IResAllBuilding,
  saga: ({ actions }) =>
    function* (action) {
      try {
        const getToken = yield myToken()
        const { data } = yield axios.get(`${process.env.NEXT_PUBLIC_HOST}/getAllBuilding`, {
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Access-Control-Allow-Credentials': true,
            Authorization: `Bearer ${getToken}`
          }
        })
        yield put(actions.success(data))
      } catch (error: any) {
        const errorResponse = yield error.json()
        yield put(actions.failure(errorResponse))
      }
    }
})

export const getAllBuildingTask = async () => {
  try {
    const getToken = await myToken()
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/getAllBuilding`, {
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        Authorization: `Bearer ${getToken}`
      }
    })

    return data as IResAllBuilding
  } catch (e: any) {
    return { success: 'error', message: e.response?.data[0]?.message }
  }
}

export const getAllPuddleByIdBuilding = async (building_id: number) => {
  try {
    const getToken = await myToken()
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/getCountingPuddleFromBuilding/${building_id}`, {
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        Authorization: `Bearer ${getToken}`
      }
    })

    return data.message as ICountingPuddle
  } catch (e: any) {
    return { puddle: 0 }
  }
}

export const getPuddleByIdBuilding = async (building_id: number) => {
  try {
    const getToken = await myToken()
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/getAllPuddle/${building_id}`, {
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        Authorization: `Bearer ${getToken}`
      }
    })

    return data as IResAllPuddleDto
  } catch (e: any) {
    return { success: 'error', message: e.response?.data[0]?.message }
  }
}
