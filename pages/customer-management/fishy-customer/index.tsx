import { Button, Table, Form, Input, Row, Col } from 'antd'
import moment from 'moment'
import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ColumnsType } from 'antd/lib/table'

import AppLayout from '../../../components/Layouts'
import {
    createCustomerTask,
    deleteCustomerTask,
    getCustomerByBillTaskPaginationTask,
} from '../../../share-module/FishWeightBill/task'
import { NextPageWithLayout } from '../../_app'
import { NoticeError, NoticeSuccess } from '../../../utils/noticeStatus'
import { ICustomerList } from '../../../share-module/FishWeightBill/type'

const CustomerFishyBill: NextPageWithLayout = () => {
    const [form] = Form.useForm()

    const [currentPage, setCurrentPage] = useState(1)
    const [sourceData, setSourceData] = useState([])
    const [totalList, setTotalList] = useState(0)
    const [trigger, setTrigger] = useState(false)

    const TYPE_BILL = 6
    const OFFSET_PAGE = 10

    const getCustomerByBillTaskPagination = getCustomerByBillTaskPaginationTask.useTask()
    const createCustomer = createCustomerTask.useTask()
    const deleteCustomer = deleteCustomerTask.useTask()

    const columns: ColumnsType<any> = [
        {
            title: 'ID',
            dataIndex: 'idcustomer_bill',
            key: 'idcustomer_bill',
        },
        {
            title: 'ชื่อลูกค้า',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'วันที่เพิ่ม',
            dataIndex: 'date_create',
            key: 'date_create',
            render: (date_create: string) => <span>{moment(date_create).format('DD/MM/YYYY')}</span>,
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, data: ICustomerList) => (
                <StyldeButtonSubmit
                    onClick={async () => {
                        await handleDelete(data?.idcustomer_bill)
                    }}
                >
                    ลบ
                </StyldeButtonSubmit>
            ),
        },
    ]

    useEffect(() => {
        ;(async () => {
            const res = await getCustomerByBillTaskPagination.onRequest({
                page: currentPage - 1,
                offset: OFFSET_PAGE,
                type_bill: TYPE_BILL,
            })
            setSourceData(res.data)
            setTotalList(res.total)
        })()
    }, [currentPage, trigger])

    const handleSubmit = async () => {
        try {
            const payload = {
                name: form.getFieldValue('name').trim(),
                type_bill: TYPE_BILL,
            }
            const res = await createCustomer.onRequest(payload)
            if (res.success === 'success') {
                NoticeSuccess('ทำรายการสำเร็จ')
            }
        } catch (e) {
            console.error(e)
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        } finally {
            form.resetFields()
            setTrigger(!trigger)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const payload = {
                idcustomer_bill: id,
            }
            const res = await deleteCustomer.onRequest(payload)
            console.log('res : ', res)
            if (res.success === 'success') {
                NoticeSuccess('ทำรายการสำเร็จ')
            }
        } catch (e) {
            console.error(e)
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        } finally {
            form.resetFields()
            setTrigger(!trigger)
        }
    }

    const handleChangePagination = (pagination: any) => {
        setCurrentPage(pagination.current)
    }

    return (
        <div>
            <StyledGlassBox>
                <WrapContent>
                    <Title>เพิ่มผู้จำหน่ายน้ำคาว</Title>
                    <StyledForm autoComplete='off' form={form} hideRequiredMark layout='vertical' onFinish={handleSubmit}>
                        <Row gutter={[16, 8]} style={{ width: '100%' }}>
                            <Col md={20} sm={24} xs={24}>
                                <StyledFormItems name='name' rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}>
                                    <Input placeholder='ชื่อผู้จำหน่าย' size='large' style={{ color: 'black', width: '100%' }} />
                                </StyledFormItems>
                            </Col>
                            <Col md={4} sm={24} xs={24}>
                                {' '}
                                <StyldeButtonSubmit htmlType='submit' size='middle' type='primary'>
                                    เพิ่มรายชื่อ
                                </StyldeButtonSubmit>
                            </Col>
                        </Row>
                    </StyledForm>
                </WrapContent>
            </StyledGlassBox>
            <br />
            <StyledGlassBox>
                <WrapContent>
                    <Title>เพิ่มผู้จำหน่ายน้ำคาว</Title>

                    <StyledTable
                        columns={columns}
                        dataSource={sourceData}
                        loading={getCustomerByBillTaskPagination.loading}
                        onChange={handleChangePagination}
                        pagination={{
                            total: totalList,
                            current: currentPage,
                            showSizeChanger: false,
                        }}
                    />
                </WrapContent>
            </StyledGlassBox>
        </div>
    )
}

CustomerFishyBill.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>
            <>{page}</>
        </AppLayout>
    )
}

export default CustomerFishyBill

const StyldeButtonSubmit = styled(Button)`
    height: 40px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 4px;
`

const StyledForm = styled(Form)`
    width: 100%;
    display: flex;
    justify-content: space-between;
`

const WrapContent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
`
const Title = styled.span`
    font-size: 20px;
    font-weight: 400;
`
const StyledGlassBox = styled.div`
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    padding: 20px 20px;
`

const StyledTable = styled(Table)`
    width: 100%;
    .ant-table-thead .ant-table-cell {
        color: #ffffff;
        font-weight: 400;
        background: #51459e;
    }
`
const StyledFormItems = styled(Form.Item)`
    width: 100%;
    .ant-form-item-label > label {
        font-size: 18px;
        font-weight: normal;
    }
`
