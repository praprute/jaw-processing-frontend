import { ReactElement, useEffect, useState } from 'react'
import Head from 'next/head'
import { Breadcrumb, Button, Table } from 'antd'
import styled from 'styled-components'
import { ColumnsType } from 'antd/lib/table'

import { NextPageWithLayout } from '../_app'
import AppLayout from '../../components/Layouts'
import { useNavigation } from '../../utils/use-navigation'
import { getAllOrdersSellingTask } from '../../share-module/order/task'

const SellingPage: NextPageWithLayout = () => {
    // const { building_id, puddle_id } = router.query
    const navigation = useNavigation()
    const OFFSET_PAGE = 10
    const [currentPage, setCurrentPage] = useState(1)
    const [sourceData, setSourceData] = useState([])
    const [totalList, setTotalList] = useState(0)

    const getAllOrdersSelling = getAllOrdersSellingTask.useTask()

    const columns: ColumnsType<any> = [
        {
            title: 'หมายเลขรายการ',
            dataIndex: 'idorder_selling',
            key: 'idorder_selling',
        },
        {
            title: 'lot',
            key: 'lot',
            dataIndex: 'lot',
        },
        {
            title: 'ปริมาตร',
            key: 'volume',
            dataIndex: 'volume',
        },
        {
            title: 'ราคาต่อหน่วย',
            dataIndex: 'price_per_unit',
            key: 'price_per_unit',
        },
        {
            title: 'มูลค่ารวม',
            dataIndex: 'total_price',
            key: 'total_price',
        },
        {
            title: 'ชื่อลูกค้า',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'บ่อที่มา',
            dataIndex: 'serial',
            key: 'serial',
        },
        {
            title: 'รายละเอียดเพิ่มเติม',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'วันที่ทำรายการ',
            dataIndex: 'date_action',
            key: 'date_action',
        },
    ]

    useEffect(() => {
        ;(async () => {
            const res = await getAllOrdersSelling.onRequest({ page: currentPage - 1, offset: OFFSET_PAGE })
            setSourceData(res.data)
            setTotalList(res.total)
        })()
    }, [currentPage])

    const handleChangePagination = (pagination: any) => {
        setCurrentPage(pagination.current)
    }

    console.log('getAllOrdersSelling : ', getAllOrdersSelling.data)

    return (
        <>
            <Head>
                <title>Puddle Detail | Jaw Management</title>
                <meta content='Jaw Management' name='description' />
                <meta content='width=device-width, initial-scale=1' name='viewport' />
                <link href='/favicon.ico' rel='icon' />
            </Head>
            <Breadcrumb style={{ margin: '16px 0', fontSize: '12px' }}>
                <Breadcrumb.Item>Process Menagement</Breadcrumb.Item>
                <StyledBreadcrumbItem
                    onClick={() => {
                        navigation.navigateTo.home()
                    }}
                >
                    อาคารทั้งหมด
                </StyledBreadcrumbItem>
                {/* <StyledBreadcrumbItem
                    onClick={() => {
                        navigation.navigateTo.allPuddle(building_id as string)
                    }}
                >
                    รหัสอาคาร {building_id}
                </StyledBreadcrumbItem> */}
                <StyledBreadcrumbItem>ตู้</StyledBreadcrumbItem>
            </Breadcrumb>
            <StyledBoxHeader id='section-0'>
                <StyledTitleBoxHeader>
                    <span>ตู้</span>
                </StyledTitleBoxHeader>

                <StyledButton type='primary'>-</StyledButton>
            </StyledBoxHeader>
            <br />
            <StyledBoxContent>
                {/* {getAllOrdersSelling.data && (
                    <TableSelling
                        handleChangePagination={handleChangePagination}
                        total={getAllOrdersSelling.data?.total}
                        current={currentPage}
                        data={getAllOrdersSelling.data?.data}
                        loading={getAllOrdersSelling.loading}
                    />
                )}
                {JSON.stringify(sourceData)} */}
                <StyledTable
                    columns={columns}
                    dataSource={sourceData}
                    loading={getAllOrdersSelling.loading}
                    onChange={handleChangePagination}
                    pagination={{
                        total: totalList,
                        current: currentPage,
                        showSizeChanger: false,
                    }}
                />
            </StyledBoxContent>
        </>
    )
}

SellingPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>
            <>{page}</>
        </AppLayout>
    )
}

export default SellingPage

const StyledTable = styled(Table)`
    width: 100%;
    .ant-table-thead .ant-table-cell {
        // background-color: #23252b99;
        // color: white;
        font-weight: 400;
    }
`

const StyledBoxContent = styled.div`
    width: 100%;
    overflow-x: auto;
    display: flex;
    align-items: start;
    justify-content: center;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5.3px);
    -webkit-backdrop-filter: blur(5.3px);
    padding: 20px 20px 20px 20px;
    overflow-x: scroll;
`

const StyledTitleBoxHeader = styled.div`
    display: flex;
    align-items: start;
    justify-content: center;
    flex-direction: column;
`

const StyledBreadcrumbItem = styled(Breadcrumb.Item)`
    cursor: pointer;
`
const StyledBoxHeader = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5.3px);
    -webkit-backdrop-filter: blur(5.3px);
    width: 100%;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const StyledButton = styled(Button)`
    border-radius: 4px;
`
