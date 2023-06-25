import { Button, Divider, Form, Table } from 'antd'
import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ColumnsType } from 'antd/lib/table'
import moment from 'moment'

import AppLayout from '../../components/Layouts'
import FillterBox from '../../components/ReceiveFishWeightBill/FillterBox'
import { fillterReceiveWeightFishTask, getReceiveFishWeightPaginationTask } from '../../share-module/FishWeightBill/task'
import { NextPageWithLayout } from '../_app'
import { numberWithCommas } from '../../utils/format-number'
import { useNavigation } from '../../utils/use-navigation'
import { NoticeError } from '../../utils/noticeStatus'

const FishWeightReceivePage: NextPageWithLayout = () => {
    const [form] = Form.useForm()
    const navigation = useNavigation()

    const [currentPage, setCurrentPage] = useState(1)
    const [sourceData, setSourceData] = useState([])
    const [totalList, setTotalList] = useState(0)
    const getReceiveFishWeight = getReceiveFishWeightPaginationTask.useTask()
    const fillterReceiveWeight = fillterReceiveWeightFishTask.useTask()

    const OFFSET_PAGE = 10

    const columns: ColumnsType<any> = [
        {
            title: 'ลำดับที่',
            dataIndex: 'no',
            key: 'no',
        },
        {
            title: 'วันที่',
            dataIndex: 'date_action',
            key: 'date_action',
            render: (date_action: string) => <span>{moment(date_action).format('DD/MM/YYYY')}</span>,
        },

        {
            title: 'น้ำหนักสุทธิ',
            dataIndex: 'weigh_net',
            key: 'weigh_net',
            render: (weigh_net: number) => <span>{numberWithCommas(weigh_net)}</span>,
        },
        {
            title: 'ราคา / กก.',
            dataIndex: 'price_per_weigh',
            key: 'price_per_weigh',
        },
        {
            title: 'จำนวนเงินรวม',
            dataIndex: 'amount_price',
            key: 'amount_price',
            render: (amount_price: number) => <span>{numberWithCommas(amount_price)}</span>,
        },
        {
            title: 'ทะเบียนรถ',
            dataIndex: 'vehicle_register',
            key: 'vehicle_register',
        },
        {
            title: 'ชื่อลูกค้า',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'ชื่อสินค้า',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            title: 'stock คงเหลือ',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock: number) => <span>{numberWithCommas(stock)}</span>,
        },
    ]

    useEffect(() => {
        ;(async () => {
            await handleGetListReceive()
        })()
    }, [currentPage])

    const handleGetListReceive = async () => {
        try {
            const res = await getReceiveFishWeight.onRequest({ page: currentPage - 1, offset: OFFSET_PAGE })
            setSourceData(res.data)
            setTotalList(res.total)
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        }
    }

    const handleSubmit = async (values: any) => {
        try {
            const res = await fillterReceiveWeight.onRequest(values)
            setSourceData(res)
            setTotalList(10)
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        }
    }

    const handleChangePagination = (pagination: any) => {
        setCurrentPage(pagination.current)
    }

    return (
        <>
            <StyledNavMenu>
                <div className='container'>
                    <Button
                        onClick={() => {
                            navigation.navigateTo.createFishWeightReceive()
                        }}
                        type='primary'
                    >
                        ลงทะเบียนใบชั่ง
                    </Button>
                </div>
            </StyledNavMenu>
            <SectionFillter>
                <StyledForm autoComplete='off' form={form} hideRequiredMark layout='vertical' onFinish={handleSubmit}>
                    <FillterBox />
                </StyledForm>
            </SectionFillter>

            <SectionFillter>
                <Container>
                    <Divider style={{ backgroundColor: '#FFFFFF66' }} type='horizontal' />{' '}
                </Container>
            </SectionFillter>

            <SectionTable>
                <Container>
                    <h3>รายการใบชั่งปลา</h3>
                    <StyledTable
                        columns={columns}
                        dataSource={sourceData}
                        loading={getReceiveFishWeight.loading || fillterReceiveWeight.loading}
                        onChange={handleChangePagination}
                        pagination={{
                            total: totalList,
                            current: currentPage,
                            showSizeChanger: false,
                        }}
                    />
                </Container>
            </SectionTable>
        </>
    )
}

FishWeightReceivePage.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>
            <>{page}</>
        </AppLayout>
    )
}

export default FishWeightReceivePage

const StyledNavMenu = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    .container {
        width: 100%;
        max-width: 1280px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 0px;
    }
    Button {
        padding: 0px 32px;
    }
`
const StyledTable = styled(Table)`
    width: 100%;
    .ant-table-thead .ant-table-cell {
        font-weight: 400;
    }
`

const StyledForm = styled(Form)`
    width: 100%;
    display: flex;
    justify-content: center;
`

const Container = styled.div`
    width: 100%;
    max-width: 1280px;
`

const SectionTable = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    overflow-x: scroll;
`
const SectionFillter = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
`
