import { ReactElement, useEffect, useState } from 'react'
import { Button, Divider, Form, Table, Tabs } from 'antd'
import styled from 'styled-components'
import { ColumnsType } from 'antd/lib/table'
import moment from 'moment'

import AppLayout from '../../components/Layouts'
import { useNavigation } from '../../utils/use-navigation'
import { NextPageWithLayout } from '../_app'
import { numberWithCommas } from '../../utils/format-number'
import {
    fillterReceiveSaltTask,
    fillterReceiveSolidSaltTask,
    getReceiveSaltPaginationTask,
    getReceiveSolidSaltPaginationTask,
} from '../../share-module/FishWeightBill/task'
import { NoticeError } from '../../utils/noticeStatus'
import FillterSaltBox from '../../components/SaltBill/FillterSaltBox'

const SaltReceivePage: NextPageWithLayout = () => {
    const [form] = Form.useForm()
    const [formSolidSalt] = Form.useForm()
    const navigation = useNavigation()
    const [currentPage, setCurrentPage] = useState(1)
    const [sourceData, setSourceData] = useState([])
    const [totalList, setTotalList] = useState(0)

    const [currentPageSolidSalt, setCurrentPageSolidSalt] = useState(1)
    const [sourceDataSolidSalt, setSourceDataDataSolidSalt] = useState([])
    const [totalListSolidSalt, setTotalListSolidSalt] = useState(0)

    const getReceiveSaltPagination = getReceiveSaltPaginationTask.useTask()
    const fillterReceiveSalt = fillterReceiveSaltTask.useTask()
    const getReceiveSolidSaltPagination = getReceiveSolidSaltPaginationTask.useTask()
    const fillterReceiveSolidSalt = fillterReceiveSolidSaltTask.useTask()

    const OFFSET_PAGE = 10

    const columns: ColumnsType<any> = [
        {
            title: 'ลำดับที่',
            dataIndex: 'no',
            key: 'no',
        },
        {
            title: 'วันที่',
            dataIndex: 'date_create',
            key: 'date_create',
            render: (date_create: string) => <span>{moment(date_create).format('DD/MM/YYYY')}</span>,
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
            dataIndex: 'price_net',
            key: 'price_net',
            render: (price_net: number) => <span>{numberWithCommas(price_net)}</span>,
        },
        {
            title: 'ชื่อลูกค้า',
            dataIndex: 'customer',
            key: 'customer',
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
            await handleGetListsolidSaltReceive()
        })()
    }, [currentPage, currentPageSolidSalt])

    const handleGetListReceive = async () => {
        try {
            const res = await getReceiveSaltPagination.onRequest({ page: currentPage - 1, offset: OFFSET_PAGE })
            setSourceData(res.data)
            setTotalList(res.total)
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        }
    }
    const handleGetListsolidSaltReceive = async () => {
        try {
            const res = await getReceiveSolidSaltPagination.onRequest({ page: currentPageSolidSalt - 1, offset: OFFSET_PAGE })
            setSourceDataDataSolidSalt(res.data)
            setTotalListSolidSalt(res.total)
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        }
    }

    const handleChangePagination = (pagination: any) => {
        setCurrentPage(pagination.current)
    }

    const handleChangePaginationSolidSalt = (pagination: any) => {
        setCurrentPageSolidSalt(pagination.current)
    }

    const handleSubmit = async (values: any) => {
        try {
            const res = await fillterReceiveSalt.onRequest(values)
            setSourceData(res)
            setTotalList(10)
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        }
    }
    const handleSubmitSolidSalt = async (values: any) => {
        try {
            const res = await fillterReceiveSolidSalt.onRequest(values)
            setSourceDataDataSolidSalt(res)
            setTotalListSolidSalt(100)
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        }
    }

    return (
        <StyledNavMenu>
            <Tabs
                defaultActiveKey='1'
                items={[
                    {
                        label: 'บิลน้ำเกลือ',
                        key: '1',
                        children: (
                            <>
                                <StyledNavMenu>
                                    <div className='container'>
                                        <Button
                                            onClick={() => {
                                                navigation.navigateTo.createSaltBillReceive()
                                            }}
                                            type='primary'
                                        >
                                            ลงทะเบียนบิลน้ำเกลือ
                                        </Button>
                                    </div>
                                </StyledNavMenu>
                                <SectionFillter>
                                    <StyledForm
                                        autoComplete='off'
                                        form={form}
                                        hideRequiredMark
                                        layout='vertical'
                                        onFinish={handleSubmit}
                                    >
                                        <FillterSaltBox />
                                    </StyledForm>
                                </SectionFillter>
                                <SectionFillter>
                                    <Container>
                                        <Divider style={{ backgroundColor: '#FFFFFF66' }} type='horizontal' />{' '}
                                    </Container>
                                </SectionFillter>
                                <SectionTable>
                                    <Container>
                                        <h3>รายการบิลเกลือ</h3>
                                        <StyledTable
                                            columns={columns}
                                            dataSource={sourceData}
                                            loading={getReceiveSaltPagination.loading || fillterReceiveSalt.loading}
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
                        ),
                    },
                    {
                        label: 'บิลเกลือ',
                        key: '2',
                        children: (
                            <>
                                <StyledNavMenu>
                                    <div className='container'>
                                        <Button
                                            onClick={() => {
                                                navigation.navigateTo.createSolidSaltBillReceive()
                                            }}
                                            type='primary'
                                        >
                                            ลงทะเบียนบิลเกลือ
                                        </Button>
                                    </div>
                                </StyledNavMenu>
                                <SectionFillter>
                                    <StyledForm
                                        autoComplete='off'
                                        form={formSolidSalt}
                                        hideRequiredMark
                                        layout='vertical'
                                        onFinish={handleSubmitSolidSalt}
                                    >
                                        <FillterSaltBox />
                                    </StyledForm>
                                </SectionFillter>
                                <SectionFillter>
                                    <Container>
                                        <Divider style={{ backgroundColor: '#FFFFFF66' }} type='horizontal' />{' '}
                                    </Container>
                                </SectionFillter>
                                <SectionTable>
                                    <Container>
                                        <h3>รายการบิลเกลือ</h3>
                                        <StyledTable
                                            columns={columns}
                                            dataSource={sourceDataSolidSalt}
                                            loading={getReceiveSolidSaltPagination.loading || fillterReceiveSalt.loading}
                                            onChange={handleChangePaginationSolidSalt}
                                            pagination={{
                                                total: totalListSolidSalt,
                                                current: currentPageSolidSalt,
                                                showSizeChanger: false,
                                            }}
                                        />
                                    </Container>
                                </SectionTable>
                            </>
                        ),
                    },
                ]}
                type='card'
            />
        </StyledNavMenu>
    )
}

SaltReceivePage.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>
            <>{page}</>
        </AppLayout>
    )
}

export default SaltReceivePage

const StyledForm = styled(Form)`
    width: 100%;
    display: flex;
    justify-content: center;
`

const SectionFillter = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
`

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

const SectionTable = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    overflow-x: scroll;
`
const Container = styled.div`
    width: 100%;
    max-width: 1280px;
`
const StyledTable = styled(Table)`
    width: 100%;
    .ant-table-thead .ant-table-cell {
        font-weight: 400;
    }
`
