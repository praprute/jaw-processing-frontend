import { legacy_createStore as createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createRouterMiddleware, initialRouterState, routerReducer } from 'connected-next-router'
import { loadReducers, loadSagaTasks } from '@moonshot-team/saga-toolkit'
import createReduxWaitForMiddleware from '@moonshot-team/saga-toolkit/dist/redux-wait-for-action'
import { all } from '@redux-saga/core/effects'
import { useMemo } from 'react'
import Router from 'next/router'

import * as modules from './root-module'

const bindMiddleware = (middleware: any) => {
    if (process.env.NODE_ENV !== 'production') {
        const { composeWithDevTools } = require('redux-devtools-extension')
        return composeWithDevTools(applyMiddleware(...middleware))
    }
    return applyMiddleware(...middleware)
}

const initStore = (preloadedState: any = {}) => {
    const { asPath } = Router.router || {}
    if (asPath) {
        preloadedState.router = initialRouterState(asPath)
    }
    const routerMiddleware = createRouterMiddleware()
    const sagaMiddleware = createSagaMiddleware()

    const reducers = {
        ...loadReducers(getModules(), preloadedState),
        router: routerReducer,
    }

    const rootReducer = combineReducers(reducers)
    const store = createStore(
        rootReducer,
        preloadedState,
        bindMiddleware([sagaMiddleware, createReduxWaitForMiddleware(), routerMiddleware]),
    )

    const tasks = loadSagaTasks(getModules())
    function* rootSaga() {
        yield all([...tasks])
    }
    sagaMiddleware.run(rootSaga)
    return store
}

let store: any

const initializeStore = (preloadedState: any) => {
    let _store = store ?? initStore(preloadedState)

    if (preloadedState && store) {
        _store = initStore({
            ...store.getState(),
            ...preloadedState,
        })

        store = undefined
    }

    if (typeof window === 'undefined') {
        return _store
    }

    if (!store) {
        store = _store
    }

    return _store
}

const getModules = () => {
    const initialize_modules = process.env.NEXT_PUBLIC_MODULES || undefined

    switch (initialize_modules) {
        case 'JAW_MANAGEMENT':
            return modules
        default:
            return null
    }
}

export function useStore(initialState: any) {
    const store = useMemo(() => initializeStore(initialState), [initialState])
    return store
}
