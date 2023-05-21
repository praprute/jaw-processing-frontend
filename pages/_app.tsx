import '../styles/globals.css'
import 'antd/dist/antd.css'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css'
import { ReactElement, ReactNode, useEffect } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { useRouter } from 'next/router'

import { useStore } from '../share-module/store'
import { myToken } from '../share-module/auth/task'
import { useNavigation } from '../utils/use-navigation'
import RootHoc from '../components/RootHoc'

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}
type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const navigation = useNavigation()
    const router = useRouter()

    const store = useStore(pageProps.initialReduxState)
    const getLayout = Component.getLayout ?? ((page) => page)

    useEffect(() => {
        ;(async () => {
            const token = await myToken()
            if (!token) {
                navigation.navigateTo.signin()
            }
        })()
    }, [router.pathname])

    return (
        <>
            <ReduxProvider store={store}>
                <RootHoc>{getLayout(<Component {...pageProps} />)}</RootHoc>
            </ReduxProvider>
        </>
    )
}

export default MyApp
