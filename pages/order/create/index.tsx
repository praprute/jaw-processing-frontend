import { LeftOutlined } from '@ant-design/icons'
import { Layout, Row, Col, Form, Input, Select, Button, Table, Modal, InputNumber, Checkbox, Tabs, DatePicker, Space } from 'antd'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ColumnsType } from 'antd/lib/table'
import moment from 'moment'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import type { DatePickerProps } from 'antd'

import AppLayout from '../../../components/Layouts'
import ModalLoading from '../../../components/Modal/ModalLoading'
import {
    // getReceiveFishWeightPaginationTask,
    // getReceiveFishWeightPaginationWithOutEmptyTask,
    // getReceiveSolidSaltPaginationTask,
    getReceiveSolidSaltPaginationWithOutEmptyTask,
    insertLogBillOpenOrderTask,
    insertLogSolidSaltBillOpenOrderTask,
    searchReceiveFishWeightPaginationWithOutEmptyTask,
    searchReceiveSolidSaltPaginationWithOutEmptyTask,
} from '../../../share-module/FishWeightBill/task'
import {
    createOrderTask,
    getAllFeeLaborFermentTask,
    getFeeLaborPerBuildingByBuildingTask,
} from '../../../share-module/order/task'
import { NoticeError, NoticeSuccess } from '../../../utils/noticeStatus'
import { parseFloat2Decimals } from '../../../utils/parseFloat'
import { TypeOrderPuddle } from '../../../utils/type_puddle'
import { useNavigation } from '../../../utils/use-navigation'
import { NextPageWithLayout } from '../../_app'
import { numberWithCommas } from '../../../utils/format-number'
import { getPuddleDetailByIdTask } from '../../../share-module/building/task'
import { ISolidSaltBillDto } from '../../../share-module/FishWeightBill/type'

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
    no?: string
    price_per_weigh?: string
    stock?: string
    new_stock: number
    idreceipt: number
}

