import { ReactElement } from 'react'

import AppLayout from '../../components/Layouts'

const StockSaltPage = () => {
    return <></>
}

StockSaltPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>
            <>{page}</>
        </AppLayout>
    )
}

export default StockSaltPage
