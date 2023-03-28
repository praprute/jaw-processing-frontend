import { useRouter } from 'next/router'
import React, { useEffect, ReactNode } from 'react'

import { myToken } from '../../share-module/auth/task'
import { useNavigation } from '../../utils/use-navigation'

interface IRootHoc {
    children: ReactNode
}
const RootHoc = (props: IRootHoc) => {
    const { children } = props
    const navigation = useNavigation()
    const router = useRouter()

    useEffect(() => {
        ;(async () => {
            const token = await myToken()
            if (!token) {
                navigation.navigateTo.signin()
            }
        })()
    }, [router.pathname])
    return <>{children}</>
}

export default RootHoc
