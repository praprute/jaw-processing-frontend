import { LeftOutlined } from '@ant-design/icons'
import { Layout, Row, Col, Form, Input, Select, Button, Table, Modal, InputNumber } from 'antd'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ColumnsType } from 'antd/lib/table'
import moment from 'moment'

import AppLayout from '../../../components/Layouts'
import ModalLoading from '../../../components/Modal/ModalLoading'
import { getReceiveFishWeightPaginationTask, insertLogBillOpenOrderTask } from '../../../share-module/FishWeightBill/task'
import { createOrderTask } from '../../../share-module/order/task'
import { NoticeError, NoticeSuccess } from '../../../utils/noticeStatus'
import { parseFloat2Decimals } from '../../../utils/parseFloat'
import { TypeOrderPuddle } from '../../../utils/type_puddle'
import { useNavigation } from '../../../utils/use-navigation'
import { NextPageWithLayout } from '../../_app'
import { numberWithCommas } from '../../../utils/format-number'
import { getPuddleDetailByIdTask } from '../../../share-module/building/task'

const { Content } = Layout

interface IFishWeightBill {
    idreceipt: number
    no: string
    weigh_net: number
    price_per_weigh: number
    amount_price: number
    vehicle_register: string
    customer_name: string
    product_name: string
    store_name: string
    description: string
    date_create: string
    order_connect: any
    stock: number
}

interface IDataLogStock {
    new_stock: number
    idreceipt: number
}

