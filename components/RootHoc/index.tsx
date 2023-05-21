import React, { ReactNode } from 'react'

interface IRootHoc {
    children: ReactNode
}
const RootHoc = (props: IRootHoc) => {
    const { children } = props

    return <>{children}</>
}

export default RootHoc
