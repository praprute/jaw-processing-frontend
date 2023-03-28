import '../styles/globals.css'
import 'antd/dist/antd.css'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css'
import { ReactElement, ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import { useStore } from '../share-module/store'
import RootHoc from '../components/RootHoc'

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}
type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const store = useStore(pageProps.initialReduxState)
    const getLayout = Component.getLayout ?? ((page) => page)

    return (
        <>
            <ReduxProvider store={store}>
                <RootHoc>{getLayout(<Component {...pageProps} />)}</RootHoc>
            </ReduxProvider>
        </>
    )
}

export default MyApp