const CreateOrderPage: NextPageWithLayout = () => {
    const router = useRouter()
    const navigation = useNavigation()
    const [form] = Form.useForm()
    const [formAddOn] = Form.useForm()

    const { puddle_address, id } = router.query
    const [statusPuddleOrder, setStatusPuddleOrder] = useState(1)
    const [valuePrice, setValuePrice] = useState({
        fish: 0,
        fish_price: 0,
        salt_price: 0,
        laber_price: 0,
    })
    const [visible, setVisible] = useState(false)
    const [visibleModalAddOn, setVisibleModalAddOn] = useState(false)
    const [preDataAddFish, setPreDataAddFish] = useState<IFishWeightBill>(null)
    const [dataAddFish, setDataAddFish] = useState<IDataLogStock[]>([])

    const createOrder = createOrderTask.useTask()

    const [currentPage, setCurrentPage] = useState(1)
    const [sourceData, setSourceData] = useState([])
    const [totalList, setTotalList] = useState(0)
    const getReceiveFishWeight = getReceiveFishWeightPaginationTask.useTask()
    const getPuddleDetailById = getPuddleDetailByIdTask.useTask()
    const insertLogBillOpenOrder = insertLogBillOpenOrderTask.useTask()

    const OFFSET_PAGE = 10
    const MAX_ITEMS_PERCENTAGE = 100

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
            dataIndex: 'amount_price',
            key: 'amount_price',
            render: (amount_price: number) => <span>{numberWithCommas(amount_price)}</span>,
        },
        {
            title: 'stock คงเหลือ',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock: number) => <span>{numberWithCommas(stock)}</span>,
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
            title: '',
            dataIndex: 'idreceipt',
            key: 'idreceipt',
            render: (_: any, data: IFishWeightBill) => (
                <Button
                    onClick={() => {
                        setVisibleModalAddOn(true)
                        setPreDataAddFish(data)
                        formAddOn.setFieldsValue({
                            stock_old: numberWithCommas(data.stock),
                            price_per_kg: data.price_per_weigh,
                        })
                    }}
                    type='primary'
                >
                    เลือก
                </Button>
            ),
        },
    ]

    const TYPE_ORDER = [
        {
            value: TypeOrderPuddle.FERMENT,
            label: 'บ่อหมัก',
        },
        {
            value: TypeOrderPuddle.CIRCULAR,
            label: 'บ่อเวียน',
        },
        {
            value: TypeOrderPuddle.BREAK,
            label: 'บ่อพักใส',
        },
        {
            value: TypeOrderPuddle.MIXING,
            label: 'บ่อผสม',
        },
        {
            value: TypeOrderPuddle.FILTER,
            label: 'บ่อกรอง',
        },
        {
            value: TypeOrderPuddle.STOCK,
            label: 'บ่อพัก',
        },
    ]

    const summaryPricePerUnit = useMemo(() => {
        const valueForm = form.getFieldsValue(['fish', 'fish_price', 'salt_price', 'laber_price'])
        return (
            (Number(valueForm.fish_price) + Number(valueForm.salt_price) + Number(valueForm.laber_price)) / Number(valueForm.fish)
        )
    }, [valuePrice])

    useEffect(() => {
        form.setFieldsValue({ status_puddle_order: statusPuddleOrder })
    }, [])

    useEffect(() => {
        if (summaryPricePerUnit) {
            form.setFieldsValue({
                price_per_unit: summaryPricePerUnit,
            })
        }
    }, [summaryPricePerUnit])

    useEffect(() => {
        if (
            statusPuddleOrder === TypeOrderPuddle.CIRCULAR ||
            statusPuddleOrder === TypeOrderPuddle.FILTER ||
            statusPuddleOrder === TypeOrderPuddle.BREAK ||
            statusPuddleOrder === TypeOrderPuddle.MIXING ||
            statusPuddleOrder === TypeOrderPuddle.STOCK
        ) {
            form.setFieldsValue({
                fish: 0,
                fish_price: 0,
                salt: 0,
                salt_price: 0,
                laber: 0,
                laber_price: 0,
                price_per_unit: 0,
                description: handleDescriptionSetField(statusPuddleOrder),
            })
        } else {
            form.setFieldsValue({
                description: '',
            })
        }
    }, [statusPuddleOrder])

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

    const handleChangePagination = (pagination: any) => {
        setCurrentPage(pagination.current)
    }

    const handleDescriptionSetField = (typePuddle: number) => {
        if (typePuddle === TypeOrderPuddle.CIRCULAR) return 'บ่อเวียน'
        if (typePuddle === TypeOrderPuddle.FILTER) return 'บ่อกรอง'
        if (typePuddle === TypeOrderPuddle.BREAK) return 'บ่อพักใส'
        if (typePuddle === TypeOrderPuddle.MIXING) return 'บ่อผสม'
        if (typePuddle === TypeOrderPuddle.STOCK) return 'บ่อพัก'
    }

    const handleSubmit = async () => {
        try {
            setVisible(true)
            let payload = {
                order_name: '-',
                uuid_puddle: puddle_address as string,
                puddle_id: Number(id),
                status_puddle_order: statusPuddleOrder,
                fish: parseFloat2Decimals(form.getFieldValue('fish')),
                salt: parseFloat2Decimals(form.getFieldValue('salt')),
                laber: parseFloat2Decimals(form.getFieldValue('laber')),
                description: form.getFieldValue('description') ? form.getFieldValue('description') : '',
                volume: parseFloat2Decimals(form.getFieldValue('volume')),
                fish_price: parseFloat2Decimals(form.getFieldValue('fish_price')),
                salt_price: parseFloat2Decimals(form.getFieldValue('salt_price')),
                laber_price: parseFloat2Decimals(form.getFieldValue('laber_price')),
                amount_items: statusPuddleOrder === TypeOrderPuddle.FERMENT ? MAX_ITEMS_PERCENTAGE : 0,
            }

            const result = await createOrder.onRequest(payload)

            if (result === 'success') {
                const detailPuddle = await getPuddleDetailById.onRequest({ puddle_id: Number(id) })

                for (const data of dataAddFish) {
                    await insertLogBillOpenOrder.onRequest({
                        new_stock: data.new_stock,
                        idreceipt: data.idreceipt,
                        order_target: detailPuddle?.lasted_order,
                        id_puddle: Number(id),
                    })
                }
                NoticeSuccess('ทำรายการสำเร็จ')
                // const resUpdateLog = await Promise.all(
                //     dataAddFish.map(async (data) => {
                //         const resp = await insertLogBillOpenOrder.onRequest({
                //             new_stock: data.new_stock,
                //             idreceipt: data.idreceipt,
                //             order_target: detailPuddle?.lasted_order,
                //             id_puddle: Number(id),
                //         })
                //         return resp
                //     }),
                // )

                navigation.navigateTo.toBack()
            }
        } catch (err: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setVisible(false)
        }
    }

    const handleChangeTypeOrder = (value: number) => {
        form.setFieldsValue({ status_puddle_order: value })
        setStatusPuddleOrder(value)
    }

    const handleChangePrice = (name: string) => (event: { target: { value: string } }) => {
        setValuePrice({ ...valuePrice, [name]: Number(event.target.value) })
    }

    const handleChangeNewStockValue = (value: number) => {
        formAddOn.setFieldsValue({
            price_value: value * parseFloat2Decimals(formAddOn.getFieldValue('price_per_kg')),
        })
    }

    const handleSubmitPreStock = (value: any) => {
        let payload = [
            {
                new_stock: parseFloat2Decimals(value?.new_stock),
                idreceipt: Number(preDataAddFish?.idreceipt),
            },
        ]
        const defaultFishValue = parseFloat2Decimals(form.getFieldValue('fish'))
            ? parseFloat2Decimals(form.getFieldValue('fish'))
            : 0
        const defaultFishPriceValue = parseFloat2Decimals(form.getFieldValue('fish_price'))
            ? parseFloat2Decimals(form.getFieldValue('fish_price'))
            : 0
        form.setFieldsValue({
            fish: defaultFishValue + parseFloat2Decimals(value?.new_stock),
            fish_price: parseFloat2Decimals(value.price_value) + defaultFishPriceValue,
        })
        formAddOn.resetFields()
        setDataAddFish((prev) => [...prev, ...payload])
        setVisibleModalAddOn(false)
    }

    return (
        <MainLayout>
            <StyledBackPage
                onClick={() => {
                    navigation.navigateTo.toBack()
                }}
            >
                <LeftOutlined style={{ fontSize: 14, marginRight: 8 }} />
                ย้อนกลับ
            </StyledBackPage>
            <br />
            <StyledTitle>ลงทะเบียนรายการใหม่</StyledTitle>{' '}
            <StyledForm autoComplete='off' form={form} hideRequiredMark layout='vertical' onFinish={handleSubmit}>
                <StyedBoxContent>
                    <ContentForm>
                        <Row gutter={16}>
                            <Col span={12} xs={24}>
                                <StyledFormItems
                                    label='เลือกประเภทบ่อ'
                                    name='status_puddle_order'
                                    rules={[{ required: true, message: 'กรุณาเลือกประเภทบ่อ' }]}
                                >
                                    <Select
                                        defaultValue={statusPuddleOrder}
                                        onChange={handleChangeTypeOrder}
                                        options={TYPE_ORDER}
                                        size='large'
                                    />
                                </StyledFormItems>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={12} xs={24}>
                                <StyledFormItems
                                    label='จำนวนปลา'
                                    name='fish'
                                    rules={[{ required: true, message: 'กรุณาเลือกประเภทบ่อ' }]}
                                >
                                    <Input disabled placeholder='จำนวนปลา' size='large' style={{ color: 'black' }} />
                                </StyledFormItems>
                            </Col>
                            <Col md={12} span={12} xs={24}>
                                <StyledFormItems
                                    label='มูลค่าปลา'
                                    name='fish_price'
                                    rules={[{ required: true, message: 'กรุณาเลือกประเภทบ่อ' }]}
                                >
                                    <Input
                                        disabled
                                        onChange={handleChangePrice('fish_price')}
                                        placeholder='มูลค่าปลา'
                                        size='large'
                                        style={{ color: 'black' }}
                                    />
                                </StyledFormItems>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={12} xs={24}>
                                <StyledFormItems
                                    label='จำนวนเกลือ'
                                    name='salt'
                                    rules={[{ required: true, message: 'กรุณาเลือกประเภทบ่อ' }]}
                                >
                                    <Input placeholder='จำนวนเกลือ' size='large' style={{ color: 'black' }} />
                                </StyledFormItems>
                            </Col>
                            <Col md={12} span={12} xs={24}>
                                <StyledFormItems
                                    label='มูลค่าเกลือ'
                                    name='salt_price'
                                    rules={[{ required: true, message: 'กรุณาเลือกประเภทบ่อ' }]}
                                >
                                    <Input
                                        onChange={handleChangePrice('salt_price')}
                                        placeholder='มูลค่าเกลือ'
                                        size='large'
                                        style={{ color: 'black' }}
                                    />
                                </StyledFormItems>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col md={12} span={12} xs={24}>
                                <StyledFormItems
                                    label='คนงาน'
                                    name='laber'
                                    rules={[{ required: true, message: 'กรุณาเลือกประเภทบ่อ' }]}
                                >
                                    <Input placeholder='คนงาน' size='large' style={{ color: 'black' }} />
                                </StyledFormItems>
                            </Col>
                            <Col md={12} span={12} xs={24}>
                                <StyledFormItems
                                    label='ค่าเเรง'
                                    name='laber_price'
                                    rules={[{ required: true, message: 'กรุณาเลือกประเภทบ่อ' }]}
                                >
                                    <Input
                                        onChange={handleChangePrice('laber_price')}
                                        placeholder='ค่าเเรง'
                                        size='large'
                                        style={{ color: 'black' }}
                                    />
                                </StyledFormItems>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12} xs={24}>
                                {statusPuddleOrder === TypeOrderPuddle.FERMENT && (
                                    <StyledFormItems
                                        label='ปริมาตรตั้งต้น'
                                        name='volume'
                                        rules={[{ required: true, message: 'กรุณากรอกปริมาตรตั้งต้น' }]}
                                    >
                                        <Input placeholder='ปริมาตรตั้งต้น' size='large' style={{ color: 'black' }} />
                                    </StyledFormItems>
                                )}
                                {(statusPuddleOrder === TypeOrderPuddle.CIRCULAR ||
                                    statusPuddleOrder === TypeOrderPuddle.FILTER ||
                                    statusPuddleOrder === TypeOrderPuddle.BREAK ||
                                    statusPuddleOrder === TypeOrderPuddle.MIXING ||
                                    statusPuddleOrder === TypeOrderPuddle.STOCK) && (
                                    <StyledFormItems
                                        label='ความจุของบ่อนี้'
                                        name='volume'
                                        rules={[{ required: true, message: 'กรุณากรอกความจุของบ่อนี้' }]}
                                    >
                                        <Input placeholder='ความจุของบ่อนี้' size='large' style={{ color: 'black' }} />
                                    </StyledFormItems>
                                )}
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12} xs={24}>
                                <StyledFormItems
                                    label='ราคาต่อหน่วย'
                                    name='price_per_unit'
                                    rules={[{ required: true, message: 'กรุณาเลือกประเภทบ่อ' }]}
                                >
                                    <Input disabled placeholder='ราคาต่อหน่วย' size='large' style={{ color: 'black' }} />
                                </StyledFormItems>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12} xs={24}>
                                <StyledFormItems label='ลายละเอียด' name='description'>
                                    <Input placeholder='ลายละเอียด' size='large' style={{ color: 'black' }} />
                                </StyledFormItems>
                            </Col>
                        </Row>
                    </ContentForm>
                </StyedBoxContent>
                <br />
                <Row gutter={16}>
                    <Col span={12} xs={24}>
                        <StyledButtonSubmit htmlType='submit' size='large' type='primary'>
                            เปิดออเดอร์ใหม่
                        </StyledButtonSubmit>
                    </Col>
                </Row>{' '}
            </StyledForm>
            <br />
            <h3>รายการใบชั่งปลา</h3>
            <StyledTable
                columns={columns}
                dataSource={sourceData}
                loading={getReceiveFishWeight.loading}
                onChange={handleChangePagination}
                pagination={{
                    total: totalList,
                    current: currentPage,
                    showSizeChanger: false,
                }}
            />
            <ModalLoading
                onClose={() => {
                    setVisible(false)
                }}
                visible={visible}
            />
            <Modal
                centered
                footer={null}
                onCancel={() => {
                    setVisibleModalAddOn(false)
                }}
                open={visibleModalAddOn}
                title={`ใบชั่งหมายเลข : ${preDataAddFish?.no} `}
            >
                <StyledForm
                    autoComplete='off'
                    form={formAddOn}
                    hideRequiredMark
                    layout='vertical'
                    name='addON_salt_water'
                    onFinish={handleSubmitPreStock}
                >
                    <Row gutter={[16, 0]}>
                        <Col xs={24}>
                            <StyledFormItems label='stock ทีมีอยู่' name='stock_old'>
                                <Input disabled placeholder='stock ทีมีอยู่' size='large' style={{ color: 'black' }} />
                            </StyledFormItems>
                        </Col>
                        <Col xs={24}>
                            <StyledFormItems label='ราคา / กก.' name='price_per_kg'>
                                <Input disabled placeholder='ราคา / กก.' size='large' style={{ color: 'black' }} />
                            </StyledFormItems>
                        </Col>
                        <Col xs={24}>
                            <StyledFormItems
                                label='จำนวนที่นำไปใช้'
                                name='new_stock'
                                rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
                            >
                                <StyledInputNumber
                                    defaultValue={0}
                                    max={Number(preDataAddFish?.stock)}
                                    min={0}
                                    onChange={handleChangeNewStockValue}
                                    size='large'
                                />
                                {/* <Input
                                    onChange={handleChangeNewStockValue}
                                    placeholder='จำนวนที่นำไปใช้'
                                    size='large'
                                    style={{ color: 'black' }}
                                    onKeyPress={(event) => {
                                        if (!/^(?=.)([+-]?([0-9]*)(\.([0-9]+))?)$/.test(event.key)) {
                                            event.preventDefault()
                                        }
                                    }}
                                /> */}
                            </StyledFormItems>
                            {/* [+-]?([0-9]+([.][0-9]*)?|[.][0-9]+) */}
                        </Col>
                        <Col xs={24}>
                            <StyledFormItems
                                label='มูลค่าที่นำไปใช้'
                                name='price_value'
                                rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
                            >
                                <Input disabled placeholder='มูลค่าที่นำไปใช้' size='large' style={{ color: 'black' }} />
                            </StyledFormItems>
                        </Col>
                        <Col xs={24}>
                            <Button htmlType='submit' type='primary'>
                                ยืนยัน
                            </Button>
                        </Col>
                    </Row>
                </StyledForm>
            </Modal>
        </MainLayout>
    )
}

CreateOrderPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout hideSidebar isFullscreen>
            <>{page}</>
        </AppLayout>
    )
}

export default CreateOrderPage
const StyledInputNumber = styled(InputNumber)`
    width: 100%;
    .ant-input-number-handler-wrap {
        display: none;
    }
`
const StyledTable = styled(Table)`
    width: 100%;
    .ant-table-thead .ant-table-cell {
        font-weight: 400;
    }
`

const ContentForm = styled.div`
    width: 100%;
`

const StyledBackPage = styled.span`
    cursor: pointer;
    width: fit-content;
`
const StyledButtonSubmit = styled(Button)`
    width: 100%;
`
const StyledFormItems = styled(Form.Item)`
    .ant-form-item-label > label {
        font-size: 18px;
        font-weight: normal;
    }
`
const StyledForm = styled(Form)`
    width: 100%;
`
const MainLayout = styled(Content)`
    width: 100%;
    max-width: 990px;
    padding: 24px 0px;
    display: flex;
    flex-direction: column;
`
const StyledTitle = styled.span`
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 12px;
`
const StyedBoxContent = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5.3px);
    -webkit-backdrop-filter: blur(5.3px);
    width: 100%;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
`