const CreateOrderPage: NextPageWithLayout = () => {
    const router = useRouter()
    const navigation = useNavigation()
    const [form] = Form.useForm()
    const [formAddOn] = Form.useForm()
    const [formAddOnSolidSalt] = Form.useForm()

    const { puddle_address, id, building } = router.query
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

    console.log('dataAddFish : ', dataAddFish)

    const [visibleModalAddOnSolidSalt, setVisibleModalAddOnSolidSalt] = useState(false)
    const [preDataAddFishSolidSalt, setPreDataAddFishSolidSalt] = useState<ISolidSaltBillDto>(null)
    const [dataAddSolidSalt, setDataAddSolidSalt] = useState<IDataLogStock[]>([])

    const [costLaborPerBuilding, setCostLaborPerBuilding] = useState(0)
    const [costLaborFerment, setCostLaborFerment] = useState(0)

    const [checkedCostLaborBuilding, setCheckedLaborBuilding] = useState(false)
    const [checkedCostLaborFerment, setCheckedCostLaborFerment] = useState(false)
    const [checkedCostLaborFree, setCheckedCostLaborFree] = useState(false)
    const [dateStart, setDateStart] = useState(null)

    const createOrder = createOrderTask.useTask()

    const [currentPage, setCurrentPage] = useState(1)
    const [sourceData, setSourceData] = useState([])
    const [totalList, setTotalList] = useState(0)

    const [currentPageSolidSalt, setCurrentPageSolidSalt] = useState(1)
    const [sourceDataSolidSalt, setSourceDataSolidSalt] = useState([])
    const [totalListSolidSalt, setTotalListSolidSalt] = useState(0)
    const [searchFishBill, setSearchFishBill] = useState(null)
    const [searchSaltBill, setSearchSaltBill] = useState(null)

    // const [solidSaltStockOld, setSolidSaltStockOld] = useState(0)

    // const getReceiveFishWeight = getReceiveFishWeightPaginationWithOutEmptyTask.useTask()
    const getPuddleDetailById = getPuddleDetailByIdTask.useTask()
    const insertLogBillOpenOrder = insertLogBillOpenOrderTask.useTask()
    const getFeeLaborPerBuildingByBuilding = getFeeLaborPerBuildingByBuildingTask.useTask()
    const getAllFeeLaborFerment = getAllFeeLaborFermentTask.useTask()
    const getReceiveSolidSaltPagination = getReceiveSolidSaltPaginationWithOutEmptyTask.useTask()
    const insertLogSolidSaltBillOpenOrder = insertLogSolidSaltBillOpenOrderTask.useTask()
    const searchReceiveFishWeightPaginationWithOutEmpty = searchReceiveFishWeightPaginationWithOutEmptyTask.useTask()
    const searchReceiveSolidSaltPaginationWithOutEmpty = searchReceiveSolidSaltPaginationWithOutEmptyTask.useTask()
    const OFFSET_PAGE = 10
    const MAX_ITEMS_PERCENTAGE = 100

    console.log('searchReceiveFishWeightPaginationWithOutEmpty : ', searchReceiveFishWeightPaginationWithOutEmpty.data)
    const columns: ColumnsType<any> = [
        {
            title: 'ลำดับที่',
            dataIndex: 'no',
            key: 'no',
        },
        {
            title: 'วันที่ตามบิล',
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
                            no: data.no,
                        })
                        // setSolidSaltStockOld(data.stock)
                    }}
                    type='primary'
                >
                    เลือก
                </Button>
            ),
        },
    ]

    const columnsSolidSalt: ColumnsType<any> = [
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
        {
            title: '',
            dataIndex: 'idsolid_salt_receipt',
            key: 'idsolid_salt_receipt',
            render: (_: any, data: ISolidSaltBillDto) => (
                <Button
                    onClick={() => {
                        setVisibleModalAddOnSolidSalt(true)
                        setPreDataAddFishSolidSalt(data)
                        formAddOnSolidSalt.setFieldsValue({
                            stock_old: numberWithCommas(data.stock),
                            price_per_kg: data.price_per_weigh,
                            no: data.no,
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
            value: TypeOrderPuddle.FREE,
            label: 'บ่อว่าง',
        },
        {
            value: TypeOrderPuddle.FAIL,
            label: 'บ่อชำรุด',
        },
        // {
        //     value: TypeOrderPuddle.CIRCULAR,
        //     label: 'บ่อเวียน',
        // },
        // {
        //     value: TypeOrderPuddle.BREAK,
        //     label: 'บ่อพักใส',
        // },
        // {
        //     value: TypeOrderPuddle.MIXING,
        //     label: 'บ่อผสม',
        // },
        // {
        //     value: TypeOrderPuddle.FILTER,
        //     label: 'บ่อกรอง',
        // },
        // {
        //     value: TypeOrderPuddle.STOCK,
        //     label: 'บ่อพัก',
        // },
        // {
        //     value: TypeOrderPuddle.REPELLENT,
        //     label: 'บ่อไล่น้ำสอง',
        // },
        // {
        //     value: TypeOrderPuddle.HITMARK,
        //     label: 'บ่อตีกาก',
        // },
    ]

    const summaryPricePerUnit = useMemo(() => {
        const valueForm = form.getFieldsValue(['fish', 'fish_price', 'salt_price', 'laber_price'])
        return (
            (Number(valueForm.fish_price) + Number(valueForm.salt_price) + Number(valueForm.laber_price)) / Number(valueForm.fish)
        )
    }, [valuePrice, form.getFieldValue('fish_price'), form.getFieldValue('salt_price'), form.getFieldValue('laber_price')])

    useEffect(() => {
        form.setFieldsValue({ status_puddle_order: statusPuddleOrder, laber_price: 0, laber: 1, fish: 0 })
    }, [])

    useEffect(() => {
        if (summaryPricePerUnit) {
            form.setFieldsValue({
                price_per_unit: summaryPricePerUnit,
            })
        }
    }, [summaryPricePerUnit])

    useEffect(() => {
        if (statusPuddleOrder !== TypeOrderPuddle.FERMENT) {
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
            await handleGetListReceiveSolidSalt()
        })()
    }, [currentPage, currentPageSolidSalt])

    useEffect(() => {
        if (building) {
            ;(async () => {
                const res = await getFeeLaborPerBuildingByBuilding.onRequest({ id_building: Number(building) })
                const costFerment = await getAllFeeLaborFerment.onRequest()
                setCostLaborPerBuilding(res.price)
                setCostLaborFerment(costFerment.price)
            })()
        }
    }, [building])

    const handleGetListReceive = async () => {
        try {
            const res = await searchReceiveFishWeightPaginationWithOutEmpty.onRequest({
                page: currentPage - 1,
                offset: OFFSET_PAGE,
                search: searchFishBill,
            })
            setSourceData(res.data)
            setTotalList(res.total)
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        }
    }

    const handleGetListReceiveSolidSalt = async () => {
        try {
            const res = await searchReceiveSolidSaltPaginationWithOutEmpty.onRequest({
                page: currentPageSolidSalt - 1,
                offset: OFFSET_PAGE,
                search: searchSaltBill,
            })
            setSourceDataSolidSalt(res.data)
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
                start_date: dateStart,
                type_process: form.getFieldValue('status_puddle_order') === 0 ? 13 : 0,
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

                for (const data of dataAddSolidSalt) {
                    await insertLogSolidSaltBillOpenOrder.onRequest({
                        new_stock: data.new_stock,
                        idreceipt: data.idreceipt,
                        order_target: detailPuddle?.lasted_order,
                        id_puddle: Number(id),
                    })
                }

                NoticeSuccess('ทำรายการสำเร็จ')

                navigation.navigateTo.toBack()

                form.resetFields()
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
    const handleChangeNewStockSolidSaltValue = (value: number) => {
        formAddOnSolidSalt.setFieldsValue({
            price_value: value * parseFloat2Decimals(formAddOnSolidSalt.getFieldValue('price_per_kg')),
        })
    }

    const handleDeleteFishBill = (index?: string) => {
        setDataAddFish((prev) => prev.filter((word) => word.no !== index))
    }
    const handleDeleteSaltBill = (index?: string) => {
        setDataAddSolidSalt((prev) => prev.filter((word) => word.no !== index))
    }

    useEffect(() => {
        if (!!dataAddFish) {
            let f = 0
            let fp = 0
            dataAddFish.map((data) => {
                f = f + data.new_stock
                fp = fp + data.new_stock * Number(data?.price_per_weigh)
            })
            form.setFieldsValue({
                fish: f,
                fish_price: fp,
            })
        }
    }, [dataAddFish])

    useEffect(() => {
        if (!!dataAddSolidSalt) {
            let f = 0
            let fp = 0
            dataAddSolidSalt.map((data) => {
                f = f + data.new_stock
                fp = fp + data.new_stock * Number(data?.price_per_weigh)
            })
            form.setFieldsValue({
                salt: f,
                salt_price: fp,
            })
        }
    }, [dataAddSolidSalt])

    const handleSubmitPreStock = (value: any) => {
        let payload = [
            {
                no: formAddOn.getFieldValue('no'),
                price_per_weigh: value?.price_per_kg,
                stock: value?.stock_old,
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

    const handleSubmitPreStockSolidSalt = (value: any) => {
        let payload = [
            {
                no: formAddOnSolidSalt.getFieldValue('no'),
                price_per_weigh: value?.price_per_kg,
                stock: value?.stock_old,
                new_stock: parseFloat2Decimals(value?.new_stock),
                idreceipt: Number(preDataAddFishSolidSalt?.idsolid_salt_receipt),
            },
        ]
        const defaultFishValue = parseFloat2Decimals(form.getFieldValue('salt'))
            ? parseFloat2Decimals(form.getFieldValue('salt'))
            : 0
        const defaultSolidSaltValue = parseFloat2Decimals(form.getFieldValue('salt_price'))
            ? parseFloat2Decimals(form.getFieldValue('salt_price'))
            : 0
        form.setFieldsValue({
            salt: defaultFishValue + parseFloat2Decimals(value?.new_stock),
            salt_price: parseFloat2Decimals(value.price_value) + defaultSolidSaltValue,
        })
        formAddOnSolidSalt.resetFields()
        setDataAddSolidSalt((prev) => [...prev, ...payload])
        setVisibleModalAddOnSolidSalt(false)
    }

    const onChangeCostLaborPerBuilding = (e: CheckboxChangeEvent) => {
        if (e.target.checked === true) {
            form.setFieldsValue({
                laber_price: form.getFieldValue('laber_price') + costLaborPerBuilding,
            })
            setCheckedCostLaborFree(false)
        } else {
            form.setFieldsValue({
                laber_price: form.getFieldValue('laber_price') - costLaborPerBuilding,
            })
        }

        setCheckedLaborBuilding(e.target.checked)
    }
    const onChangeCostLaborFerment = (e: CheckboxChangeEvent) => {
        if (e.target.checked === true) {
            form.setFieldsValue({
                laber_price: form.getFieldValue('laber_price') + costLaborFerment * form.getFieldValue('fish'),
            })
            setCheckedCostLaborFree(false)
        } else {
            form.setFieldsValue({
                laber_price: form.getFieldValue('laber_price') - costLaborFerment * form.getFieldValue('fish'),
            })
        }
        setCheckedCostLaborFerment(e.target.checked)
    }

    const onChangeCostLaborFree = (e: CheckboxChangeEvent) => {
        if (e.target.checked === true) {
            form.setFieldsValue({
                laber_price: 0,
            })
            setCheckedLaborBuilding(false)
            setCheckedCostLaborFerment(false)
        }
        setCheckedCostLaborFree(e.target.checked)
    }

    const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
        setDateStart(dateString)
    }

    const handleChangeSearchFish = async (e: any) => {
        try {
            if (!!e.target.value.toString()) {
                setSearchFishBill(e.target.value.toString())
                const res = await searchReceiveFishWeightPaginationWithOutEmpty.onRequest({
                    page: currentPage - 1,
                    offset: OFFSET_PAGE,
                    search: e.target.value.toString(),
                })
                setSourceData(res.data)
                setTotalList(res.total)
            } else {
                setSearchFishBill(null)
                await handleGetListReceive()
            }
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        }
    }
    const handleChangeSearchSalt = async (e: any) => {
        try {
            if (!!e.target.value.toString()) {
                setSearchSaltBill(e.target.value.toString())
                const res = await searchReceiveSolidSaltPaginationWithOutEmpty.onRequest({
                    page: 0,
                    offset: OFFSET_PAGE,
                    search: e.target.value.toString(),
                })
                setSourceDataSolidSalt(res.data)
                setTotalListSolidSalt(res.total)
            } else {
                setSearchSaltBill(null)
                await handleGetListReceiveSolidSalt()
            }
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        }
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
                                    <Input disabled placeholder='จำนวนเกลือ' size='large' style={{ color: 'black' }} />
                                </StyledFormItems>
                            </Col>
                            <Col md={12} span={12} xs={24}>
                                <StyledFormItems
                                    label='มูลค่าเกลือ'
                                    name='salt_price'
                                    rules={[{ required: true, message: 'กรุณาเลือกประเภทบ่อ' }]}
                                >
                                    <Input
                                        disabled
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
                                    <Input disabled placeholder='คนงาน' size='large' style={{ color: 'black' }} />
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
                            <Col md={24} span={24} xs={24}>
                                <h3>บิลปลาที่ใช้</h3>
                                {dataAddFish.map((data, index) => (
                                    <React.Fragment key={index}>
                                        <table
                                            style={{
                                                width: '100%',
                                            }}
                                        >
                                            <tr>
                                                <td style={{ width: '24px' }}>{index + 1}</td>
                                                <td style={{ textAlign: 'left' }}> เลขบิล : {data?.no} </td>
                                                <td style={{ textAlign: 'left' }}>ราคาต่อหน่วย : {data?.price_per_weigh}</td>
                                                <td style={{ textAlign: 'left' }}>stock เดิม : {data?.stock}</td>
                                                <td style={{ textAlign: 'left' }}>ใช้ไป : {data?.new_stock}</td>
                                                <td style={{ textAlign: 'left' }}>
                                                    <p
                                                        onClick={() => {
                                                            handleDeleteFishBill(data?.no)
                                                        }}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        ลบ
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </React.Fragment>
                                ))}
                            </Col>
                        </Row>
                        <br />
                        <Row gutter={16}>
                            <Col md={24} span={24} xs={24}>
                                <h3>บิลเกลือที่ใช้</h3>
                                {dataAddSolidSalt.map((data, index) => (
                                    <React.Fragment key={index}>
                                        <table
                                            style={{
                                                width: '100%',
                                            }}
                                        >
                                            <tr>
                                                <td style={{ width: '24px' }}>{index + 1}</td>
                                                <td style={{ textAlign: 'left' }}> เลขบิล : {data?.no} </td>
                                                <td style={{ textAlign: 'left' }}>ราคาต่อหน่วย : {data?.price_per_weigh}</td>
                                                <td style={{ textAlign: 'left' }}>stock เดิม : {data?.stock}</td>
                                                <td style={{ textAlign: 'left' }}>ใช้ไป : {data?.new_stock}</td>
                                                <td style={{ textAlign: 'left' }}>
                                                    <p
                                                        onClick={() => {
                                                            handleDeleteSaltBill(data?.no)
                                                        }}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        ลบ
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </React.Fragment>
                                ))}
                            </Col>
                        </Row>
                        <br />
                        {/* dataAddFish */}
                        <Row gutter={16}>
                            <Col md={8} span={8} xs={24}>
                                <StyledFormItems>
                                    <Checkbox checked={checkedCostLaborBuilding} onChange={onChangeCostLaborPerBuilding}>
                                        ค่าเเรงคนงานต่ออาคาร {costLaborPerBuilding} บาท
                                    </Checkbox>
                                </StyledFormItems>
                            </Col>
                            <Col md={8} span={8} xs={24}>
                                <StyledFormItems>
                                    <Checkbox checked={checkedCostLaborFerment} onChange={onChangeCostLaborFerment}>
                                        ค่าเเรงลงปลา {costLaborFerment} บาท ต่อ ปลา 1 กิโล
                                    </Checkbox>
                                </StyledFormItems>
                            </Col>
                            <Col md={8} span={8} xs={24}>
                                <StyledFormItems>
                                    <Checkbox checked={checkedCostLaborFree} onChange={onChangeCostLaborFree}>
                                        ไม่มีค่าเเรง
                                    </Checkbox>
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
                                {statusPuddleOrder !== TypeOrderPuddle.FERMENT && (
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
                                    rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
                                >
                                    <Input disabled placeholder='ราคาต่อหน่วย' size='large' style={{ color: 'black' }} />
                                </StyledFormItems>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12} xs={24}>
                                <StyledFormItems
                                    label='วันที่ทำรายการ'
                                    name='start_date'
                                    rules={[{ required: true, message: 'กรุณาเลือกวันที่ทำรายการ' }]}
                                >
                                    <DatePicker onChange={onChangeDate} style={{ width: '100%' }} />
                                    {/* <Input disabled placeholder='ราคาต่อหน่วย' size='large' style={{ color: 'black' }} /> */}
                                </StyledFormItems>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12} xs={24}>
                                <StyledFormItems
                                    label='ราคาต่อหน่วย'
                                    name='price_per_unit'
                                    rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
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
            <Tabs
                defaultActiveKey='1'
                items={[
                    {
                        label: 'รายการใบชั่งปลา',
                        key: '1',
                        children: (
                            <>
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input onChange={handleChangeSearchFish} />
                                    <Button type='primary'>Submit</Button>
                                </Space.Compact>{' '}
                                <StyledTable
                                    columns={columns}
                                    dataSource={sourceData}
                                    loading={searchReceiveFishWeightPaginationWithOutEmpty.loading}
                                    onChange={handleChangePagination}
                                    pagination={{
                                        total: totalList,
                                        current: currentPage,
                                        showSizeChanger: false,
                                    }}
                                />
                            </>
                        ),
                    },
                    {
                        label: 'รายการบิลเกลือ',
                        key: '2',
                        children: (
                            <>
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input onChange={handleChangeSearchSalt} />
                                    <Button type='primary'>Submit</Button>
                                </Space.Compact>{' '}
                                <StyledTable
                                    columns={columnsSolidSalt}
                                    dataSource={sourceDataSolidSalt}
                                    loading={getReceiveSolidSaltPagination.loading}
                                    onChange={handleChangePaginationSolidSalt}
                                    pagination={{
                                        total: totalListSolidSalt,
                                        current: currentPageSolidSalt,
                                        showSizeChanger: false,
                                    }}
                                />
                            </>
                        ),
                    },
                ]}
                type='card'
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
                    formAddOn.resetFields()
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
                        {/* <Col xs={24}>
                            <StyledFormItems label='เลขบิล' name='no'>
                                <Input disabled placeholder='stock ทีมีอยู่' size='large' style={{ color: 'black' }} />
                            </StyledFormItems>
                        </Col> */}

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
                                rules={[
                                    { required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
                                    // ({ getFieldValue }) => ({
                                    //     validator(_, value) {
                                    //         if (value > solidSaltStockOld) {
                                    //             console.log('getFieldValue :', value, solidSaltStockOld)
                                    //             return Promise.reject(new Error('Over maximum'))
                                    //         }
                                    //         return Promise.resolve()
                                    //     },
                                    // }),
                                ]}
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
            <Modal
                centered
                footer={null}
                onCancel={() => {
                    setVisibleModalAddOnSolidSalt(false)
                    formAddOnSolidSalt.resetFields()
                }}
                open={visibleModalAddOnSolidSalt}
                title={`ใบชั่งหมายเลข : ${preDataAddFishSolidSalt?.no} `}
            >
                <StyledForm
                    autoComplete='off'
                    form={formAddOnSolidSalt}
                    hideRequiredMark
                    layout='vertical'
                    name='addON_solid_salt'
                    onFinish={handleSubmitPreStockSolidSalt}
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
                                    max={Number(preDataAddFishSolidSalt?.stock)}
                                    min={0}
                                    onChange={handleChangeNewStockSolidSaltValue}
                                    size='large'
                                />
                            </StyledFormItems>
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
