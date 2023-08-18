import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import {
    Alert,
    Breadcrumb,
    Button,
    Divider,
    Drawer,
    Empty,
    Form,
    Input,
    Modal,
    Space,
    Spin,
    Select,
    Row,
    Col,
    Steps,
    DatePicker,
    InputNumber,
} from 'antd'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { LabeledValue } from 'antd/lib/select'
import axios from 'axios'
import Table, { ColumnsType } from 'antd/lib/table'
import moment from 'moment'
import { CheckOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { DatePickerProps } from 'antd'

import AppLayout from '../../../../components/Layouts'
import { NextPageWithLayout } from '../../../_app'
import { useNavigation } from '../../../../utils/use-navigation'
import {
    changeWorkingStatusPuddleTask,
    getAllBuildingTask,
    getPuddleByIdBuildingTask,
    getPuddleDetailByIdTask,
    updateDateStartFermantTask,
    updateStatusTopSaltTask,
} from '../../../../share-module/building/task'
import BadgeStatus from '../../../../components/BadgeStatus'
import {
    getOrdersDetailFromIdTask,
    getAllOrdersFromPuddleIdTask,
    submitTransferTask,
    getNoticeTargetPendingTask,
    submitGetInFishSaurceTask,
    deleteTransactionGetInTask,
    updateProcessDescritionSubOrderTask,
    submitCloseProcessTask,
    submitAddOnSaltWaterTask,
    submitAddOnFishSauceTask,
    submitTransferSaltWaterTask,
    getWorkingStatusTypeTask,
    updateChemOrderTask,
} from '../../../../share-module/order/task'
import TableHistoryOrders from '../../../../components/Table/TableHistoryOrders'
import OrderLastedSection from '../../../../components/OrderLasted'
import TransferFishsauce from '../../../../components/FormTransfer/TransferFishsauce'
import { NoticeError, NoticeSuccess } from '../../../../utils/noticeStatus'
import { parseFloat2Decimals } from '../../../../utils/parseFloat'
import ModalLoading from '../../../../components/Modal/ModalLoading'
import { TypeOrderPuddle, TypeProcess } from '../../../../utils/type_puddle'
import GetInFishsauce from '../../../../components/FormTransfer/GetInFishsauce'
import ModalConfirm from '../../../../components/Modal/ModalConfirm'
import { configAPI } from '../../../../share-module/configApi'
import { getTypeProcessTask, submitTypeProcessTask } from '../../../../share-module/puddle/task'
import {
    getLogReceiveSaltByOrdersIdTask,
    // getReceiveFishSaucePaginationTask,
    getReceiveFishSaucePaginationWithOutEmptyTask,
    // getReceiveSaltPaginationTask,
    getReceiveSaltPaginationWithOutEmptyTask,
    getReceiveWeightFishByOrderIdTask,
} from '../../../../share-module/FishWeightBill/task'
import { numberWithCommas } from '../../../../utils/format-number'

const { Option } = Select

interface ISelectSaltBillDto {
    idsalt_receipt: number
    no: string
    product_name: string
    weigh_net: number
    price_per_weigh: number
    price_net: number
    customer: string
    stock: number
    date_create: string
}
interface ISelectFishSauceBillDto {
    idfishsauce_receipt: number
    no: string
    product_name: string
    weigh_net: number
    price_per_weigh: number
    price_net: number
    customer: string
    stock: number
    date_create: string
}

const DetailPuddlePage: NextPageWithLayout = () => {
    const router = useRouter()
    const navigation = useNavigation()
    const { building_id, puddle_id } = router.query
    const [form] = Form.useForm()
    const [formGetIn] = Form.useForm()
    const [formAddOn] = Form.useForm()
    const [formAddOnFishSauce] = Form.useForm()

    const [open, setOpen] = useState(false)
    const [openGetIN, setOpenGetIn] = useState(false)
    const [openThrowOtherPuddle, setOpenThrowOtherPuddle] = useState(false)
    const [openThrowOut, setOpenThrowOut] = useState(false)
    const [orderDetailLasted, setOrderDetailLasted] = useState(null)
    const [amountItemsKG, setAmountItemsKG] = useState(0)

    const [amountItemsPercent, setAmountItemsPercent] = useState(0)
    const [remainingItems, setRemainingItems] = useState(0)
    const [lastedPrice, setLastedPrice] = useState(0)
    const [lastedPerUnit, setLastedPerUnit] = useState(0)
    const [tragetPuddle, setTragetPuddle] = useState([])
    const [modalLoadingVisivble, setModalLoadingVisivble] = useState(false)
    const [trigger, setTrigger] = useState(false)
    const [volumnPuddle, setVolumnPuddle] = useState(0)
    const [visibleModalProcess, setVisibleModalProcess] = useState(false)
    const [visibleModalDescProcess, setVisibleModalDescProcess] = useState(false)
    const [idSubOrdersTarget, setIdSubOrdersTarget] = useState(null)
    const [selectedIdProcess, setSelectedIdProcess] = useState(null)
    const [visibleModalAddOn, setVisibleModalAddOn] = useState(false)
    const [visibleModalAddOnFishSauce, setVisibleModalAddOnFishSauce] = useState(false)
    const [saltWaterKG, setSaltWaterKG] = useState(0)
    const [fishSauceWaterKG, setFishSauceWaterKG] = useState(0)
    const [visibleModalBillFerment, setVisibleModalBillFerment] = useState(false)
    const [idOrdersOpenWeightBill, setIdOrdersOpenWeightBill] = useState(null)
    const [preDataSaltBill, setPreDataSaltBill] = useState<ISelectSaltBillDto>(null)
    const [preDataFishSauceBill, setPreDataFishSauceBill] = useState<ISelectFishSauceBillDto>(null)
    const [visibleModalViewSaltBill, setVisibleModalViewSaltBill] = useState(false)
    // const [visibleModalViewFishSauceBill, setVisibleModalViewFishSauceBill] = useState(false)
    const [idOrdersOpenSaltBill, setIdOrdersOpenSaltBill] = useState(null)
    // const [idOrdersOpenFishSauceBill, setIdOrdersOpenFishSauceBill] = useState(null)

    const [titleDrawerTransfer, setTitleDrawerTransfer] = useState('ปล่อยน้ำปลา')

    //  0 = น้ำปลา , 1 = น้ำเกลือ
    const [itemsTransfer, setItemsTransfer] = useState(0)
    //  0 = น้ำปลา , 1 = น้ำเกลือ
    const [itemsGetIn, setItemsGetIn] = useState(0)

    const [visibleModalWorkingStatus, setVisibleModalWorkingStatus] = useState(false)
    const [visibleModalConfirmTopSalt, setVisibleModalConfirmTopSalt] = useState(false)
    // TODO
    // const [actionPuddle, setActionPuddle] = useState(null)
    const [visibleEditChem, setVisibleEditChem] = useState(false)
    const [selectedChem, setSelectedChem] = useState(null)

    const [remainingVolumnGetIn, setRemainingVolumnGetIn] = useState(0)
    const [remainingVolumnExport, setRemainingVolumnExport] = useState(0)

    const [visibleModalCancelGetIn, setVisibleModalCancelGetIn] = useState(false)
    const [stateDelete, setStateDelete] = useState({
        id_sub_order: null,
        idtarget_puddle: null,
    })
    const [typeProcessImport, setTypeProcessImport] = useState(TypeProcess.IMPORT)
    const [valueTypeProcess, setValueTypeProcess] = useState(null)
    const [valueChem, setValueChem] = useState(null)
    const [currentStepSalt, setCurrentStepSalt] = useState(0)
    const [currentStepFishSauce, setCurrentStepFishSauce] = useState(0)
    const [currentPageSalt, setCurrentPageSalt] = useState(1)
    const [currentPageFishSauce, setCurrentPageFishSauce] = useState(1)
    const [sourceDataSalt, setSourceDataSalt] = useState([])
    const [sourceDataFishSauce, setSourceDataFishSauce] = useState([])
    const [totalListSalt, setTotalListSalt] = useState(0)
    const [totalListFishSauce, setTotalListFishSauce] = useState(0)
    const [dateStart, setDateStart] = useState(null)
    const [visibleModalDateStart, setVisibleModalDateStart] = useState(false)
    const [dateTransfer, setDateTransfer] = useState(null)
    const [lastedOrderId, setLastedOrderId] = useState(null)
    const [chemDisplay, setChemDisplay] = useState({
        ph: 0,
        nacl: 0,
        tn: 0,
    })

    const getPuddleDetailById = getPuddleDetailByIdTask.useTask()
    const getAllOrdersFromPuddleId = getAllOrdersFromPuddleIdTask.useTask()
    const getOrdersDetailFromId = getOrdersDetailFromIdTask.useTask()
    const getPuddleByIdBuilding = getPuddleByIdBuildingTask.useTask()
    const submitTransfer = submitTransferTask.useTask()
    const getNoticeTargetPending = getNoticeTargetPendingTask.useTask()
    const submitGetInFishSaurce = submitGetInFishSaurceTask.useTask()
    const deleteTransactionGetIn = deleteTransactionGetInTask.useTask()
    const getAllBuildings = getAllBuildingTask.useTask()
    const getTypeProcess = getTypeProcessTask.useTask()
    const submitTypeProcess = submitTypeProcessTask.useTask()
    const updateProcessDescritionSubOrder = updateProcessDescritionSubOrderTask.useTask()
    const submitCloseProcess = submitCloseProcessTask.useTask()
    const submitAddOnSaltWater = submitAddOnSaltWaterTask.useTask()
    const getReceiveWeightFishByOrderId = getReceiveWeightFishByOrderIdTask.useTask()
    const getReceiveSaltPagination = getReceiveSaltPaginationWithOutEmptyTask.useTask()
    const getReceiveFishSaucePagination = getReceiveFishSaucePaginationWithOutEmptyTask.useTask()
    const getLogReceiveSaltByOrdersId = getLogReceiveSaltByOrdersIdTask.useTask()
    // const getLogReceiveFishSauceByOrdersId = getLogReceiveFishSauceByOrdersIdTask.useTask()
    const submitAddOnFishSauce = submitAddOnFishSauceTask.useTask()
    const submitTransferSaltWater = submitTransferSaltWaterTask.useTask()
    const getListWorkingStatus = getWorkingStatusTypeTask.useTask()
    const changeWorkingStatusPuddle = changeWorkingStatusPuddleTask.useTask()
    const updateStatusTopSalt = updateStatusTopSaltTask.useTask()
    const updateDateStartFermant = updateDateStartFermantTask.useTask()
    const updateChemOrder = updateChemOrderTask.useTask()

    const OFFSET_PAGE = 10

    const columnsSalt: ColumnsType<any> = [
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
            dataIndex: 'idsalt_receipt',
            key: 'idsalt_receipt',
            render: (_: any, data: ISelectSaltBillDto) => (
                <Button
                    onClick={() => {
                        setPreDataSaltBill(data)
                        next()
                    }}
                    type='primary'
                >
                    เลือก
                </Button>
            ),
        },
    ]

    const columnsFishSauce: ColumnsType<any> = [
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
            dataIndex: 'idsalt_receipt',
            key: 'idsalt_receipt',
            render: (_: any, data: ISelectFishSauceBillDto) => (
                <Button
                    onClick={() => {
                        setPreDataFishSauceBill(data)
                        nextStepFishSauce()
                    }}
                    type='primary'
                >
                    เลือก
                </Button>
            ),
        },
    ]

    useEffect(() => {
        ;(async () => {
            await handleGetListReceive()
        })()
    }, [currentPageSalt])

    useEffect(() => {
        ;(async () => {
            await handleGetListFishSauceReceive()
        })()
    }, [currentPageFishSauce])

    const handleGetListReceive = async () => {
        try {
            const res = await getReceiveSaltPagination.onRequest({ page: currentPageSalt - 1, offset: OFFSET_PAGE })
            setSourceDataSalt(res.data)
            setTotalListSalt(res.total)
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        }
    }
    const handleGetListFishSauceReceive = async () => {
        try {
            const res = await getReceiveFishSaucePagination.onRequest({ page: currentPageFishSauce - 1, offset: OFFSET_PAGE })
            setSourceDataFishSauce(res.data)
            setTotalListFishSauce(res.total)
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        }
    }

    const handleChangePagination = (pagination: any) => {
        setCurrentPageSalt(pagination.current)
    }
    const handleChangePaginationFishSauce = (pagination: any) => {
        setCurrentPageFishSauce(pagination.current)
    }

    // setCurrentPageFishSauce

    useEffect(() => {
        if (building_id && puddle_id) {
            ;(async () => {
                const res = await getPuddleByIdBuilding.onRequest({ building_id: Number(form.getFieldValue('id_building')) })
                const fillterPuddle = res.filter((data) => data.idpuddle !== Number(puddle_id))
                setTragetPuddle(fillterPuddle)
            })()
        }
    }, [building_id, puddle_id, trigger])

    useEffect(() => {
        ;(async () => {
            await getAllBuildings.onRequest()
            await getTypeProcess.onRequest()
            await getListWorkingStatus.onRequest()
        })()
    }, [])

    useEffect(() => {
        if (getOrdersDetailFromId?.data) {
            setOrderDetailLasted(getOrdersDetailFromId?.data[getOrdersDetailFromId?.data?.length - 1])
        }
    }, [getOrdersDetailFromId?.data, trigger])

    useEffect(() => {
        if (lastedOrderId && getAllOrdersFromPuddleId.data) {
            const found = getAllOrdersFromPuddleId.data.find((element) => element.idorders === lastedOrderId)

            setChemDisplay({
                ph: found.ph || 0,
                nacl: found.nacl || 0,
                tn: found.tn || 0,
            })
        }
    }, [lastedOrderId, trigger, getAllOrdersFromPuddleId.data])

    useEffect(() => {
        ;(async () => {
            if (puddle_id) {
                await getNoticeTargetPending.onRequest({ puddle_id: Number(puddle_id) })
                const res = await getPuddleDetailById.onRequest({ puddle_id: Number(puddle_id) })

                await getAllOrdersFromPuddleId.onRequest({ puddle_id: Number(puddle_id) })
                const resOrderDetail = await getOrdersDetailFromId.onRequest({ order_id: res.lasted_order })

                setLastedOrderId(res.lasted_order)
                setRemainingItems(
                    resOrderDetail?.length === 1
                        ? resOrderDetail[resOrderDetail?.length - 1]?.amount_items
                        : resOrderDetail[resOrderDetail?.length - 1]?.remaining_items,
                )

                setLastedPrice(
                    resOrderDetail?.length === 1
                        ? resOrderDetail[resOrderDetail?.length - 1]?.amount_price
                        : resOrderDetail[resOrderDetail?.length - 1]?.remaining_price,
                )
                setLastedPerUnit(
                    resOrderDetail?.length === 1
                        ? resOrderDetail[resOrderDetail?.length - 1]?.amount_unit_per_price
                        : resOrderDetail[resOrderDetail?.length - 1]?.remaining_unit_per_price,
                )
                setVolumnPuddle(resOrderDetail[0]?.volume)

                form.setFieldsValue({
                    volume_start: resOrderDetail[resOrderDetail?.length - 1]?.volume,
                    amount_unit_per_price:
                        resOrderDetail?.length === 1
                            ? resOrderDetail[resOrderDetail?.length - 1]?.amount_unit_per_price
                            : resOrderDetail[resOrderDetail?.length - 1]?.remaining_unit_per_price,
                    remaining_unit_per_price:
                        resOrderDetail?.length === 1
                            ? resOrderDetail[resOrderDetail?.length - 1]?.amount_unit_per_price
                            : resOrderDetail[resOrderDetail?.length - 1]?.remaining_unit_per_price,
                    remaining_volume: resOrderDetail[resOrderDetail?.length - 1]?.remaining_volume,
                })
                formGetIn.setFieldsValue({
                    remaining_volume: resOrderDetail[resOrderDetail?.length - 1]?.remaining_volume,
                })
                setRemainingVolumnExport(resOrderDetail[resOrderDetail?.length - 1]?.remaining_volume)
                setRemainingVolumnGetIn(resOrderDetail[resOrderDetail?.length - 1]?.remaining_volume)
            }
        })()
    }, [puddle_id, trigger])

    useMemo(() => {
        form.setFieldsValue({
            amount_price: parseFloat2Decimals((amountItemsKG * lastedPerUnit).toString()),
            remaining_price: lastedPrice - parseFloat2Decimals((amountItemsKG * lastedPerUnit).toString()),
        })
    }, [lastedPrice, lastedPerUnit, amountItemsPercent, trigger, amountItemsKG])

    const handleChangeBuilding = async (value: number) => {
        const res = await getPuddleByIdBuilding.onRequest({ building_id: Number(value) })
        const fillterPuddle = res.filter((data) => data.idpuddle !== Number(puddle_id))
        setTragetPuddle(fillterPuddle)
    }

    const handleChangeAmountItems = (e: React.ChangeEvent<HTMLInputElement>) => {
        let volumn = remainingVolumnExport
        console.log(orderDetailLasted.remaining_volume, Number(e.target.value))
        setAmountItemsKG(Number(e.target.value) * 1.2)
        setAmountItemsPercent(parseFloat2Decimals(((Number(e.target.value) * remainingItems * 1.2) / volumn).toFixed(2)))

        form.setFieldsValue({
            amount_items: parseFloat2Decimals(((Number(e.target.value) * remainingItems * 1.2) / volumn).toFixed(2)),
            remaining_items:
                remainingItems - parseFloat2Decimals(((Number(e.target.value) * remainingItems * 1.2) / volumn).toFixed(2)),
            remaining_volume: remainingVolumnExport - Number(e.target.value) * 1.2,
        })

        // if (Number(e.target.value) * 1.2 > orderDetailLasted.remaining_volume) {
        //     setAmountItemsKG(orderDetailLasted.remaining_volume * 1.2)
        //     setAmountItemsPercent(parseFloat2Decimals(((orderDetailLasted.remaining_volume * remainingItems * 1.2 ) / volumn).toFixed(2)))

        //     form.setFieldsValue({
        //         volume: orderDetailLasted.remaining_volume,
        //         amount_items: parseFloat2Decimals(
        //             ((orderDetailLasted.remaining_volume* remainingItems ) / orderDetailLasted.remaining_volume).toFixed(2),
        //         ),
        //         remaining_items:
        //             remainingItems -
        //             parseFloat2Decimals(
        //                 ((orderDetailLasted.remaining_volume * remainingItems ) / orderDetailLasted.remaining_volume).toFixed(2),
        //             ),
        //         remaining_volume: remainingVolumnExport - orderDetailLasted.remaining_volume,
        //     })
        // } else {
        //     setAmountItemsKG(Number(e.target.value) * 1.2)
        //     setAmountItemsPercent(parseFloat2Decimals(((Number(e.target.value) * remainingItems * 1.2) / volumn).toFixed(2)))

        //     form.setFieldsValue({
        //         amount_items: parseFloat2Decimals(((Number(e.target.value) * remainingItems * 1.2) / volumn).toFixed(2)),
        //         remaining_items:
        //             remainingItems - parseFloat2Decimals(((Number(e.target.value) * remainingItems * 1.2) / volumn).toFixed(2)),
        //         remaining_volume: remainingVolumnExport - Number(e.target.value) * 1.2,
        //     })
        // }
    }

    const handleChangeLitToKGSaltWater = (e: number) => {
        // setSaltWaterKG(Number(e.target.value) * 1.2)
        setSaltWaterKG(Number(e))
    }
    //  React.ChangeEvent<HTMLInputElement>
    const handleChangeLitToKGFishSauceWater = (e: number) => {
        // setFishSauceWaterKG(Number(e.target.value) * 1.2)
        setFishSauceWaterKG(Number(e))
    }

    const handleSubmitTypeProcessTask = async () => {
        try {
            if (valueTypeProcess === null || valueTypeProcess === '') {
                return
            } else {
                await submitTypeProcess.onRequest({ process_name: valueTypeProcess })
                await getTypeProcess.onRequest()
                NoticeSuccess('ทำรายการสำเร็จ')
                setValueTypeProcess(null)
            }
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
            setValueTypeProcess(null)
        } finally {
            setValueTypeProcess(null)
            setVisibleModalProcess(false)
        }
    }

    const showDrawer = () => {
        setOpen(true)
    }

    const onClose = () => {
        setOpen(false)
    }

    const showDrawerGetIn = () => {
        setOpenGetIn(true)
    }

    const onCloseGetIn = () => {
        setOpenGetIn(false)
    }

    const handleSelectOrdersGetIN = async (id_selected: number) => {
        const result = getNoticeTargetPending.data.find((data) => id_selected === data.idtarget_puddle)
        if (result.type === TypeProcess.CLEARING) {
            setTypeProcessImport(TypeProcess.GETFISHRESIDUE)
        } else {
            setTypeProcessImport(TypeProcess.IMPORT)
        }
        let amount_item_cal =
            getPuddleDetailById.data?.status !== TypeOrderPuddle.FERMENT
                ? getOrdersDetailFromId.data.length === 1
                    ? (result.volume * 100) / volumnPuddle
                    : (result.volume * 100) / volumnPuddle //(result.volume * 100) / remainingVolumnGetIn
                : (result.volume * remainingItems) / remainingVolumnGetIn ///result.amount_price / result.amount_unit_per_price

        // getPuddleDetailById.data?.status === TypeOrderPuddle.CIRCULAR ||
        // getPuddleDetailById.data?.status === TypeOrderPuddle.FILTER ||
        // getPuddleDetailById.data?.status === TypeOrderPuddle.BREAK ||
        // getPuddleDetailById.data?.status === TypeOrderPuddle.MIXING ||
        // getPuddleDetailById.data?.status === TypeOrderPuddle.STOCK

        // TODO
        // let check =
        //     getPuddleDetailById.data?.status === TypeOrderPuddle.CIRCULAR ||
        //     getPuddleDetailById.data?.status === TypeOrderPuddle.FILTER ||
        //     getPuddleDetailById.data?.status === TypeOrderPuddle.BREAK ||
        //     getPuddleDetailById.data?.status === TypeOrderPuddle.MIXING
        //         ? getOrdersDetailFromId.data.length === 1
        //             ? (result.volume * 100) / volumnPuddle
        //             : (result.volume * 100) / volumnPuddle
        //         : (result.volume * remainingItems) / remainingVolumnGetIn

        formGetIn.setFieldsValue({
            order_id: result.idOrders,
            volume: result.volume,
            amount_items: amount_item_cal,
            amount_price: result.amount_price,
            remaining_items: remainingItems + amount_item_cal,
            remaining_price: lastedPrice + result.amount_price,
            idtarget_puddle: result.idtarget_puddle,
            lasted_subId: result.id_sub_order,
            remaining_volume:
                getOrdersDetailFromId.data[getOrdersDetailFromId.data?.length - 1]?.remaining_volume + result.volume,
            source_puddle: result?.source_puddle,
            action_serial_puddle: result?.source_serial_puddle,
        })

        showDrawerGetIn()
    }

    const getSerial = async (id: number) => {
        try {
            const config = await configAPI()
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/getSerialPuddle/${id}`, config)

            return Number(data.message[0].serial)
        } catch (e: any) {
            return 0
        }
    }

    const handleSelectPuddle = async (labelValue: LabeledValue) => {
        try {
            const res = await getSerial(Number(labelValue))
            form.setFieldsValue({ action_puddle: res })
        } catch (e: any) {
            return '0'
        }
    }

    const submitImportFishSaurce = async () => {
        try {
            setModalLoadingVisivble(true)
            const payload = {
                order_id: getPuddleDetailById?.data?.lasted_order,
                type_process: itemsGetIn === 0 ? typeProcessImport : TypeProcess.IMPORTSALTWATER,
                amount_items: formGetIn.getFieldValue('amount_items'),
                amount_price: formGetIn.getFieldValue('amount_price'),
                remaining_items: formGetIn.getFieldValue('remaining_items'),
                remaining_price: formGetIn.getFieldValue('remaining_price'),
                idtarget_puddle: formGetIn.getFieldValue('idtarget_puddle'),
                lasted_subId: formGetIn.getFieldValue('lasted_subId'),
                volume: Number(formGetIn.getFieldValue('volume')),
                remaining_volume: Number(formGetIn.getFieldValue('remaining_volume')),
                action_puddle: Number(formGetIn.getFieldValue('source_puddle')),
                action_serial_puddle: Number(formGetIn.getFieldValue('action_serial_puddle')),
                date_action: dateTransfer,
                id_puddle: Number(puddle_id),
            }

            const result = await submitGetInFishSaurce.onRequest(payload)
            if (result.success === 'success') {
                NoticeSuccess('ทำรายการสำเร็จ')
                onCloseGetIn()
                setTrigger(!trigger)
            }
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setModalLoadingVisivble(false)
            formGetIn.resetFields()
        }
    }

    const handleSubmitColseProcess = async () => {
        try {
            setModalLoadingVisivble(true)

            const payload = {
                order_id: getPuddleDetailById?.data?.lasted_order,
                type_process: TypeProcess.CLEARINGALL,
                amount_items: remainingItems,
                amount_unit_per_price: lastedPerUnit,
                amount_price: lastedPrice,
                remaining_items: 0,
                remaining_unit_per_price: 0,
                remaining_price: 0,
                approved: 1,
                volume: remainingVolumnExport,
                remaining_volume: 0,
                date_action: dateTransfer,
                id_puddle: Number(puddle_id),
            }

            const result = await submitCloseProcess.onRequest(payload)
            if (result === 'success') {
                NoticeSuccess('ทำรายการสำเร็จ')
                setTrigger(!trigger)
                setOpenThrowOut(false)
            }
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setModalLoadingVisivble(false)
            setDateTransfer(null)
        }
    }

    const handleSubmitAddOn = async (values: any) => {
        try {
            setModalLoadingVisivble(true)

            let amount_item_cal =
                getOrdersDetailFromId.data.length === 1
                    ? (saltWaterKG * 100) / volumnPuddle
                    : (saltWaterKG * remainingItems) / remainingVolumnGetIn
            let price_net = Number(values.volume) * preDataSaltBill.price_per_weigh
            const payload = {
                order_id: getPuddleDetailById?.data?.lasted_order,
                type_process: TypeProcess.ADDONWATERSALT,
                amount_items: amount_item_cal,
                amount_unit_per_price: price_net / saltWaterKG,
                amount_price: price_net,
                remaining_items: remainingItems + amount_item_cal,
                remaining_unit_per_price:
                    (lastedPrice + price_net) /
                    (getOrdersDetailFromId.data[getOrdersDetailFromId.data?.length - 1]?.remaining_volume + saltWaterKG),
                remaining_price: lastedPrice + price_net,
                volume: saltWaterKG,
                remaining_volume:
                    getOrdersDetailFromId.data[getOrdersDetailFromId.data?.length - 1]?.remaining_volume + saltWaterKG,
                process: 7,
                new_stock: Number(values.volume),
                idreceipt: preDataSaltBill.idsalt_receipt,
                id_puddle: Number(puddle_id),
                date_action: dateTransfer,
            }

            const res = await submitAddOnSaltWater.onRequest(payload)
            if (res.success === 'success') {
                formAddOn.resetFields()
                NoticeSuccess(`ทำรายการสำเร็จ`)
                setTrigger(!trigger)
            }
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        } finally {
            setModalLoadingVisivble(false)
            setVisibleModalAddOn(false)
            await handleGetListReceive()
            setCurrentStepSalt(0)
            setDateTransfer(null)
            formAddOn.resetFields()
        }
    }

    const handleSubmitAddOnFishSauce = async (values: any) => {
        try {
            setModalLoadingVisivble(true)

            let amount_item_cal =
                getOrdersDetailFromId.data.length === 1
                    ? (fishSauceWaterKG * 100) / volumnPuddle
                    : (fishSauceWaterKG * remainingItems) / remainingVolumnGetIn
            let price_net = Number(values.volume) * preDataFishSauceBill.price_per_weigh
            const payload = {
                order_id: getPuddleDetailById?.data?.lasted_order,
                type_process: TypeProcess.ADDONFISHSAUCE,
                amount_items: amount_item_cal,
                amount_unit_per_price: price_net / fishSauceWaterKG,
                amount_price: price_net,
                remaining_items: remainingItems + amount_item_cal,
                remaining_unit_per_price:
                    (lastedPrice + price_net) /
                    (getOrdersDetailFromId.data[getOrdersDetailFromId.data?.length - 1]?.remaining_volume + fishSauceWaterKG),
                remaining_price: lastedPrice + price_net,
                volume: fishSauceWaterKG,
                remaining_volume:
                    getOrdersDetailFromId.data[getOrdersDetailFromId.data?.length - 1]?.remaining_volume + fishSauceWaterKG,
                process: 7,
                new_stock: Number(values.volume),
                idreceipt: preDataFishSauceBill.idfishsauce_receipt,
                id_puddle: Number(puddle_id),
                date_action: dateTransfer,
            }

            const res = await submitAddOnFishSauce.onRequest(payload)
            if (res.success === 'success') {
                formAddOn.resetFields()
                NoticeSuccess(`ทำรายการสำเร็จ`)
                setTrigger(!trigger)
            }
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        } finally {
            setModalLoadingVisivble(false)
            setVisibleModalAddOn(false)
            setVisibleModalAddOnFishSauce(false)
            await handleGetListReceive()
            await handleGetListFishSauceReceive()
            setCurrentStepSalt(0)
            setDateTransfer(null)
            formAddOnFishSauce.resetFields()
            setCurrentStepFishSauce(0)
        }
    }

    const submitThrowFish = async () => {
        try {
            setModalLoadingVisivble(true)
            const payload = {
                order_id: getPuddleDetailById?.data?.lasted_order,
                type_process: TypeProcess.CLEARING,
                amount_items: form.getFieldValue('amount_items'),
                amount_unit_per_price: form.getFieldValue('amount_unit_per_price'),
                amount_price: form.getFieldValue('amount_price'),
                remaining_items: form.getFieldValue('remaining_items'),
                remaining_unit_per_price: form.getFieldValue('remaining_unit_per_price'),
                remaining_price: form.getFieldValue('remaining_price'),
                approved: 0,
                volume: amountItemsKG, //Number(form.getFieldValue('volume')),
                id_puddle: Number(puddle_id),
                remaining_volume: Number(form.getFieldValue('remaining_volume')),
                action_puddle: await getSerial(Number(puddle_id)),
                target_puddle: Number(form.getFieldValue('id_puddle')),
                serial_puddle: Number(form.getFieldValue('action_puddle')),
                process: form.getFieldValue('process') as number,
                date_action: dateTransfer,
            }

            const result = await submitTransfer.onRequest(payload)
            if (result === 'success') {
                NoticeSuccess('ทำรายการสำเร็จ')
                form.resetFields()
                setTrigger(!trigger)
                setOpenThrowOtherPuddle(false)
            }
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setModalLoadingVisivble(false)
            setDateTransfer(null)
        }
    }

    const handleSubmitTransfer = async () => {
        try {
            setModalLoadingVisivble(true)

            if (itemsTransfer === 0) {
                const payload = {
                    order_id: getPuddleDetailById?.data?.lasted_order,
                    type_process: TypeProcess.TRANSFER,
                    amount_items: form.getFieldValue('amount_items'),
                    amount_unit_per_price: form.getFieldValue('amount_unit_per_price'),
                    amount_price: form.getFieldValue('amount_price'),
                    remaining_items: form.getFieldValue('remaining_items'),
                    remaining_unit_per_price: form.getFieldValue('remaining_unit_per_price'),
                    remaining_price: form.getFieldValue('remaining_price'),
                    approved: 0,
                    volume: amountItemsKG, //Number(form.getFieldValue('volume')),
                    id_puddle: Number(puddle_id),
                    remaining_volume: Number(form.getFieldValue('remaining_volume')),
                    action_puddle: await getSerial(Number(puddle_id)),
                    target_puddle: Number(form.getFieldValue('id_puddle')),
                    serial_puddle: Number(form.getFieldValue('action_puddle')),
                    date_action: dateTransfer,
                }

                const payloads = form.getFieldValue('process')
                    ? { ...payload, process: form.getFieldValue('process') as number }
                    : { ...payload }

                const result = await submitTransfer.onRequest(payloads)
                if (result === 'success') {
                    NoticeSuccess('ทำรายการสำเร็จ')
                    form.resetFields()
                    setTrigger(!trigger)
                    onClose()
                }
            } else {
                const payload = {
                    order_id: getPuddleDetailById?.data?.lasted_order,
                    type_process: TypeProcess.TRANSFERSALTWATER,
                    amount_items: form.getFieldValue('amount_items'),
                    amount_unit_per_price: form.getFieldValue('amount_unit_per_price'),
                    amount_price: form.getFieldValue('amount_price'),
                    remaining_items: form.getFieldValue('remaining_items'),
                    remaining_unit_per_price: form.getFieldValue('remaining_unit_per_price'),
                    remaining_price: form.getFieldValue('remaining_price'),
                    approved: 0,
                    volume: amountItemsKG, //Number(form.getFieldValue('volume')),
                    id_puddle: Number(puddle_id),
                    remaining_volume: Number(form.getFieldValue('remaining_volume')),
                    action_puddle: await getSerial(Number(puddle_id)),
                    target_puddle: Number(form.getFieldValue('id_puddle')),
                    serial_puddle: Number(form.getFieldValue('action_puddle')),
                    item_transfer: itemsTransfer,
                    date_action: dateTransfer,
                }

                const payloads = form.getFieldValue('process')
                    ? { ...payload, process: form.getFieldValue('process') as number }
                    : { ...payload }

                const result = await submitTransferSaltWater.onRequest(payloads)
                if (result === 'success') {
                    NoticeSuccess('ทำรายการสำเร็จ')
                    form.resetFields()
                    setTrigger(!trigger)
                    onClose()
                }
            }
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setDateTransfer(null)
            setModalLoadingVisivble(false)
            form.resetFields()
        }
    }

    const handleDeleteGetIn = async () => {
        try {
            setModalLoadingVisivble(true)
            const result = await deleteTransactionGetIn.onRequest(stateDelete)
            if (result.success === 'success') {
                NoticeSuccess('ทำรายการสำเร็จ')
            }
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setModalLoadingVisivble(false)
            await getNoticeTargetPending.onRequest({ puddle_id: Number(puddle_id) })
        }
    }

    const handleSelectSubOrder = (e: number) => {
        setIdSubOrdersTarget(e)
        setVisibleModalDescProcess(true)
    }
    const handleUpdateDescProcess = async () => {
        try {
            if (selectedIdProcess === null || idSubOrdersTarget === null) {
                return
            }
            const payload = { process: selectedIdProcess, subOrderId: idSubOrdersTarget }
            const res = await updateProcessDescritionSubOrder.onRequest(payload)
            if (res.success === 'success') {
                NoticeSuccess('ทำรายการสำเร็จ')
                setTrigger(!trigger)
            }
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setVisibleModalDescProcess(false)
            setIdSubOrdersTarget(null)
        }
    }

    const handleViewFishWeightBill = async (e: number) => {
        setIdOrdersOpenWeightBill(e)
        setVisibleModalBillFerment(true)
        try {
            await getReceiveWeightFishByOrderId.onRequest({ order_id: e })
        } catch (e) {
            NoticeError('ทำรายการไม่สำเร็จ')
        }
    }

    const handleViewSaltBill = async (e: number) => {
        setIdOrdersOpenSaltBill(e)
        setVisibleModalViewSaltBill(true)
        try {
            await getLogReceiveSaltByOrdersId.onRequest({ order_id: e })
        } catch (e) {
            NoticeError('ทำรายการไม่สำเร็จ')
        }
    }

    const handleChangeWorkingStatus = async (id: number) => {
        try {
            const res = await changeWorkingStatusPuddle.onRequest({ puddle_id: Number(puddle_id), working_status: id })

            if (res === 'UPDATE_SUCCESS') {
                NoticeSuccess('ทำรายการสำเร็จ')
            }
        } catch (e) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setVisibleModalWorkingStatus(false)
            setTrigger(!trigger)
        }
    }

    const handleUpdateTopSalt = async () => {
        try {
            const res = await updateStatusTopSalt.onRequest({ idpuddle: Number(puddle_id), topSalt: 1 })
            if (res === 'UPDATE_SUCCESS') {
                NoticeSuccess('ทำรายการสำเร็จ')
            }
        } catch (e) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setVisibleModalConfirmTopSalt(false)
            setTrigger(!trigger)
        }
    }

    const handleUpdateDateStart = async () => {
        try {
            const res = await updateDateStartFermant.onRequest({ idpuddle: Number(puddle_id), start_date: dateStart })
            if (res === 'UPDATE_SUCCESS') {
                NoticeSuccess('ทำรายการสำเร็จ')
            }
        } catch (e) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setVisibleModalDateStart(false)
            setTrigger(!trigger)
            setDateStart(null)
        }
    }

    // updateDateStartFermantTask

    // const handleViewFishSauceBill = async (e: number) => {
    //     setIdOrdersOpenFishSauceBill(e)
    //     setVisibleModalViewFishSauceBill(true)
    //     try {
    //         await getLogReceiveFishSauceByOrdersId.onRequest({ order_id: e })
    //     } catch (e) {
    //         NoticeError('ทำรายการไม่สำเร็จ')
    //     }
    // }

    const next = () => {
        setCurrentStepSalt(currentStepSalt + 1)
    }

    const prev = () => {
        setCurrentStepSalt(currentStepSalt - 1)
    }

    const nextStepFishSauce = () => {
        setCurrentStepFishSauce(currentStepFishSauce + 1)
    }

    const prevFishSauce = () => {
        setCurrentStepFishSauce(currentStepFishSauce - 1)
    }

    const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
        setDateStart(dateString)
    }

    const onChangeDateTransfer: DatePickerProps['onChange'] = (date, dateString) => {
        setDateTransfer(dateString)
    }

    const handleChangeChem = async () => {
        try {
            let chem = null
            switch (selectedChem) {
                case 'PH':
                    chem = 'ph'
                    break
                case 'SALT':
                    chem = 'nacl'
                    break
                case 'TN':
                    chem = 'tn'
                    break
                default:
                    chem = null
                    break
            }
            const payload = {
                chem: chem,
                value: Number(valueChem),
                idorders: getPuddleDetailById?.data?.lasted_order,
            }

            const res = await updateChemOrder.onRequest(payload)
            if (res === 'UPDATE_SUCCESS') {
                NoticeSuccess('ทำรายการสำเร็จ')
            }
        } catch (e) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setVisibleEditChem(false)
            setTrigger(!trigger)
            setDateStart(null)
        }
    }

    const stepsSalt = [
        {
            title: 'เลือกบิลเกลือ',
            content: (
                <StyledTable
                    columns={columnsSalt}
                    dataSource={sourceDataSalt}
                    loading={getReceiveSaltPagination.loading}
                    onChange={handleChangePagination}
                    pagination={{
                        total: totalListSalt,
                        current: currentPageSalt,
                        showSizeChanger: false,
                    }}
                />
            ),
        },
        {
            title: 'กรอกปริมาตรที่ใช้',
            content: (
                <>
                    <Row gutter={[16, 0]} style={{ width: '100%' }}>
                        <Col xs={24}>
                            <StyledFormItems
                                // extra={`~ ${saltWaterKG} KG.`}
                                label='ปริมาตรน้ำเกลือที่เติมเพิ่ม (KG.)'
                                name='volume'
                                rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
                            >
                                {/* <Input
                                    onChange={handleChangeLitToKGSaltWater}
                                    placeholder='ปริมาตรน้ำเกลือที่เติมเพิ่ม'
                                    size='large'
                                    style={{ color: 'black' }}
                                /> */}

                                {Number(preDataSaltBill?.stock) && (
                                    <StyledInputNumber
                                        max={Number(preDataSaltBill.stock)}
                                        min={0}
                                        onChange={handleChangeLitToKGSaltWater}
                                        size='large'
                                    />
                                )}
                            </StyledFormItems>
                            <Col xs={24}>
                                <StyledFormItems
                                    label='วันที่ทำรายการ'
                                    name='date_action'
                                    rules={[{ required: true, message: 'กรุณาระบุวันที่ทำรายการ' }]}
                                >
                                    <DatePicker onChange={onChangeDateTransfer} style={{ width: '100%' }} />
                                </StyledFormItems>
                            </Col>
                        </Col>
                    </Row>
                </>
            ),
        },
    ]

    const stepsFishSauce = [
        {
            title: 'เลือกบิลน้ำปลา',
            content: (
                <StyledTable
                    columns={columnsFishSauce}
                    dataSource={sourceDataFishSauce}
                    loading={getReceiveFishSaucePagination.loading}
                    onChange={handleChangePaginationFishSauce}
                    pagination={{
                        total: totalListFishSauce,
                        current: currentPageFishSauce,
                        showSizeChanger: false,
                    }}
                />
            ),
        },
        {
            title: 'กรอกปริมาตรที่ใช้',
            content: (
                <>
                    <Row gutter={[16, 0]} style={{ width: '100%' }}>
                        <Col xs={24}>
                            <StyledFormItems
                                label='ปริมาตรน้ำปลาที่เติมเพิ่ม (KG.)'
                                name='volume'
                                rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
                            >
                                {/* <Input
                                    onChange={handleChangeLitToKGFishSauceWater}
                                    placeholder='ปริมาตรน้ำปลาที่เติมเพิ่ม'
                                    size='large'
                                    style={{ color: 'black' }}
                                /> */}

                                {Number(preDataFishSauceBill?.stock) && (
                                    <StyledInputNumber
                                        max={Number(preDataFishSauceBill.stock)}
                                        min={0}
                                        onChange={handleChangeLitToKGFishSauceWater}
                                        size='large'
                                    />
                                )}
                            </StyledFormItems>
                        </Col>
                        <Col xs={24}>
                            <StyledFormItems
                                label='วันที่ทำรายการ'
                                name='date_action'
                                rules={[{ required: true, message: 'กรุณาระบุวันที่ทำรายการ' }]}
                            >
                                <DatePicker onChange={onChangeDateTransfer} style={{ width: '100%' }} />
                            </StyledFormItems>
                        </Col>
                    </Row>
                </>
            ),
        },
    ]

    const itemsStepsSalt = stepsSalt.map((item) => ({ key: item.title, title: item.title }))
    const itemsStepsFishSauce = stepsFishSauce.map((item) => ({ key: item.title, title: item.title }))

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
                <StyledBreadcrumbItem
                    onClick={() => {
                        navigation.navigateTo.allPuddle(building_id as string)
                    }}
                >
                    รหัสอาคาร {building_id}
                </StyledBreadcrumbItem>
                <StyledBreadcrumbItem>รหัสบ่อ {getPuddleDetailById?.data?.serial}</StyledBreadcrumbItem>
            </Breadcrumb>
            <StyledBoxHeader>
                <StyledTitleBoxHeader>
                    <span>
                        บ่อหมายเลข {getPuddleDetailById?.data?.serial} : {getPuddleDetailById.data?.uuid_puddle}
                    </span>
                    <div style={{ marginBottom: '4px' }}>
                        <BadgeStatus status={getPuddleDetailById.data?.status} />
                    </div>
                </StyledTitleBoxHeader>

                <StyledButton
                    onClick={() => {
                        navigation.navigateTo.createOrder(
                            getPuddleDetailById.data?.uuid_puddle as string,
                            puddle_id as string,
                            building_id as string,
                        )
                    }}
                    type='primary'
                >
                    ลงทะเบียน order
                </StyledButton>
            </StyledBoxHeader>
            <br />

            {Boolean(getNoticeTargetPending.data?.length) &&
                getNoticeTargetPending.data.map((data, index) => (
                    <React.Fragment key={index}>
                        <StyledAlert
                            action={
                                <>
                                    <Space direction='vertical'>
                                        <StyledButtonAction
                                            onClick={() => {
                                                handleSelectOrdersGetIN(data.idtarget_puddle)
                                                data.item_transfer === 0 ? setItemsGetIn(0) : null
                                                data.item_transfer === 1 ? setItemsGetIn(1) : null
                                            }}
                                            size='small'
                                            type='primary'
                                        >
                                            ยืนยัน
                                        </StyledButtonAction>
                                    </Space>
                                    <Space direction='vertical'>
                                        <StyledButtonAction
                                            onClick={() => {
                                                setVisibleModalCancelGetIn(true)
                                                setStateDelete({
                                                    id_sub_order: Number(data.id_sub_order),
                                                    idtarget_puddle: Number(data.idtarget_puddle),
                                                })
                                            }}
                                            size='small'
                                            style={{ backgroundColor: '#E23C39', borderColor: '#E23C39' }}
                                            type='primary'
                                        >
                                            ยกเลิก
                                        </StyledButtonAction>
                                    </Space>
                                </>
                            }
                            closable
                            description={`นำเข้า${data.item_transfer === 0 ? 'น้ำปลา' : 'น้ำเกลือ'}ปริมาตร ${data.volume} kg. ~ ${
                                data.volume / 1.2
                            } L. จากบ่อหมายเลข ${data?.source_serial_puddle}`}
                            message={`รายการนำเข้าหมายเลข ${data.idtarget_puddle}`}
                            type='info'
                        />
                    </React.Fragment>
                ))}

            <StyledBoxContent>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '8px' }}>
                    <span>รายการล่าสุด</span>
                    <StyledButton
                        onClick={() => {
                            setVisibleModalWorkingStatus(true)
                        }}
                    >
                        working status{' '}
                        {getPuddleDetailById?.data?.working_status_title
                            ? `: ${getPuddleDetailById.data.working_status_title}`
                            : ''}
                    </StyledButton>
                    <StyledButton
                        disabled={!!getPuddleDetailById?.data?.start_date}
                        onClick={() => {
                            setVisibleModalDateStart(true)
                        }}
                    >
                        {!!getPuddleDetailById?.data?.start_date
                            ? `วันที่เริ่มหมัก : ${dayjs(getPuddleDetailById.data.start_date).format('DD/MM/YYYY')}`
                            : 'ตั้งวันที่เริ่มหมัก'}
                    </StyledButton>

                    <span>
                        สถานะการกลบเกลือของบ่อ :{' '}
                        {getPuddleDetailById?.data?.topSalt === 1 ? 'กลบเกลือเเล้ว' : 'ยังไม่ได้กลบเกลือ'}
                    </span>
                    <RowChem>
                        <BoxChem
                            onClick={() => {
                                setVisibleEditChem(true)
                                setSelectedChem('PH')
                            }}
                        >
                            <span>PH : {chemDisplay.ph}</span>
                        </BoxChem>
                        <BoxChem
                            onClick={() => {
                                setVisibleEditChem(true)
                                setSelectedChem('SALT')
                            }}
                        >
                            <span>SALT : {chemDisplay.nacl}</span>
                        </BoxChem>
                        <BoxChem
                            onClick={() => {
                                setVisibleEditChem(true)
                                setSelectedChem('TN')
                            }}
                        >
                            <span>TN : {chemDisplay.tn}</span>
                        </BoxChem>
                    </RowChem>
                    <a href='http://128.199.228.63/dashboard' rel="noreferrer" target='_blank'>
                        ไปที่โปรแกรม Lab
                    </a>
                </div>

                <br />
                {getOrdersDetailFromId.loading ? (
                    <StyledSectionLoading>
                        <Spin size='large' />
                    </StyledSectionLoading>
                ) : (
                    <>
                        {Boolean(!getOrdersDetailFromId.data) || Boolean(!getOrdersDetailFromId.data?.length) ? (
                            <StyledEmpty />
                        ) : (
                            <OrderLastedSection
                                data={getOrdersDetailFromId.data}
                                onOpenBill={handleViewFishWeightBill}
                                onSelected={handleSelectSubOrder}
                                statusPuddle={getPuddleDetailById.data?.status}
                            />
                        )}
                    </>
                )}

                <StyledSectionAction>
                    <StyledButtonAction
                        onClick={() => {
                            setItemsTransfer(0)
                            setTitleDrawerTransfer('ปล่อยน้ำปลา')
                            showDrawer()
                        }}
                        type='primary'
                    >
                        ปล่อยน้ำปลา
                    </StyledButtonAction>

                    <StyledButtonAction
                        onClick={() => {
                            setOpenThrowOtherPuddle(true)
                        }}
                        type='dashed'
                    >
                        ถ่ายกากรวม
                    </StyledButtonAction>
                    <StyledButtonAction
                        onClick={() => {
                            setOpenThrowOut(true)
                        }}
                        type='dashed'
                    >
                        ถ่ายกากทิ้ง
                    </StyledButtonAction>
                    <StyledButtonAction
                        onClick={() => {
                            setVisibleModalAddOnFishSauce(true)
                        }}
                        type='dashed'
                    >
                        เติมน้ำปลา
                    </StyledButtonAction>
                    <StyledButtonAction
                        onClick={() => {
                            setVisibleModalAddOn(true)
                        }}
                        type='dashed'
                    >
                        เติมน้ำเกลือ
                    </StyledButtonAction>
                    <StyledButtonAction
                        onClick={() => {
                            setItemsTransfer(1)
                            setTitleDrawerTransfer('ปล่อยน้ำเกลือ')
                            showDrawer()
                        }}
                        type='primary'
                    >
                        ปล่อยน้ำเกลือ
                    </StyledButtonAction>
                    <StyledButtonAction
                        onClick={() => {
                            handleViewSaltBill(getPuddleDetailById?.data?.lasted_order)
                            setVisibleModalViewSaltBill(true)
                        }}
                        type='link'
                    >
                        ดูรายการการเติมเกลือจากบิล
                    </StyledButtonAction>
                </StyledSectionAction>

                {getPuddleDetailById?.data?.topSalt === 0 && (
                    <StyledSectionAction>
                        <ButtonApprove
                            icon={<CheckOutlined />}
                            onClick={() => {
                                setVisibleModalConfirmTopSalt(true)
                            }}
                            type='primary'
                        >
                            ยืนยันการกลบเกลือ
                        </ButtonApprove>
                    </StyledSectionAction>
                )}
            </StyledBoxContent>
            <br />
            <StyleBoxSetting>
                <StyledButton
                    onClick={() => {
                        setVisibleModalProcess(true)
                    }}
                    type='primary'
                >
                    เพิ่มรายการการทำงาน
                </StyledButton>
            </StyleBoxSetting>
            <Divider />
            <StyledBoxContent>
                <span>การทำรายการทั้งหมดทั้งหมด</span>
                <br />
                <TableHistoryOrders data={getAllOrdersFromPuddleId.data} loading={getAllOrdersFromPuddleId.loading} />
            </StyledBoxContent>
            {/* Sidebar Transfer Fishsaurce */}
            <StyledDrawer bodyStyle={{ paddingBottom: 80 }} onClose={onClose} open={open} title={titleDrawerTransfer} width={720}>
                <Form autoComplete='off' form={form} layout='vertical' onFinish={handleSubmitTransfer}>
                    <TransferFishsauce
                        amountItemsKG={amountItemsKG}
                        buildingOption={getAllBuildings.data}
                        lastedOrder={orderDetailLasted}
                        onChangeAmountItems={handleChangeAmountItems}
                        onChangeBuilding={handleChangeBuilding}
                        onChangeDate={onChangeDateTransfer}
                        onSelectAction={handleSelectPuddle}
                        puddleOption={tragetPuddle}
                        typeProcess={getTypeProcess?.data}
                    />
                    <Button htmlType='submit' type='primary'>
                        Submit
                    </Button>
                </Form>
            </StyledDrawer>
            {/* Sidebar GetIn Fishsaurce */}
            <StyledDrawer bodyStyle={{ paddingBottom: 80 }} onClose={onCloseGetIn} open={openGetIN} title='รับเข้า' width={720}>
                <Form autoComplete='off' form={formGetIn} layout='vertical' onFinish={submitImportFishSaurce}>
                    <GetInFishsauce onChangeDate={onChangeDateTransfer} />
                    <Button htmlType='submit' type='primary'>
                        Submit
                    </Button>
                </Form>
            </StyledDrawer>
            {/* ThrowOut Drawer */}
            <StyledDrawer
                bodyStyle={{ paddingBottom: 80 }}
                onClose={() => {
                    setOpenThrowOtherPuddle(false)
                }}
                open={openThrowOtherPuddle}
                title='ถ่ายกาก'
                width={720}
            >
                <Form autoComplete='off' form={form} layout='vertical' onFinish={submitThrowFish}>
                    <TransferFishsauce
                        amountItemsKG={amountItemsKG}
                        buildingOption={getAllBuildings.data}
                        lastedOrder={orderDetailLasted}
                        onChangeAmountItems={handleChangeAmountItems}
                        onChangeBuilding={handleChangeBuilding}
                        onChangeDate={onChangeDateTransfer}
                        onSelectAction={handleSelectPuddle}
                        puddleOption={tragetPuddle}
                        throwOutProcess
                        typeProcess={getTypeProcess?.data}
                    />
                    <Button htmlType='submit' type='primary'>
                        Submit
                    </Button>
                </Form>
            </StyledDrawer>

            <ModalConfirm
                description={'เมื่อทำการยกเลิก รายการนำออกจากบ่อที่มาจะหายไป'}
                onClose={() => {
                    setVisibleModalCancelGetIn(false)
                }}
                onSubmit={handleDeleteGetIn}
                title={'ยกเลิกการนำเข้า'}
                visible={visibleModalCancelGetIn}
            />
            <ModalLoading
                onClose={() => {
                    setModalLoadingVisivble(false)
                }}
                visible={modalLoadingVisivble}
            />
            <Modal
                centered
                onCancel={() => {
                    setVisibleModalProcess(false)
                }}
                onOk={() => {
                    handleSubmitTypeProcessTask()
                }}
                open={visibleModalProcess}
                title='เพิ่มรายการการทำงาน'
            >
                <div>
                    <StyledContentModal>
                        <ul>
                            {getTypeProcess?.data?.map((data, index) => (
                                <li key={index}>{data.process_name}</li>
                            ))}
                        </ul>
                    </StyledContentModal>

                    <Input
                        onChange={(e) => {
                            setValueTypeProcess(e.target.value)
                        }}
                        placeholder='เพิ่มรายการการทำงาน'
                        value={valueTypeProcess}
                    />
                </div>
            </Modal>
            {/* modal ถ่ายกากทิ้ง */}
            <Modal
                centered
                onCancel={() => {
                    setOpenThrowOut(false)
                }}
                onOk={() => {
                    handleSubmitColseProcess()
                }}
                open={openThrowOut}
                title='ยืนยันรการถ่ายกากทิ้ง'
            >
                <ModalContent>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '24px' }}>
                        <DatePicker onChange={onChangeDateTransfer} style={{ width: '100%' }} />
                        <p>{'เมื่อทำรายการนี้เเล้วจะไม่สามารถแก้ไขได้\nกรุณาตรวจสอบข้อมูลให้ครบถ้วน'}</p>
                    </div>
                </ModalContent>
            </Modal>
            {/* modal เลือกการทำงาน */}
            <Modal
                centered
                onCancel={() => {
                    setVisibleModalDescProcess(false)
                    setIdSubOrdersTarget(null)
                    setSelectedIdProcess(null)
                }}
                onOk={handleUpdateDescProcess}
                open={visibleModalDescProcess}
                title={`suborder id : ${idSubOrdersTarget}`}
            >
                <div>
                    <StyledContentModal>
                        <ul>
                            {getTypeProcess?.data?.map((data, index) => (
                                <li key={index}>{data.process_name}</li>
                            ))}
                        </ul>
                    </StyledContentModal>
                    {idSubOrdersTarget && (
                        <Select
                            onChange={(e) => {
                                setSelectedIdProcess(e)
                            }}
                            placeholder='เลือกรายการการทำงาน'
                            style={{ width: '100%' }}
                            value={selectedIdProcess}
                        >
                            {getTypeProcess?.data &&
                                getTypeProcess?.data.map((data, index) => (
                                    <Option key={index} value={data.idtype_process}>
                                        <span>{data?.process_name}</span>
                                    </Option>
                                ))}
                        </Select>
                    )}
                </div>
            </Modal>
            <Modal
                centered
                footer={null}
                onCancel={() => {
                    setVisibleModalAddOn(false)
                    setIdSubOrdersTarget(null)
                    setSelectedIdProcess(null)
                }}
                open={visibleModalAddOn}
                title={`เติมน้ำเกลือที่ออเดอร์ : ${getPuddleDetailById?.data?.lasted_order}`}
                width={990}
            >
                {' '}
                <StyledForm
                    autoComplete='off'
                    form={formAddOn}
                    hideRequiredMark
                    layout='vertical'
                    name='addON_salt_water'
                    onFinish={handleSubmitAddOn}
                >
                    <Steps current={currentStepSalt} items={itemsStepsSalt} />
                    <StyledContentSteop>{stepsSalt[currentStepSalt].content}</StyledContentSteop>
                    <div>
                        {/* TODO */}
                        {/* {currentStepSalt < stepsSalt.length - 1 && (
                            <Button type='primary' onClick={() => next()}>
                                Next
                            </Button>
                        )} */}
                        {currentStepSalt === stepsSalt.length - 1 && (
                            <Button htmlType='submit' type='primary'>
                                ยืนยัน
                            </Button>
                        )}
                        {currentStepSalt > 0 && (
                            <Button onClick={() => prev()} style={{ margin: '0 8px' }}>
                                Previous
                            </Button>
                        )}
                    </div>{' '}
                </StyledForm>
            </Modal>
            <Modal
                centered
                footer={null}
                onCancel={() => {
                    setVisibleModalBillFerment(false)
                    setIdOrdersOpenWeightBill(null)
                }}
                open={visibleModalBillFerment}
                title={`ใบชั่งที่ผูกกับออเดอร์หมายเลข : ${idOrdersOpenWeightBill}`}
                width={524}
            >
                {!getReceiveWeightFishByOrderId.data ||
                    (getReceiveWeightFishByOrderId.data.length < 1 && (
                        <StyledBoxListFishWeightBill>
                            <span>ไม่มีรายการที่ผูกไว้</span>
                        </StyledBoxListFishWeightBill>
                    ))}
                {getReceiveWeightFishByOrderId.data &&
                    getReceiveWeightFishByOrderId.data.map((data, index) => (
                        <React.Fragment key={index}>
                            <StyledBoxListFishWeightBill>
                                <span>บิลหมายเลข</span>
                                <span>{data.no}</span>
                            </StyledBoxListFishWeightBill>
                            <StyledBoxListFishWeightBill>
                                <span>ปริมาณที่ใช้จากบิลนี้</span>
                                <span>{numberWithCommas(data.amount)}</span>
                            </StyledBoxListFishWeightBill>
                            <StyledBoxListFishWeightBill>
                                <span>สต็อกคงเหลือ</span>
                                <span>{numberWithCommas(data.stock)}</span>
                            </StyledBoxListFishWeightBill>
                            <StyledBoxListFishWeightBill>
                                <span>สถานที่จัดเก็บ</span>
                                <span>{data.store_name}</span>
                            </StyledBoxListFishWeightBill>
                            <Divider />
                        </React.Fragment>
                    ))}
            </Modal>

            <Modal
                centered
                footer={null}
                onCancel={() => {
                    setVisibleModalViewSaltBill(false)
                    setIdOrdersOpenSaltBill(null)
                }}
                open={visibleModalViewSaltBill}
                title={`บิลเกลือที่ผูกกับออเดอร์หมายเลข : ${idOrdersOpenSaltBill}`}
                width={524}
            >
                {!getLogReceiveSaltByOrdersId.data ||
                    (getLogReceiveSaltByOrdersId.data.length < 1 && (
                        <StyledBoxListFishWeightBill>
                            <span>ไม่มีรายการที่ผูกไว้</span>
                        </StyledBoxListFishWeightBill>
                    ))}
                {getLogReceiveSaltByOrdersId.data &&
                    getLogReceiveSaltByOrdersId.data.map((data, index) => (
                        <React.Fragment key={index}>
                            <StyledBoxListFishWeightBill>
                                <span>บิลหมายเลข</span>
                                <span>{data.no}</span>
                            </StyledBoxListFishWeightBill>
                            <StyledBoxListFishWeightBill>
                                <span>ปริมาณที่ใช้จากบิลนี้</span>
                                <span>{numberWithCommas(data.amount)} KG</span>
                            </StyledBoxListFishWeightBill>

                            <Divider />
                        </React.Fragment>
                    ))}
            </Modal>

            {/* <Modal
                centered
                footer={null}
                onCancel={() => {
                    setVisibleModalViewFishSauceBill(false)
                    setIdOrdersOpenFishSauceBill(null)
                }}
                open={visibleModalViewFishSauceBill}
                title={`บิลน้ำปลาที่ผูกกับออเดอร์หมายเลข : ${idOrdersOpenSaltBill}`}
                width={524}
            >
                {!getLogReceiveFishSauceByOrdersId.data ||
                    (getLogReceiveFishSauceByOrdersId.data.length < 1 && (
                        <StyledBoxListFishWeightBill>
                            <span>ไม่มีรายการที่ผูกไว้</span>
                        </StyledBoxListFishWeightBill>
                    ))}
                {getLogReceiveFishSauceByOrdersId.data &&
                    getLogReceiveFishSauceByOrdersId.data.map((data, index) => (
                        <React.Fragment key={index}>
                            <StyledBoxListFishWeightBill>
                                <span>บิลหมายเลข</span>
                                <span>{data.no}</span>
                            </StyledBoxListFishWeightBill>
                            <StyledBoxListFishWeightBill>
                                <span>ปริมาณที่ใช้จากบิลนี้</span>
                                <span>{numberWithCommas(data.amount)} KG</span>
                            </StyledBoxListFishWeightBill>

                            <Divider />
                        </React.Fragment>
                    ))}
            </Modal> */}

            <Modal
                centered
                destroyOnClose
                footer={null}
                onCancel={() => {
                    setVisibleModalAddOnFishSauce(false)
                    setIdSubOrdersTarget(null)
                    setSelectedIdProcess(null)
                }}
                open={visibleModalAddOnFishSauce}
                title={`เติมน้ำปลาที่ออเดอร์ : ${getPuddleDetailById?.data?.lasted_order}`}
                width={990}
            >
                {' '}
                <StyledForm
                    autoComplete='off'
                    form={formAddOnFishSauce}
                    hideRequiredMark
                    layout='vertical'
                    name='addON_fish_sauce'
                    onFinish={handleSubmitAddOnFishSauce}
                >
                    <Steps current={currentStepFishSauce} items={itemsStepsFishSauce} />
                    <StyledContentSteop>{stepsFishSauce[currentStepFishSauce].content}</StyledContentSteop>
                    <div>
                        {currentStepFishSauce === stepsFishSauce.length - 1 && (
                            <Button htmlType='submit' type='primary'>
                                ยืนยัน
                            </Button>
                        )}
                        {currentStepFishSauce > 0 && (
                            <Button onClick={() => prevFishSauce()} style={{ margin: '0 8px' }}>
                                Previous
                            </Button>
                        )}
                    </div>{' '}
                </StyledForm>
            </Modal>

            {/* modal working status */}
            <Modal
                centered
                onCancel={() => {
                    setVisibleModalWorkingStatus(false)
                }}
                onOk={() => {}}
                open={visibleModalWorkingStatus}
                title='working status'
            >
                <ModalContentTable>
                    {getListWorkingStatus?.data ? (
                        <StyledTableWorkingStatus>
                            <tr>
                                <th>status</th>
                                <th>color</th>
                                <th></th>
                            </tr>
                            {getListWorkingStatus?.data.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.title}</td>
                                    <td>
                                        <div
                                            style={{
                                                width: '80px',
                                                height: '30px',
                                                borderRadius: '4px',
                                                backgroundColor: data.color,
                                            }}
                                        ></div>
                                    </td>
                                    <td>
                                        <StyledButton
                                            onClick={() => {
                                                handleChangeWorkingStatus(data.idworking_status)
                                            }}
                                            type='primary'
                                        >
                                            เลือก
                                        </StyledButton>
                                    </td>
                                </tr>
                            ))}
                        </StyledTableWorkingStatus>
                    ) : (
                        <LoadingSections>
                            <Spin size='large' tip='Loading...' />
                        </LoadingSections>
                    )}
                </ModalContentTable>
            </Modal>

            {/* modal approve top salt */}
            <Modal
                centered
                onCancel={() => {
                    setVisibleModalConfirmTopSalt(false)
                }}
                onOk={() => {
                    handleUpdateTopSalt()
                }}
                open={visibleModalConfirmTopSalt}
                title='ยืนยันการกลบเกลือ'
            >
                <ModalContent>
                    <p>{'เมื่อทำรายการนี้เเล้วจะไม่สามารถแก้ไขได้\nกรุณาตรวจสอบข้อมูลให้ครบถ้วน'}</p>
                </ModalContent>
            </Modal>

            {/* modal date start ferment */}
            <Modal
                centered
                destroyOnClose
                onCancel={() => {
                    setVisibleModalDateStart(false)
                }}
                onOk={() => {
                    handleUpdateDateStart()
                }}
                open={visibleModalDateStart}
                title='ตั้งวันที่เริ่มหมัก'
            >
                <ModalContent>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '24px' }}>
                        <DatePicker onChange={onChangeDate} style={{ width: '100%' }} />
                        <p>{'เมื่อทำรายการนี้เเล้วจะไม่สามารถแก้ไขได้\nกรุณาตรวจสอบข้อมูลให้ครบถ้วน'}</p>
                    </div>
                </ModalContent>
            </Modal>

            <Modal
                centered
                destroyOnClose
                onCancel={() => {
                    setVisibleEditChem(false)
                    setValueChem(null)
                }}
                onOk={() => {
                    handleChangeChem()
                    // handleUpdateDateStart()
                }}
                open={visibleEditChem}
                title={`แก้ไขค่า ${selectedChem}`}
            >
                <ModalContent>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '24px' }}>
                        {/* <DatePicker onChange={onChangeDate} style={{ width: '100%' }} /> */}
                        <InputNumber
                            max={100}
                            min={0}
                            onChange={(e) => {
                                console.log('e : ', e)
                                setValueChem(e)
                            }}
                            placeholder='กรุณาระบุค่าทางเคมี'
                            step={0.1}
                            style={{ width: '100%' }}
                            value={valueChem}
                        />
                        {/* <p>{'เมื่อทำรายการนี้เเล้วจะไม่สามารถแก้ไขได้\nกรุณาตรวจสอบข้อมูลให้ครบถ้วน'}</p> */}
                    </div>
                </ModalContent>
            </Modal>
        </>
    )
}

DetailPuddlePage.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>
            <>{page}</>
        </AppLayout>
    )
}

export default DetailPuddlePage

const StyledInputNumber = styled(InputNumber)`
    width: 100%;
    .ant-input-number-handler-wrap {
        display: none;
    }
`

const RowChem = styled.div`
    display: flex;
    gap: 8px;
`
const BoxChem = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: 2px;
    min-width: 150px;
    height: 50px;
    background: #51459e98;
    color: white;
    padding: 8px;
`

const ButtonApprove = styled(Button)`
    border-radius: 2px;
    background-color: #1da57a;
    border-color: #1da57a;

    &:hover {
        background-color: #52c41a;
        border-color: #52c41a;
    }
`
const StyledTableWorkingStatus = styled.table`
    width: 100%;
    border-collapse: collapse;
    td,
    th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }

    th {
        background: #00000011;
    }
`

const LoadingSections = styled.div`
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
`

const StyledTable = styled(Table)`
    width: 100%;
    .ant-table-thead .ant-table-cell {
        font-weight: 400;
    }
`

const StyledContentSteop = styled.div`
    margin: 24px 0px;
`
const StyledBoxListFishWeightBill = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
`

const StyledFormItems = styled(Form.Item)`
    width: 100%;
    .ant-form-item-label > label {
        font-size: 18px;
        font-weight: normal;
    }
`
const StyledForm = styled(Form)`
    width: 100%;
`

const ModalContentTable = styled.div`
    max-height: 800px;
    overflow: scroll;
    p {
        white-space: pre-line;
        margin-bottom: 0;
    }
`

const ModalContent = styled.div`
    p {
        white-space: pre-line;
        margin-bottom: 0;
    }
`

const StyledContentModal = styled.div`
    padding: 0px 24px;
    display: flex;
    flex-derection: column;
`
const StyleBoxSetting = styled.div`
    width: 100%;
    margin-bottom: 24px;
`

const StyledAlert = styled(Alert)`
    margin-bottom: 12px;
`

const StyledDrawer = styled(Drawer)`
    .ant-drawer-header {
        background: #51459e !important;
    }
    .ant-drawer-close {
        color: #ffffff !important;
    }
    .ant-drawer-title {
        color: #ffffff !important;
    }
    .ant-drawer-body {
        background: rgb(255, 255, 255) !important;
    }
`
const StyledButtonAction = styled(Button)`
    border-radius: 2px;
    margin-right: 8px;
`

const StyledSectionAction = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 10px;
`
const StyledEmpty = styled(Empty)`
    width: 100%;
`

const StyledSectionLoading = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #00000022;
    height: 200px;
    border-radius: 8px;
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
