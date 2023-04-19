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
    message,
} from 'antd'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { LabeledValue } from 'antd/lib/select'
import axios from 'axios'

import AppLayout from '../../../../components/Layouts'
import { NextPageWithLayout } from '../../../_app'
import { useNavigation } from '../../../../utils/use-navigation'
import { getAllBuildingTask, getPuddleByIdBuildingTask, getPuddleDetailByIdTask } from '../../../../share-module/building/task'
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
    getReceiveSaltPaginationTask,
    getReceiveWeightFishByOrderIdTask,
} from '../../../../share-module/FishWeightBill/task'
import { numberWithCommas } from '../../../../utils/format-number'
import Table, { ColumnsType } from 'antd/lib/table'
import moment from 'moment'

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

const DetailPuddlePage: NextPageWithLayout = () => {
    const router = useRouter()
    const navigation = useNavigation()
    const { building_id, puddle_id } = router.query
    const [form] = Form.useForm()
    const [formGetIn] = Form.useForm()
    const [formAddOn] = Form.useForm()

    const [open, setOpen] = useState(false)
    const [openGetIN, setOpenGetIn] = useState(false)
    const [openThrowOtherPuddle, setOpenThrowOtherPuddle] = useState(false)
    const [openThrowOut, setOpenThrowOut] = useState(false)
    const [orderDetailLasted, setOrderDetailLasted] = useState(null)
    const [amountItemsKG, setAmountItemsKG] = useState(0)
    const [amountItemsL, setAmountItemsL] = useState(0)

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
    const [saltWaterKG, setSaltWaterKG] = useState(0)
    const [visibleModalBillFerment, setVisibleModalBillFerment] = useState(false)
    const [idOrdersOpenWeightBill, setIdOrdersOpenWeightBill] = useState(null)
    const [preDataSaltBill, setPreDataSaltBill] = useState<ISelectSaltBillDto>(null)
    const [visibleModalViewSaltBill, setVisibleModalViewSaltBill] = useState(false)
    const [idOrdersOpenSaltBill, setIdOrdersOpenSaltBill] = useState(null)

    // TODO
    // const [actionPuddle, setActionPuddle] = useState(null)

    const [remainingVolumnGetIn, setRemainingVolumnGetIn] = useState(0)
    const [remainingVolumnExport, setRemainingVolumnExport] = useState(0)

    const [visibleModalCancelGetIn, setVisibleModalCancelGetIn] = useState(false)
    const [stateDelete, setStateDelete] = useState({
        id_sub_order: null,
        idtarget_puddle: null,
    })
    const [typeProcessImport, setTypeProcessImport] = useState(TypeProcess.IMPORT)

    const [valueTypeProcess, setValueTypeProcess] = useState(null)
    const [currentStepSalt, setCurrentStepSalt] = useState(0)
    const [currentPageSalt, setCurrentPageSalt] = useState(1)
    const [sourceDataSalt, setSourceDataSalt] = useState([])
    const [totalListSalt, setTotalListSalt] = useState(0)

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
    const getReceiveSaltPagination = getReceiveSaltPaginationTask.useTask()
    const getLogReceiveSaltByOrdersId = getLogReceiveSaltByOrdersIdTask.useTask()

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
                    type='primary'
                    onClick={() => {
                        setPreDataSaltBill(data)
                        next()
                    }}
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

    const handleGetListReceive = async () => {
        try {
            const res = await getReceiveSaltPagination.onRequest({ page: currentPageSalt - 1, offset: OFFSET_PAGE })
            setSourceDataSalt(res.data)
            setTotalListSalt(res.total)
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        }
    }

    const handleChangePagination = (pagination: any) => {
        setCurrentPageSalt(pagination.current)
    }

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
        })()
    }, [])

    useEffect(() => {
        if (getOrdersDetailFromId?.data) {
            setOrderDetailLasted(getOrdersDetailFromId?.data[getOrdersDetailFromId?.data?.length - 1])
        }
    }, [getOrdersDetailFromId?.data, trigger])

    useEffect(() => {
        ;(async () => {
            if (puddle_id) {
                await getNoticeTargetPending.onRequest({ puddle_id: Number(puddle_id) })
                const res = await getPuddleDetailById.onRequest({ puddle_id: Number(puddle_id) })
                await getAllOrdersFromPuddleId.onRequest({ puddle_id: Number(puddle_id) })
                const resOrderDetail = await getOrdersDetailFromId.onRequest({ order_id: res.lasted_order })

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
        setAmountItemsKG(Number(e.target.value))
        setAmountItemsL(Number(e.target.value) / 1.2)
        setAmountItemsPercent(parseFloat2Decimals(((Number(e.target.value) * remainingItems) / volumn).toFixed(2)))
        form.setFieldsValue({
            amount_items: parseFloat2Decimals(((Number(e.target.value) * remainingItems) / volumn).toFixed(2)),
            remaining_items:
                remainingItems - parseFloat2Decimals(((Number(e.target.value) * remainingItems) / volumn).toFixed(2)),
            remaining_volume: remainingVolumnExport - Number(e.target.value),
        })
    }

    const handleChangeLitToKGSaltWater = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSaltWaterKG(Number(e.target.value) * 1.2)
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
            setTypeProcessImport(TypeProcess.GET_FISH_RESIDUE)
        } else {
            setTypeProcessImport(TypeProcess.IMPORT)
        }
        let amount_item_cal =
            getPuddleDetailById.data?.status === TypeOrderPuddle.CIRCULAR ||
            getPuddleDetailById.data?.status === TypeOrderPuddle.FILTER ||
            getPuddleDetailById.data?.status === TypeOrderPuddle.BREAK ||
            getPuddleDetailById.data?.status === TypeOrderPuddle.MIXING ||
            getPuddleDetailById.data?.status === TypeOrderPuddle.STOCK
                ? getOrdersDetailFromId.data.length === 1
                    ? (result.volume * 100) / volumnPuddle
                    : (result.volume * 100) / volumnPuddle //(result.volume * 100) / remainingVolumnGetIn
                : (result.volume * remainingItems) / remainingVolumnGetIn ///result.amount_price / result.amount_unit_per_price

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
                volume: Number(form.getFieldValue('volume')),
                id_puddle: Number(puddle_id),
                remaining_volume: Number(form.getFieldValue('remaining_volume')),
                action_puddle: await getSerial(Number(puddle_id)),
                target_puddle: Number(form.getFieldValue('id_puddle')),
                serial_puddle: Number(form.getFieldValue('action_puddle')),
                process: form.getFieldValue('process') as number,
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
        }
    }

    const submitImportFishSaurce = async () => {
        try {
            setModalLoadingVisivble(true)
            const payload = {
                order_id: getPuddleDetailById?.data?.lasted_order,
                type_process: typeProcessImport,
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
        }
    }

    const handleSubmitColseProcess = async () => {
        try {
            setModalLoadingVisivble(true)

            const payload = {
                order_id: getPuddleDetailById?.data?.lasted_order,
                type_process: TypeProcess.CLEARING_ALL,
                amount_items: remainingItems,
                amount_unit_per_price: lastedPerUnit,
                amount_price: lastedPrice,
                remaining_items: 0,
                remaining_unit_per_price: 0,
                remaining_price: 0,
                approved: 1,
                volume: remainingVolumnExport,
                remaining_volume: 0,
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
        }
    }

    const handleSubmitAddOn = async (values: any) => {
        try {
            setModalLoadingVisivble(true)

            let amount_item_cal =
                getOrdersDetailFromId.data.length === 1
                    ? (saltWaterKG * 100) / volumnPuddle
                    : (saltWaterKG * remainingItems) / remainingVolumnGetIn
            let price_net = Number(values.salt) * preDataSaltBill.price_per_weigh
            const payload = {
                order_id: getPuddleDetailById?.data?.lasted_order,
                type_process: TypeProcess.ADD_ON_WATER_SALT,
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
                new_stock: Number(values.salt),
                idreceipt: preDataSaltBill.idsalt_receipt,
                id_puddle: Number(puddle_id),
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
        }
    }

    const handleSubmitTransfer = async () => {
        try {
            setModalLoadingVisivble(true)

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
                volume: Number(form.getFieldValue('volume')),
                id_puddle: Number(puddle_id),
                remaining_volume: Number(form.getFieldValue('remaining_volume')),
                action_puddle: await getSerial(Number(puddle_id)),
                target_puddle: Number(form.getFieldValue('id_puddle')),
                serial_puddle: Number(form.getFieldValue('action_puddle')),
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
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setModalLoadingVisivble(false)
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

    const next = () => {
        setCurrentStepSalt(currentStepSalt + 1)
    }

    const prev = () => {
        setCurrentStepSalt(currentStepSalt - 1)
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
                                extra={`~ ${saltWaterKG} KG.`}
                                label='ปริมาตรน้ำเกลือที่เติมเพิ่ม (L.)'
                                name='volume'
                                rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
                            >
                                <Input
                                    onChange={handleChangeLitToKGSaltWater}
                                    placeholder='ปริมาตรน้ำเกลือที่เติมเพิ่ม'
                                    size='large'
                                    style={{ color: 'black' }}
                                />
                            </StyledFormItems>
                        </Col>
                        <Col xs={24}>
                            <StyledFormItems
                                label='ปริมาตรเกลือที่ใช้ (KG)'
                                name='salt'
                                rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
                            >
                                <Input placeholder='ปริมาตรเกลือที่ใช้ (KG)' size='large' style={{ color: 'black' }} />
                            </StyledFormItems>
                        </Col>
                        {/* <Col xs={24}>
                            <StyledFormItems
                                label='ราคา'
                                name='price'
                                rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
                            >
                                <Input disabled placeholder='ราคา' size='large' style={{ color: 'black' }} />
                            </StyledFormItems>
                        </Col> */}
                    </Row>
                </>
            ),
        },
    ]

    const itemsStepsSalt = stepsSalt.map((item) => ({ key: item.title, title: item.title }))

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
                    <BadgeStatus status={getPuddleDetailById.data?.status} />
                </StyledTitleBoxHeader>

                <StyledButton
                    onClick={() => {
                        navigation.navigateTo.createOrder(getPuddleDetailById.data?.uuid_puddle as string, puddle_id as string)
                    }}
                    type='primary'
                >
                    ลงทะเบียน order
                </StyledButton>
            </StyledBoxHeader>
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
                            description={`นำเข้าน้ำปลาปริมาตร ${data.volume} kg. ~ ${data.volume / 1.2} L. จากบ่อหมายเลข ${
                                data?.source_serial_puddle
                            }`}
                            message={`รายการนำเข้าหมายเลข ${data.idtarget_puddle}`}
                            type='info'
                        />
                    </React.Fragment>
                ))}

            <StyledBoxContent>
                <span>รายการล่าสุด</span>
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
                                onSelected={handleSelectSubOrder}
                                data={getOrdersDetailFromId.data}
                                statusPuddle={getPuddleDetailById.data?.status}
                                onOpenBill={handleViewFishWeightBill}
                            />
                        )}
                    </>
                )}
                <StyledSectionAction>
                    <StyledButtonAction onClick={showDrawer} type='primary'>
                        ถ่ายออก
                    </StyledButtonAction>

                    <StyledButtonAction
                        type='dashed'
                        onClick={() => {
                            setOpenThrowOtherPuddle(true)
                        }}
                    >
                        ถ่ายกาก
                    </StyledButtonAction>
                    <StyledButtonAction
                        type='dashed'
                        onClick={() => {
                            setOpenThrowOut(true)
                        }}
                    >
                        ถ่ายกากทิ้ง
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
                            handleViewSaltBill(getPuddleDetailById?.data?.lasted_order)
                            setVisibleModalViewSaltBill(true)
                        }}
                        type='link'
                    >
                        ดูรายการการเติมเกลือจากบิล
                    </StyledButtonAction>
                </StyledSectionAction>
            </StyledBoxContent>

            <Divider />
            <StyledBoxContent>
                <span>การทำรายการทั้งหมดทั้งหมด</span>
                <br />
                <TableHistoryOrders data={getAllOrdersFromPuddleId.data} loading={getAllOrdersFromPuddleId.loading} />
            </StyledBoxContent>
            {/* Sidebar Transfer Fishsaurce */}
            <StyledDrawer bodyStyle={{ paddingBottom: 80 }} onClose={onClose} open={open} title='ถ่ายออก' width={720}>
                <Form autoComplete='off' form={form} layout='vertical' onFinish={handleSubmitTransfer}>
                    <TransferFishsauce
                        amountItemsL={amountItemsL}
                        buildingOption={getAllBuildings.data}
                        lastedOrder={orderDetailLasted}
                        onChangeAmountItems={handleChangeAmountItems}
                        onChangeBuilding={handleChangeBuilding}
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
            <StyledDrawer bodyStyle={{ paddingBottom: 80 }} onClose={onCloseGetIn} open={openGetIN} title='นำออก' width={720}>
                <Form autoComplete='off' form={formGetIn} layout='vertical' onFinish={submitImportFishSaurce}>
                    <GetInFishsauce />
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
                        amountItemsL={amountItemsL}
                        buildingOption={getAllBuildings.data}
                        lastedOrder={orderDetailLasted}
                        onChangeAmountItems={handleChangeAmountItems}
                        onChangeBuilding={handleChangeBuilding}
                        onSelectAction={handleSelectPuddle}
                        puddleOption={tragetPuddle}
                        typeProcess={getTypeProcess?.data}
                        throwOutProcess
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
                title='เพิ่มรายการการทำงาน'
                open={visibleModalProcess}
                onOk={() => {
                    handleSubmitTypeProcessTask()
                }}
                onCancel={() => {
                    setVisibleModalProcess(false)
                }}
                centered
            >
                <div>
                    <StyledContentModal>
                        <ul>
                            {getTypeProcess?.data?.map((data, index) => (
                                <li>{data.process_name}</li>
                            ))}
                        </ul>
                    </StyledContentModal>

                    <Input
                        value={valueTypeProcess}
                        placeholder='เพิ่มรายการการทำงาน'
                        onChange={(e) => {
                            setValueTypeProcess(e.target.value)
                        }}
                    />
                </div>
            </Modal>
            {/* modal ถ่ายกากทิ้ง */}
            <Modal
                title='ยืนยันรการถ่ายกากทิ้ง'
                open={openThrowOut}
                onOk={() => {
                    handleSubmitColseProcess()
                }}
                onCancel={() => {
                    setOpenThrowOut(false)
                }}
                centered
            >
                <ModalContent>
                    <p>{'เมื่อทำรายการนี้เเล้วจะไม่สามารถแก้ไขได้\nกรุณาตรวจสอบข้อมูลให้ครบถ้วย'}</p>
                </ModalContent>
            </Modal>
            {/* modal เลือกการทำงาน */}
            <Modal
                title={`suborder id : ${idSubOrdersTarget}`}
                open={visibleModalDescProcess}
                onOk={handleUpdateDescProcess}
                onCancel={() => {
                    setVisibleModalDescProcess(false)
                    setIdSubOrdersTarget(null)
                    setSelectedIdProcess(null)
                }}
                centered
            >
                <div>
                    <StyledContentModal>
                        <ul>
                            {getTypeProcess?.data?.map((data, index) => (
                                <li>{data.process_name}</li>
                            ))}
                        </ul>
                    </StyledContentModal>
                    {idSubOrdersTarget && (
                        <Select
                            value={selectedIdProcess}
                            placeholder='เลือกรายการการทำงาน'
                            onChange={(e) => {
                                setSelectedIdProcess(e)
                            }}
                            style={{ width: '100%' }}
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
                title={`เติมน้ำเกลือที่ออเดอร์ : ${getPuddleDetailById?.data?.lasted_order}`}
                open={visibleModalAddOn}
                footer={null}
                onCancel={() => {
                    setVisibleModalAddOn(false)
                    setIdSubOrdersTarget(null)
                    setSelectedIdProcess(null)
                }}
                centered
                width={990}
            >
                {' '}
                <StyledForm
                    name='addON_salt_water'
                    autoComplete='off'
                    form={formAddOn}
                    hideRequiredMark
                    layout='vertical'
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
                            <Button type='primary' htmlType='submit'>
                                ยืนยัน
                            </Button>
                        )}
                        {currentStepSalt > 0 && (
                            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                                Previous
                            </Button>
                        )}
                    </div>{' '}
                </StyledForm>
            </Modal>
            <Modal
                title={`ใบชั่งที่ผูกกับออเดอร์หมายเลข : ${idOrdersOpenWeightBill}`}
                open={visibleModalBillFerment}
                footer={null}
                onCancel={() => {
                    setVisibleModalBillFerment(false)
                    setIdOrdersOpenWeightBill(null)
                }}
                centered
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
                title={`บิลเกลือที่ผูกกับออเดอร์หมายเลข : ${idOrdersOpenSaltBill}`}
                open={visibleModalViewSaltBill}
                footer={null}
                onCancel={() => {
                    setVisibleModalViewSaltBill(false)
                    setIdOrdersOpenSaltBill(null)
                }}
                centered
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
        </>
    )
}

// visibleModalViewSaltBill
// idOrdersOpenSaltBill

DetailPuddlePage.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>
            <>{page}</>
        </AppLayout>
    )
}

export default DetailPuddlePage

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
        background: rgb(26, 28, 33) !important;
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
