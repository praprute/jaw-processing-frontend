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
    Checkbox,
    FloatButton,
} from 'antd'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { LabeledValue } from 'antd/lib/select'
import axios from 'axios'
import Table, { ColumnsType } from 'antd/lib/table'
import moment from 'moment'
import { BranchesOutlined, CheckOutlined, DownCircleFilled, UpCircleFilled, VerticalAlignMiddleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { DatePickerProps } from 'antd'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

import AppLayout from '../../../../components/Layouts'
import { NextPageWithLayout } from '../../../_app'
import { useNavigation } from '../../../../utils/use-navigation'
import {
    changeWorkingStatusPuddleTask,
    getAllBuildingTask,
    getLastedSubOrderByIdTask,
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
    submitCloseProcessTask,
    submitAddOnSaltWaterTask,
    submitAddOnFishSauceTask,
    submitTransferSaltWaterTask,
    getWorkingStatusTypeTask,
    getSpecificChemTask,
    addOrderSpecificTask,
    submitAddOnAmpanTask,
    submitAddOnFishyTask,
    updateVolumeTask,
    getOrdersHistoryDetailFromIdTask,
    updateDescritionSubOrderTask,
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
    getCustomerByBillTaskPaginationTask,
    getLogReceiveSaltByOrdersIdTask,
    getReceiveAmpanPaginationWithOutEmptyTask,
    // getReceiveFishSaucePaginationTask,
    getReceiveFishSaucePaginationWithOutEmptyTask,
    getReceiveFishyPaginationWithOutEmptyTask,
    // getReceiveSaltPaginationTask,
    getReceiveSaltPaginationWithOutEmptyTask,
    getReceiveWeightFishByOrderIdTask,
} from '../../../../share-module/FishWeightBill/task'
import { numberWithCommas } from '../../../../utils/format-number'
import { IAllBuildingAndPuddleDto } from '../../../../share-module/building/type'

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

interface ISelectAmpanBillDto {
    idampan_receipt: number
    no: string
    product_name: string
    weigh_net: number
    price_per_weigh: number
    price_net: number
    customer: string
    stock: number
    date_create: string
}

interface ISelectFishyBillDto {
    idfishy_receipt: number
    no: string
    product_name: string
    weigh_net: number
    price_per_weigh: number
    price_net: number
    customer: string
    stock: number
    date_create: string
}

interface ITx {
    idsub_orders: number
    idOrders: number
    type: number
    fish: number
    salt: number
    laber: number
    other: number
    fish_sauce: number
    fish_price: number
    salt_price: number
    laber_price: number
    amount_items: number
    amount_unit_per_price: number
    amount_price: number
    remaining_items: number
    remaining_unit_per_price: number
    remaining_price: number
    description?: any
    user_create_sub: number
    date_create: string
    approved: number
    volume: number
    remaining_volume: number
    action_puddle: number
    action_serial_puddle: number
    type_process: number
    date_action: string
    tn?: any
    nacl?: any
    ph?: any
    round: number
}
const DetailPuddlePage: NextPageWithLayout = () => {
    const router = useRouter()
    const navigation = useNavigation()
    const { building_id, puddle_id } = router.query
    const [form] = Form.useForm()
    const [formGetIn] = Form.useForm()
    const [formAddOn] = Form.useForm()
    const [formAddOnFishSauce] = Form.useForm()
    const [formSendToLabs] = Form.useForm()
    const [formHitWater] = Form.useForm()
    const [formWaterFish] = Form.useForm()
    const [formFishy] = Form.useForm()
    const [formSelling] = Form.useForm()

    const [building, setBuilding] = useState<IAllBuildingAndPuddleDto[]>([])
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
    const [visibleModalAddOn, setVisibleModalAddOn] = useState(false)
    const [visibleModalAddOnFishSauce, setVisibleModalAddOnFishSauce] = useState(false)
    const [saltWaterKG, setSaltWaterKG] = useState(0)
    const [fishSauceWaterKGAddon, setFishSauceWaterKGAddon] = useState(0)
    const [ampanKG, setAmpanKG] = useState(0)
    const [visibleModalBillFerment, setVisibleModalBillFerment] = useState(false)
    const [idOrdersOpenWeightBill, setIdOrdersOpenWeightBill] = useState(null)
    const [preDataSaltBill, setPreDataSaltBill] = useState<ISelectSaltBillDto>(null)
    const [preDataFishSauceBill, setPreDataFishSauceBill] = useState<ISelectFishSauceBillDto>(null)
    const [preDataAmpanBill, setPreDataAmpanBill] = useState<ISelectAmpanBillDto>(null)
    const [preDataFishyBill, setPreDataFishyBill] = useState<ISelectFishyBillDto>(null)
    const [visibleModalViewSaltBill, setVisibleModalViewSaltBill] = useState(false)
    const [idOrdersOpenSaltBill, setIdOrdersOpenSaltBill] = useState(null)
    const [titleDrawerTransfer, setTitleDrawerTransfer] = useState('ปล่อยน้ำปลา')

    //  0 = น้ำปลา , 1 = น้ำเกลือ
    const [itemsTransfer, setItemsTransfer] = useState(0)
    //  0 = น้ำปลา , 1 = น้ำเกลือ
    const [itemsGetIn, setItemsGetIn] = useState(0)

    const [visibleModalWorkingStatus, setVisibleModalWorkingStatus] = useState(false)
    const [visibleModalConfirmTopSalt, setVisibleModalConfirmTopSalt] = useState(false)
    // TODO
    // const [actionPuddle, setActionPuddle] = useState(null)
    // const [visibleEditChem, setVisibleEditChem] = useState(false)
    // const [selectedChem, setSelectedChem] = useState(null)

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
    const [currentStepFishSauce, setCurrentStepFishSauce] = useState(0)
    const [currentStepAmpan, setCurrentStepAmpan] = useState(0)
    const [currentStepFishy, setCurrentStepFishy] = useState(0)
    const [currentPageSalt, setCurrentPageSalt] = useState(1)
    const [currentPageFishSauce, setCurrentPageFishSauce] = useState(1)
    const [currentPageAmpan, setCurrentPageAmpan] = useState(1)
    const [currentPageFishy, setCurrentPageFishy] = useState(1)
    const [sourceDataSalt, setSourceDataSalt] = useState([])
    const [sourceDataFishSauce, setSourceDataFishSauce] = useState([])
    const [sourceDataAmpan, setSourceDataAmpan] = useState([])
    const [sourceDataFishy, setSourceDataFishy] = useState([])
    const [totalListFishy, setTotalListFishy] = useState(0)
    const [totalListAmpan, setTotalListAmpna] = useState(0)
    const [totalListSalt, setTotalListSalt] = useState(0)
    const [totalListFishSauce, setTotalListFishSauce] = useState(0)
    const [dateStart, setDateStart] = useState(null)
    const [visibleModalDateStart, setVisibleModalDateStart] = useState(false)
    const [dateTransfer, setDateTransfer] = useState(null)
    const [visibleModalSelling, setVisibleModalSelling] = useState(false)
    const [sellingStatus, setSellingStatus] = useState(false)
    const [visibleModalSendToLabs, setVisibleModalSendToLabs] = useState(false)
    const [chemCheck, setChemCheck] = useState([])
    const [microCheck, setMicroCheck] = useState({ Micro: false })
    const [visibleModalWaterFish, setVisibleModalWaterFish] = useState(false)
    const [visibleModalHitWaterFish, setVisibleModalHitWaterFish] = useState(false)
    const [defaultDateActionGetIn, setDefaultDateActionGetIn] = useState(null)
    const [idSuborderToLabs, setIdSuborderToLabs] = useState(null)
    const [modalMixing, setModalMixing] = useState(false)
    // ITx
    const [listSelectdItemsComponent, setListSelectdItemsComponent] = useState<
        {
            building: number
            puddle_id: any
            tx: ITx[]
            selectedPuddle: any
            vloumnTx: number
            volumnInput: number
            serialPuddle: any
        }[]
    >([{ building: null, puddle_id: [], tx: [], selectedPuddle: null, vloumnTx: 0, volumnInput: 0, serialPuddle: null }])

    const [listBuildingTransfser, setListBuildingTransfser] = useState<
        {
            building: number
            puddle_id: any
            selectedPuddle: any
            serialPuddle: any
        }[]
    >([{ building: null, puddle_id: [], selectedPuddle: null, serialPuddle: null }])

    const [calTxVolumn, setCalTxVolumn] = useState([{ vloumnTx: 0 }])
    const [sumCalculatedTxVolumn, setSumCalculatedTxVolumn] = useState(0)
    const [triggerCal, setTriggerCal] = useState(false)
    const [visibleModalChangeVoume, setVisibleModalChangeVoume] = useState(false)
    const [idSubOrderChangeVolume, setIdSubOrderChangeVolume] = useState(null)
    const [valueVolumeChanged, setValueVolumeChanged] = useState(null)

    const [visibleHistoryOrder, setVisibleHistoryOrder] = useState(false)
    const [idHistory, setIdHistory] = useState(null)
    const [modeMulti, setModeMulti] = useState(false)
    const [descSuborder, setDescSuborder] = useState(null)
    const [typeTransfer, setTypeTransfer] = useState(TypeProcess.TRANSFER)

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
    const updateProcessDescritionSubOrder = updateDescritionSubOrderTask.useTask()
    const submitCloseProcess = submitCloseProcessTask.useTask()
    const submitAddOnSaltWater = submitAddOnSaltWaterTask.useTask()
    const getReceiveWeightFishByOrderId = getReceiveWeightFishByOrderIdTask.useTask()
    const getReceiveSaltPagination = getReceiveSaltPaginationWithOutEmptyTask.useTask()
    const getReceiveFishSaucePagination = getReceiveFishSaucePaginationWithOutEmptyTask.useTask()
    const getLogReceiveSaltByOrdersId = getLogReceiveSaltByOrdersIdTask.useTask()
    const getReceiveAmpanPaginationWithOutEmpty = getReceiveAmpanPaginationWithOutEmptyTask.useTask()
    const getReceiveFishyPaginationWithOutEmpty = getReceiveFishyPaginationWithOutEmptyTask.useTask()
    const submitAddOnFishSauce = submitAddOnFishSauceTask.useTask()
    const submitTransferSaltWater = submitTransferSaltWaterTask.useTask()
    const getListWorkingStatus = getWorkingStatusTypeTask.useTask()
    const changeWorkingStatusPuddle = changeWorkingStatusPuddleTask.useTask()
    const updateStatusTopSalt = updateStatusTopSaltTask.useTask()
    const updateDateStartFermant = updateDateStartFermantTask.useTask()
    const getSpecific = getSpecificChemTask.useTask()
    const addOrderSpecific = addOrderSpecificTask.useTask()
    const submitAddOnAmpan = submitAddOnAmpanTask.useTask()
    const submitAddOnFishy = submitAddOnFishyTask.useTask()
    const getLastedSubOrderById = getLastedSubOrderByIdTask.useTask()
    const updateVolume = updateVolumeTask.useTask()
    const getOrdersHistoryDetailFromId = getOrdersHistoryDetailFromIdTask.useTask()
    const getCustomerByBillTaskPagination = getCustomerByBillTaskPaginationTask.useTask()

    const OFFSET_PAGE = 10

    const columnsSalt: ColumnsType<any> = [
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

    const columnsAmpan: ColumnsType<any> = [
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
            render: (_: any, data: ISelectAmpanBillDto) => (
                <Button
                    onClick={() => {
                        setPreDataAmpanBill(data)
                        nextStepAmpan()
                    }}
                    type='primary'
                >
                    เลือก
                </Button>
            ),
        },
    ]

    const columnsFishy: ColumnsType<any> = [
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
            render: (_: any, data: ISelectFishyBillDto) => (
                <Button
                    onClick={() => {
                        setPreDataFishyBill(data)
                        nextStepFishy()
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
            await getSpecific.onRequest()
            await getCustomerByBillTaskPagination.onRequest({
                page: 0,
                offset: 100000,
                type_bill: 7,
            })
            const result = await getAllBuildings.onRequest()
            setBuilding(result)
        })()
    }, [])

    useMemo(() => {
        let buffer = []
        listSelectdItemsComponent.map((data) => {
            buffer.push({ vloumnTx: data.vloumnTx })
        })
        setCalTxVolumn(buffer)
    }, [listSelectdItemsComponent])

    const handleSummaryMixingTN = async () => {
        let volumn = listSelectdItemsComponent
            .map((order) => order.volumnInput)
            .reduce((prev, curr) => {
                return prev + curr
            })

        let volumnTx = listSelectdItemsComponent
            .map((order) => order.vloumnTx)
            .reduce((prev, curr) => {
                return prev + curr
            })

        setSumCalculatedTxVolumn(volumnTx / volumn)
    }

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // first prevent the default behavior
        e.preventDefault()
        // get the href and remove everything before the hash (#)
        const href = e.currentTarget.href
        const targetId = href.replace(/.*\#/, '')
        // get the element by id and use scrollIntoView
        const elem = document.getElementById(targetId)
        elem?.scrollIntoView({
            behavior: 'smooth',
        })
    }

    const handleChangeVolumnMixing = (value: any, index: any) => {
        let buffer = listSelectdItemsComponent
        buffer[index].vloumnTx = Number(value) * buffer[index].tx[0].tn
        buffer[index].volumnInput = Number(value)
        // volumnInput
        setListSelectdItemsComponent(buffer)
    }

    const handleSelectPuddleByKey = async (labelValue: any, index: any) => {
        try {
            const res = await getLastedSubOrderById.onRequest({ puddle_id: Number(labelValue) })

            let buffer = listSelectdItemsComponent
            buffer[index].tx = res
            buffer[index].selectedPuddle = Number(labelValue)
            buffer[index].serialPuddle = await getSerial(Number(labelValue))
            setListSelectdItemsComponent(buffer)

            // const res = await getSerial(Number(labelValue))
            // form.setFieldsValue({ action_puddle: res })
        } catch (e: any) {
            return '0'
        }
    }

    const handleSelectMultiPuddleByKey = async (labelValue: any, index: any) => {
        try {
            // const res = await getLastedSubOrderById.onRequest({ puddle_id: Number(labelValue) })

            let buffer = listBuildingTransfser
            // buffer[index].tx = res
            buffer[index].selectedPuddle = Number(labelValue)
            buffer[index].serialPuddle = await getSerial(Number(labelValue))
            setListBuildingTransfser(buffer)

            // const res = await getSerial(Number(labelValue))
            // form.setFieldsValue({ action_puddle: res })
        } catch (e: any) {
            return '0'
        }
    }

    const onChangeBuildingByKeySelect = async (value: any, index: any) => {
        const res = await getPuddleByIdBuilding.onRequest({ building_id: Number(value) })
        const fillterPuddle = res.filter((data) => data.idpuddle !== Number(puddle_id))
        let buffer = listSelectdItemsComponent
        buffer[index] = {
            building: value,
            puddle_id: fillterPuddle.map((data) => {
                return {
                    value: data.idpuddle,
                    label: data.serial,
                }
            }),
            tx: [],
            selectedPuddle: null,
            vloumnTx: 0,
            volumnInput: 0,
            serialPuddle: null,
        }
        setListSelectdItemsComponent(buffer)
    }

    const onChangeBuildingByKeySelectTransfer = async (value: any, index: any) => {
        const res = await getPuddleByIdBuilding.onRequest({ building_id: Number(value) })
        const fillterPuddle = res.filter((data) => data.idpuddle !== Number(puddle_id))
        let buffer = listBuildingTransfser
        buffer[index] = {
            building: value,
            puddle_id: fillterPuddle.map((data) => {
                return {
                    value: data.idpuddle,
                    label: data.serial,
                }
            }),
            selectedPuddle: null,
            serialPuddle: null,
        }
        setListBuildingTransfser(buffer)
    }

    // const handleChangeBuilding = async (value: number) => {
    //     const res = await getPuddleByIdBuilding.onRequest({ building_id: Number(value) })
    //     const fillterPuddle = res.filter((data) => data.idpuddle !== Number(puddle_id))
    //     setTragetPuddle(fillterPuddle)
    // }
    const onChange = (checkedValues: CheckboxValueType[]) => {
        setChemCheck(checkedValues)
    }

    const onChangeMicro = (e: CheckboxChangeEvent) => {
        setMicroCheck({ Micro: e.target.checked })
    }

    const handleAddToLab = async () => {
        try {
            let cc = {
                Tn: chemCheck.includes('Tn'),
                Salt: chemCheck.includes('Salt'),
                PH: chemCheck.includes('PH'),
                Histamine: chemCheck.includes('Histamine'),
                Tss: chemCheck.includes('Tss'),
                Aw: chemCheck.includes('Aw'),
                Spg: chemCheck.includes('Spg'),
                AN: chemCheck.includes('AN'),
                Acidity: chemCheck.includes('Acidity'),
                Viscosity: chemCheck.includes('Viscosity'),
                SaltMeter: chemCheck.includes('SaltMeter'),
                Color: chemCheck.includes('Color'),
            }

            const payload = {
                ProductName: formSendToLabs.getFieldValue('ProductName'),
                idScfChem: formSendToLabs.getFieldValue('idScfChem'),
                Micro: microCheck.Micro,
                idScfMicro: 1,
                Priority: 0,
                ref: idSuborderToLabs,
                ...cc,
            }

            const res = await addOrderSpecific.onRequest(payload)

            if (res.success === 'success') {
                NoticeSuccess('ส่งรายการไปที่ Lab เรียบร้อย')
            }
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        } finally {
            formSendToLabs.resetFields()
            setVisibleModalSendToLabs(false)
        }
    }

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

    useEffect(() => {
        ;(async () => {
            await handleGetListAmpanReceive()
        })()
    }, [currentPageAmpan])

    useEffect(() => {
        ;(async () => {
            await handleGetListFishyReceive()
        })()
    }, [currentPageFishy])

    const handleGetListAmpanReceive = async () => {
        try {
            const res = await getReceiveAmpanPaginationWithOutEmpty.onRequest({ page: currentPageAmpan - 1, offset: OFFSET_PAGE })
            setSourceDataAmpan(res.data)
            setTotalListAmpna(res.total)
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        }
    }
    const handleGetListFishyReceive = async () => {
        try {
            const res = await getReceiveFishyPaginationWithOutEmpty.onRequest({ page: currentPageSalt - 1, offset: OFFSET_PAGE })
            setSourceDataFishy(res.data)
            setTotalListFishy(res.total)
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        }
    }

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

    const handleChangePaginationAmpan = (pagination: any) => {
        setCurrentPageAmpan(pagination.current)
    }

    const handleChangePaginationFishy = (pagination: any) => {
        setCurrentPageFishy(pagination.current)
    }

    // setCurrentPageFishy

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
            await getSpecific.onRequest()
        })()
    }, [])

    useEffect(() => {
        if (getOrdersDetailFromId?.data) {
            setOrderDetailLasted(getOrdersDetailFromId?.data[getOrdersDetailFromId?.data?.length - 1])
        }
    }, [getOrdersDetailFromId?.data, trigger])

    useEffect(() => {
        if (!!idHistory) {
            ;(async () => {
                await getOrdersHistoryDetailFromId.onRequest({ order_id: Number(idHistory) })
            })()
        }
    }, [idHistory])

    useEffect(() => {
        ;(async () => {
            if (puddle_id) {
                await getNoticeTargetPending.onRequest({ puddle_id: Number(puddle_id) })
                const res = await getPuddleDetailById.onRequest({ puddle_id: Number(puddle_id) })

                await getAllOrdersFromPuddleId.onRequest({ puddle_id: Number(puddle_id) })
                const resOrderDetail = await getOrdersDetailFromId.onRequest({ order_id: res.lasted_order })

                // setLastedOrderId(res.lasted_order)
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
        // console.log(orderDetailLasted.remaining_volume, Number(e.target.value))
        setAmountItemsKG(Number(e.target.value) * 1.2)
        setAmountItemsPercent(parseFloat2Decimals(((Number(e.target.value) * remainingItems * 1.2) / volumn).toFixed(2)))

        form.setFieldsValue({
            amount_items: parseFloat2Decimals(((Number(e.target.value) * remainingItems * 1.2) / volumn).toFixed(2)),
            remaining_items:
                remainingItems - parseFloat2Decimals(((Number(e.target.value) * remainingItems * 1.2) / volumn).toFixed(2)),
            remaining_volume: remainingVolumnExport - Number(e.target.value) * 1.2,
        })
    }

    const handleChangeLitToKGSaltWater = (e: number) => {
        // setSaltWaterKG(Number(e.target.value) * 1.2)
        setSaltWaterKG(Number(e))
    }
    const handleChangeLitToKG = (e: number) => {
        // setSaltWaterKG(Number(e.target.value) * 1.2)
        setAmpanKG(Number(e) * 1.2)
    }

    const handleChangeLitToKGFishSauceWaterAddon = (e: number) => {
        // setFishSauceWaterKG(Number(e.target.value) * 1.2)
        setFishSauceWaterKGAddon(Number(e) * 1.2)
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
        setSellingStatus(false)
    }

    const showDrawerGetIn = () => {
        setOpenGetIn(true)
    }

    const onCloseGetIn = () => {
        setOpenGetIn(false)
    }

    const handleSelectOrdersGetIN = async (id_selected: number) => {
        const result = getNoticeTargetPending.data.find((data) => id_selected === data.idtarget_puddle)

        if (result?.type_process === 14) {
            setTypeProcessImport(TypeProcess.MIXEDPAUSE)
        } else {
            if (result.type === TypeProcess.CLEARING) {
                setTypeProcessImport(TypeProcess.GETFISHRESIDUE)
            } else {
                setTypeProcessImport(TypeProcess.IMPORT)
            }
        }

        let amount_item_cal =
            getPuddleDetailById.data?.status !== TypeOrderPuddle.FERMENT
                ? getOrdersDetailFromId.data.length === 1
                    ? (result.volume * 100) / volumnPuddle
                    : (result.volume * 100) / volumnPuddle //(result.volume * 100) / remainingVolumnGetIn
                : (result.volume * remainingItems) / remainingVolumnGetIn ///result.amount_price / result.amount_unit_per_price

        setDefaultDateActionGetIn(result?.date_action)
        // date_action

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
            date_action: moment(result?.date_action, 'YYYY-MM-DD'),
        })
        // date_action: result?.date_action,
        showDrawerGetIn()
    }

    const getSerial = async (id: number) => {
        try {
            const config = await configAPI()
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/getSerialPuddle/${id}`, config)
            // console.log('data : ', data.message[0].serial)
            return data.message[0].serial
        } catch (e: any) {
            return 0
        }
    }

    const handleSelectPuddle = async (labelValue: LabeledValue) => {
        try {
            const res = await getSerial(Number(labelValue))
            console.log('res : ', res)
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
                date_action: moment(formGetIn.getFieldValue('date_action'), 'YYYY-MM-DD').utc().local().format('YYYY-MM-DD'),
                id_puddle: Number(puddle_id),
                round: Number(formGetIn.getFieldValue('round')),
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
            // formGetIn.resetFields()
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

    const handleSubmitWaterFish = async (values: any) => {
        try {
            setModalLoadingVisivble(true)

            let amount_item_cal =
                getOrdersDetailFromId.data.length === 1
                    ? (ampanKG * 100) / volumnPuddle
                    : (ampanKG * remainingItems) / remainingVolumnGetIn
            let price_net = Number(values.volume) * preDataFishyBill.price_per_weigh

            const payload = {
                order_id: getPuddleDetailById?.data?.lasted_order,
                type_process: TypeProcess.IMPORTWATERFISH,
                amount_items: amount_item_cal,
                amount_unit_per_price: price_net / ampanKG,
                amount_price: price_net,
                remaining_items: remainingItems + amount_item_cal,
                remaining_unit_per_price:
                    (lastedPrice + price_net) /
                    (getOrdersDetailFromId.data[getOrdersDetailFromId.data?.length - 1]?.remaining_volume + ampanKG),
                remaining_price: lastedPrice + price_net,
                volume: ampanKG,
                remaining_volume: getOrdersDetailFromId.data[getOrdersDetailFromId.data?.length - 1]?.remaining_volume + ampanKG,
                process: 10,
                new_stock: Number(values.volume) * 1.2,
                idreceipt: preDataFishyBill.idfishy_receipt,
                id_puddle: Number(puddle_id),
                date_action: dateTransfer,
            }

            const res = await submitAddOnFishy.onRequest(payload)
            if (res.success === 'success') {
                NoticeSuccess(`ทำรายการสำเร็จ`)
                setTrigger(!trigger)
            }
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        } finally {
            setVisibleModalWaterFish(false)
            setVisibleModalHitWaterFish(false)
            setModalLoadingVisivble(false)

            await handleGetListFishyReceive()
            setCurrentStepSalt(0)
            setCurrentPageFishy(0)
            setDateTransfer(null)
            formWaterFish.resetFields()
            formFishy.resetFields()
            setCurrentStepFishSauce(0)
            setAmpanKG(0)
        }
    }

    const handleSubmitHitWater = async (values: any) => {
        try {
            setModalLoadingVisivble(true)
            let amount_item_cal =
                getOrdersDetailFromId.data.length === 1
                    ? ((ampanKG / 1.2) * 100) / volumnPuddle
                    : ((ampanKG / 1.2) * remainingItems) / remainingVolumnGetIn
            let price_net = Number(values.volume) * preDataAmpanBill.price_per_weigh

            const payload = {
                order_id: getPuddleDetailById?.data?.lasted_order,
                type_process: TypeProcess.IMPORTHITWATER,
                amount_items: amount_item_cal,
                amount_unit_per_price: price_net / (ampanKG / 1.2),
                amount_price: price_net,
                remaining_items: remainingItems + amount_item_cal,
                remaining_unit_per_price:
                    (lastedPrice + price_net) /
                    (getOrdersDetailFromId.data[getOrdersDetailFromId.data?.length - 1]?.remaining_volume + ampanKG / 1.2),
                remaining_price: lastedPrice + price_net,
                volume: ampanKG / 1.2,
                remaining_volume:
                    getOrdersDetailFromId.data[getOrdersDetailFromId.data?.length - 1]?.remaining_volume + ampanKG / 1.2,
                process: 10,
                new_stock: Number(values.volume),
                idreceipt: preDataAmpanBill.idampan_receipt,
                id_puddle: Number(puddle_id),
                date_action: dateTransfer,
            }

            //  new_stock: Number(values.volume) * 1.2,

            const res = await submitAddOnAmpan.onRequest(payload)
            if (res.success === 'success') {
                formAddOn.resetFields()
                NoticeSuccess(`ทำรายการสำเร็จ`)
                setTrigger(!trigger)
            }
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        } finally {
            setVisibleModalHitWaterFish(false)
            setModalLoadingVisivble(false)
            await handleGetListReceive()
            await handleGetListFishSauceReceive()
            await handleGetListAmpanReceive()
            setCurrentStepAmpan(0)
            setDateTransfer(null)
            formHitWater.resetFields()
            setCurrentPageAmpan(1)
            setAmpanKG(0)
        }
    }

    const handleSubmitAddOnFishSauce = async (values: any) => {
        try {
            setModalLoadingVisivble(true)

            let amount_item_cal =
                getOrdersDetailFromId.data.length === 1
                    ? (fishSauceWaterKGAddon * 100) / volumnPuddle
                    : (fishSauceWaterKGAddon * remainingItems) / remainingVolumnGetIn
            let price_net = Number(values.volume) * preDataFishSauceBill.price_per_weigh
            const payload = {
                order_id: getPuddleDetailById?.data?.lasted_order,
                type_process: TypeProcess.ADDONFISHSAUCE,
                amount_items: amount_item_cal,
                amount_unit_per_price: price_net / fishSauceWaterKGAddon,
                amount_price: price_net,
                remaining_items: remainingItems + amount_item_cal,
                remaining_unit_per_price:
                    (lastedPrice + price_net) /
                    (getOrdersDetailFromId.data[getOrdersDetailFromId.data?.length - 1]?.remaining_volume +
                        fishSauceWaterKGAddon),
                remaining_price: lastedPrice + price_net,
                volume: fishSauceWaterKGAddon,
                remaining_volume:
                    getOrdersDetailFromId.data[getOrdersDetailFromId.data?.length - 1]?.remaining_volume + fishSauceWaterKGAddon,
                process: 7,
                new_stock: Number(values.volume * 1.2),
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
                round: Number(form.getFieldValue('round')) || 0,
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

    console.log('dateTransfer : ', dateTransfer)

    const handleCheckFirstTransaction = async (amount_items: any, remaining_unit_per_price: any, remaining_price: any) => {
        if (amount_items === 100 && remaining_unit_per_price === 0 && remaining_price === 0) {
            return true
        } else {
            return false
        }
    }

    const handleSubmitChangeVolume = async () => {
        try {
            // valueVolumeChanged
            const payload = {
                volume: valueVolumeChanged,
                idsub_orders: idSubOrderChangeVolume,
            }
            const res = await updateVolume.onRequest(payload)
            if (res.success === 'success') {
                NoticeSuccess('ทำรายการสำเร็จ')
                setTrigger(!trigger)
            }
        } catch (e) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setValueVolumeChanged(null)
            setIdSubOrderChangeVolume(null)
            setTrigger(!trigger)
            setVisibleModalChangeVoume(false)
        }
    }

    const [selectedOptionProcess, setSelectedOptionProcess] = useState(null)

    const onChangeOptionProcess = (value: any) => {
        setSelectedOptionProcess(value)
    }

    const optionProcess = [
        { value: 12, label: 'ดูดไปผสม' },
        { value: 14, label: 'ดูดไปพัก' },
    ]
    const handleSubMitMixed = async () => {
        try {
            // listSelectdItemsComponent.map()
            for (const result of listSelectdItemsComponent) {
                let first = await handleCheckFirstTransaction(
                    result.tx[0].amount_items,
                    result.tx[0].remaining_unit_per_price,
                    result.tx[0].remaining_price,
                )
                let payload = {
                    order_id: result.tx[0].idOrders,
                    type_process: selectedOptionProcess,
                    amount_items: (result.volumnInput * 1.2 * result.tx[0].remaining_items) / result.tx[0].remaining_volume,
                    amount_unit_per_price: !!first ? result.tx[0].amount_unit_per_price : result.tx[0].remaining_unit_per_price,
                    amount_price: !!first
                        ? result.tx[0].amount_unit_per_price * result.volumnInput * 1.2
                        : result.tx[0].remaining_unit_per_price * result.volumnInput * 1.2,
                    remaining_items:
                        result.tx[0].remaining_items -
                        (result.volumnInput * 1.2 * result.tx[0].remaining_items) / result.tx[0].remaining_volume,
                    remaining_unit_per_price: !!first
                        ? result.tx[0].amount_unit_per_price
                        : result.tx[0].remaining_unit_per_price,
                    remaining_price: !!first
                        ? result.tx[0].amount_price - result.tx[0].amount_unit_per_price * result.volumnInput * 1.2
                        : result.tx[0].remaining_price - result.tx[0].remaining_unit_per_price * result.volumnInput * 1.2,
                    approved: 0,
                    volume: result.volumnInput * 1.2, //Number(form.getFieldValue('volume')),
                    id_puddle: result.selectedPuddle,
                    remaining_volume: result.tx[0].remaining_volume - result.volumnInput * 1.2,
                    action_puddle: await getSerial(Number(result.selectedPuddle)),
                    target_puddle: Number(puddle_id),
                    serial_puddle: await getSerial(Number(puddle_id)),
                    date_action: dateTransfer,
                    round: 0,
                    // round: Number(form.getFieldValue('round')),
                }

                console.log('payload : ', payload)

                let rr = await submitTransfer.onRequest(payload)
                if (rr === 'success') {
                    NoticeSuccess('ทำรายการสำเร็จ')
                }
            }

            setModalLoadingVisivble(true)
            // console.log('payload')
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setDateTransfer(null)
            setModalLoadingVisivble(false)
            setModalMixing(false)
            setListSelectdItemsComponent([
                {
                    building: null,
                    puddle_id: [],
                    tx: [],
                    selectedPuddle: null,
                    vloumnTx: 0,
                    volumnInput: 0,
                    serialPuddle: null,
                },
            ])
            setCalTxVolumn([{ vloumnTx: 0 }])
            setTrigger(!trigger)
        }
    }
    const onChangewwww = (value: string) => {
        console.log(`selected ${value}`)
    }

    const onSearch = (value: string) => {
        console.log('search:', value)
    }

    const handleMultiTransfer = async () => {
        try {
            setModalLoadingVisivble(true)

            let buffer = {
                remaining_items: form.getFieldValue('remaining_items'),
                remaining_unit_per_price: form.getFieldValue('remaining_unit_per_price'),
                remaining_volume: Number(form.getFieldValue('remaining_volume')),
                remaining_price: form.getFieldValue('remaining_price'),
            }

            for (const [index, data] of listBuildingTransfser.entries()) {
                let payload = {
                    order_id: getPuddleDetailById?.data?.lasted_order,
                    type_process: TypeProcess.TRANSFER,
                    amount_items: form.getFieldValue('amount_items') / listBuildingTransfser.length,
                    amount_unit_per_price: form.getFieldValue('amount_unit_per_price') / listBuildingTransfser.length,
                    amount_price: form.getFieldValue('amount_price') / listBuildingTransfser.length,

                    remaining_items:
                        index === 0
                            ? getOrdersDetailFromId.data[getOrdersDetailFromId.data?.length - 1]?.remaining_items -
                              form.getFieldValue('amount_items') / listBuildingTransfser.length
                            : buffer.remaining_items - form.getFieldValue('amount_items') / listBuildingTransfser.length, //form.getFieldValue('remaining_items') : buffer.remaining_items - form.getFieldValue('amount_items'),
                    remaining_unit_per_price: form.getFieldValue('remaining_unit_per_price'),
                    remaining_volume:
                        index === 0
                            ? getOrdersDetailFromId.data[getOrdersDetailFromId.data?.length - 1]?.remaining_volume -
                              amountItemsKG / listBuildingTransfser.length
                            : buffer.remaining_volume - amountItemsKG / listBuildingTransfser.length,
                    remaining_price:
                        index === 0
                            ? lastedPrice - form.getFieldValue('amount_price') / listBuildingTransfser.length
                            : buffer.remaining_price - form.getFieldValue('amount_price') / listBuildingTransfser.length,

                    approved: 0,
                    volume: amountItemsKG / listBuildingTransfser.length, //Number(form.getFieldValue('volume')),
                    id_puddle: Number(puddle_id),
                    action_puddle: await getSerial(Number(puddle_id)),
                    target_puddle: Number(data.selectedPuddle),
                    serial_puddle: Number(data.serialPuddle),
                    date_action: dateTransfer,
                    round: Number(form.getFieldValue('round')),
                }

                let payloads = form.getFieldValue('process')
                    ? { ...payload, process: form.getFieldValue('process') as number }
                    : { ...payload }

                await submitTransfer.onRequest(payloads)
                const res = await getPuddleDetailById.onRequest({ puddle_id: Number(puddle_id) })
                await getOrdersDetailFromId.onRequest({ order_id: res.lasted_order })

                buffer = {
                    remaining_items: payload.remaining_items,
                    remaining_unit_per_price: payload.remaining_unit_per_price,
                    remaining_volume: payloads.remaining_volume,
                    remaining_price: payloads.remaining_price,
                }
            }
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setModeMulti(false)
            setTrigger(!trigger)
            setDateTransfer(null)
            setModalLoadingVisivble(false)
            form.resetFields()

            router.reload()
        }
    }

    const handleTransfer = async () => {
        try {
            setModalLoadingVisivble(true)

            if (itemsTransfer === 0) {
                const payload = {
                    order_id: getPuddleDetailById?.data?.lasted_order,
                    type_process: typeTransfer,
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
                    serial_puddle: form.getFieldValue('action_puddle'),
                    date_action: dateTransfer,
                    round: Number(form.getFieldValue('round')),
                    customer_name: form.getFieldValue('customer_name'),
                    lot: form.getFieldValue('lot'),
                    description: form.getFieldValue('description') || null,
                }
                // console.log('customer_name : ', form.getFieldValue('customer_name'))

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
                    serial_puddle: form.getFieldValue('action_puddle'),
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

    const handleSubmitTransfer = async () => {
        if (modeMulti) {
            // console.log(1)
            await handleMultiTransfer()
        } else {
            // console.log(2)
            await handleTransfer()
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
            if (descSuborder === null || idSubOrdersTarget === null) {
                return
            }
            const payload = { process: descSuborder, subOrderId: idSubOrdersTarget, puddle_id: Number(puddle_id) }
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

    const nextStepAmpan = () => {
        setCurrentStepAmpan(currentStepAmpan + 1)
    }

    const prevAmpan = () => {
        setCurrentStepAmpan(currentStepAmpan - 1)
    }

    const nextStepFishy = () => {
        setCurrentStepFishy(currentStepFishy + 1)
    }

    const prevFishy = () => {
        setCurrentStepFishy(currentStepFishy - 1)
    }

    const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
        setDateStart(dateString)
    }

    const onChangeDateTransfer: DatePickerProps['onChange'] = (date, dateString) => {
        setDateTransfer(dateString)
    }

    // const handleChangeChem = async () => {
    //     try {
    //         let chem = null
    //         switch (selectedChem) {
    //             case 'PH':
    //                 chem = 'ph'
    //                 break
    //             case 'SALT':
    //                 chem = 'nacl'
    //                 break
    //             case 'TN':
    //                 chem = 'tn'
    //                 break
    //             default:
    //                 chem = null
    //                 break
    //         }
    //         const payload = {
    //             chem: chem,
    //             value: Number(valueChem),
    //             idorders: getPuddleDetailById?.data?.lasted_order,
    //         }

    //         const res = await updateChemOrder.onRequest(payload)
    //         if (res === 'UPDATE_SUCCESS') {
    //             NoticeSuccess('ทำรายการสำเร็จ')
    //         }
    //     } catch (e) {
    //         NoticeError('ทำรายการไม่สำเร็จ')
    //     } finally {
    //         setVisibleEditChem(false)
    //         setTrigger(!trigger)
    //         setDateStart(null)
    //     }
    // }
    // console.log('sourceDataSalt : ', sourceDataSalt)

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
                            <>
                                Stock ที่มีอยู่ : {Number(preDataSaltBill?.stock)} KG. ~ {Number(preDataSaltBill?.stock / 1.2)} L
                            </>
                            <StyledFormItems
                                // extra={`~ ${saltWaterKG} KG.`}

                                label='ปริมาตรน้ำเกลือที่เติมเพิ่ม (KG.)'
                                name='volume'
                                rules={[
                                    { required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
                                    {
                                        validator: async (_, value) => {
                                            if (value > Number(preDataSaltBill?.stock)) {
                                                return Promise.reject(
                                                    new Error(`ค่าต้องไม่เกิน ${Number(preDataSaltBill?.stock)}`),
                                                )
                                            }
                                        },
                                    },
                                ]}
                            >
                                {/* <Input
                                    onChange={handleChangeLitToKGSaltWater}
                                    placeholder='ปริมาตรน้ำเกลือที่เติมเพิ่ม'
                                    size='large'
                                    style={{ color: 'black' }}
                                /> */}

                                {Number(preDataSaltBill?.stock) && (
                                    <StyledInputNumber
                                        // max={Number(preDataSaltBill.stock)}
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
                            <>
                                Stock ที่มีอยู่ : {Number(preDataFishSauceBill?.stock)} KG. ~{' '}
                                {Number(preDataFishSauceBill?.stock / 1.2)} L
                            </>
                            <StyledFormItems
                                label='ปริมาตรน้ำปลาที่เติมเพิ่ม (L.)'
                                name='volume'
                                rules={[
                                    { required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },

                                    {
                                        validator: async (_, value) => {
                                            if (value > Number(preDataFishSauceBill?.stock / 1.2)) {
                                                return Promise.reject(
                                                    new Error(`ค่าต้องไม่เกิน ${Number(preDataFishSauceBill?.stock / 1.2)}`),
                                                )
                                            }
                                        },
                                    },
                                ]}
                            >
                                {Number(preDataFishSauceBill?.stock) && (
                                    <StyledInputNumber
                                        // max={Number(preDataFishSauceBill.stock)}
                                        min={0}
                                        onChange={handleChangeLitToKGFishSauceWaterAddon}
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

    const stepsAmpan = [
        {
            title: 'เลือกบิลน้ำรถน้าอำพัน',
            content: (
                <StyledTable
                    columns={columnsAmpan}
                    dataSource={sourceDataAmpan}
                    loading={getReceiveAmpanPaginationWithOutEmpty.loading}
                    onChange={handleChangePaginationAmpan}
                    pagination={{
                        total: totalListAmpan,
                        current: currentPageAmpan,
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
                            <>
                                Stock ที่มีอยู่ : {Number(preDataAmpanBill?.stock)} KG. ~ {Number(preDataAmpanBill?.stock / 1)} L
                            </>
                            <StyledFormItems
                                label='ปริมาตรน้ำรถน้าอำพันที่เติมเพิ่ม (L.)'
                                name='volume'
                                rules={[
                                    { required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },

                                    {
                                        validator: async (_, value) => {
                                            if (value > Number(preDataAmpanBill?.stock / 1)) {
                                                return Promise.reject(
                                                    new Error(`ค่าต้องไม่เกิน ${Number(preDataAmpanBill?.stock / 1)}`),
                                                )
                                            }
                                        },
                                    },
                                ]}
                            >
                                {Number(preDataAmpanBill?.stock) && (
                                    <StyledInputNumber min={0} onChange={handleChangeLitToKG} size='large' />
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

    const stepFishy = [
        {
            title: 'เลือกบิลน้ำรถน้าตาว',
            content: (
                <StyledTable
                    columns={columnsFishy}
                    dataSource={sourceDataFishy}
                    loading={getReceiveFishyPaginationWithOutEmpty.loading}
                    onChange={handleChangePaginationFishy}
                    pagination={{
                        total: totalListFishy,
                        current: currentPageFishy,
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
                            <>
                                Stock ที่มีอยู่ : {Number(preDataFishyBill?.stock)} KG. ~ {Number(preDataFishyBill?.stock / 1.2)}{' '}
                                L
                            </>
                            <StyledFormItems
                                label='ปริมาตรน้ำคาวที่เติมเพิ่ม (L.)'
                                name='volume'
                                rules={[
                                    { required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },

                                    {
                                        validator: async (_, value) => {
                                            if (value > Number(preDataFishyBill?.stock / 1.2)) {
                                                return Promise.reject(
                                                    new Error(`ค่าต้องไม่เกิน ${Number(preDataFishyBill?.stock / 1.2)}`),
                                                )
                                            }
                                        },
                                    },
                                ]}
                            >
                                {Number(preDataFishyBill?.stock) && (
                                    <StyledInputNumber min={0} onChange={handleChangeLitToKG} size='large' />
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
    const itemsStepsAmpan = stepsAmpan.map((item) => ({ key: item.title, title: item.title }))
    const itemsStepsFishy = stepFishy.map((item) => ({ key: item.title, title: item.title }))

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
            <StyledBoxHeader id='section-0'>
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
                                onOpenModalChangeVolums={setVisibleModalChangeVoume}
                                onSelected={handleSelectSubOrder}
                                openModalLabs={setVisibleModalSendToLabs}
                                setIdRef={setIdSuborderToLabs}
                                setSubIdRef={setIdSubOrderChangeVolume}
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
                            setModeMulti(false)
                            showDrawer()
                            setTypeTransfer(TypeProcess.TRANSFER)
                            setSellingStatus(false)
                        }}
                        type='primary'
                    >
                        ปล่อยน้ำปลา
                    </StyledButtonAction>
                    <StyledButtonAction
                        onClick={() => {
                            setListBuildingTransfser([
                                { building: null, puddle_id: [], selectedPuddle: null, serialPuddle: null },
                            ])
                            setItemsTransfer(0)
                            setModeMulti(true)
                            // showDrawer()
                        }}
                        type='primary'
                    >
                        ปล่อยน้ำปลาแบบหลายบ่อ
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
                            setVisibleModalHitWaterFish(true)
                            // setItemsTransfer(1)
                            // showDrawer()
                        }}
                        type='primary'
                    >
                        เติมน้ำรถน้าอำพัน
                    </StyledButtonAction>
                    <StyledButtonAction
                        onClick={() => {
                            setVisibleModalWaterFish(true)
                            // setItemsTransfer(1)
                            // showDrawer()
                        }}
                        type='primary'
                    >
                        เติมน้ำคาว
                    </StyledButtonAction>
                    <StyledButtonAction
                        onClick={() => {
                            setItemsTransfer(1)
                            setTitleDrawerTransfer('ปล่อยน้ำเกลือ')
                            showDrawer()
                            setSellingStatus(false)
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
                    <StyledButtonAction
                        onClick={() => {
                            setModalMixing(true)
                            // setItemsTransfer(1)
                            // showDrawer()
                        }}
                        type='primary'
                    >
                        ผสม
                    </StyledButtonAction>
                    <StyledButtonAction
                        onClick={() => {
                            setItemsTransfer(0)
                            setTitleDrawerTransfer('ขึ้นตู้')
                            setSellingStatus(true)
                            setModeMulti(false)
                            showDrawer()
                            setTypeTransfer(TypeProcess.SELLING)
                            // setVisibleModalSelling(true)
                        }}
                        type='primary'
                    >
                        ขึ้นตู้
                        {/* setTypeTransfer */}
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

            <Divider />
            <StyledBoxContent id='section-1'>
                <span>การทำรายการทั้งหมดทั้งหมด</span>
                <br />
                <TableHistoryOrders
                    data={getAllOrdersFromPuddleId.data}
                    loading={getAllOrdersFromPuddleId.loading}
                    onSelectIdHistory={setIdHistory}
                    onVisibleModal={setVisibleHistoryOrder}
                />
            </StyledBoxContent>
            <ModalHistory
                centered
                footer={null}
                onCancel={() => {
                    setVisibleHistoryOrder(false)
                }}
                open={visibleHistoryOrder}
                title={`ประวัติรายการหมายเลข ${idHistory}`}
            >
                {getOrdersHistoryDetailFromId.data && (
                    <OrderLastedSection data={getOrdersHistoryDetailFromId.data} hideAction hideHeader />
                )}
            </ModalHistory>
            {/* Sidebar Transfer Fishsaurce */}
            <StyledDrawer bodyStyle={{ paddingBottom: 80 }} onClose={onClose} open={open} title={titleDrawerTransfer} width={720}>
                <Form autoComplete='off' form={form} layout='vertical' onFinish={handleSubmitTransfer}>
                    <TransferFishsauce
                        amountItemsKG={amountItemsKG}
                        buildingOption={getAllBuildings.data}
                        customer={getCustomerByBillTaskPagination.data?.data}
                        lastedOrder={orderDetailLasted}
                        listBuilding={listBuildingTransfser}
                        multi={modeMulti}
                        onChangeAmountItems={handleChangeAmountItems}
                        onChangeBuilding={handleChangeBuilding}
                        onChangeDate={onChangeDateTransfer}
                        onChangeMultiBuilding={onChangeBuildingByKeySelectTransfer}
                        onChangeMultiuddle={handleSelectMultiPuddleByKey}
                        onChangewwwwBuff={onChangewwww}
                        onSearchBuff={onSearch}
                        onSelectAction={handleSelectPuddle}
                        puddleOption={tragetPuddle}
                        selling={sellingStatus}
                        setMultiBuildingTransfser={setListBuildingTransfser}
                        typeProcess={getTypeProcess?.data}
                    />
                    <Button htmlType='submit' type='primary'>
                        ตกลง
                    </Button>
                </Form>
            </StyledDrawer>
            {/* Sidebar GetIn Fishsaurce */}
            <StyledDrawer bodyStyle={{ paddingBottom: 80 }} onClose={onCloseGetIn} open={openGetIN} title='รับเข้า' width={720}>
                <Form autoComplete='off' form={formGetIn} layout='vertical' onFinish={submitImportFishSaurce}>
                    <GetInFishsauce defaultDateAction={defaultDateActionGetIn} onChangeDate={onChangeDateTransfer} />
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
                        selling={sellingStatus}
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
                    // setSelectedIdProcess(null)
                }}
                onOk={handleUpdateDescProcess}
                open={visibleModalDescProcess}
                title={`suborder id : ${idSubOrdersTarget}`}
            >
                <div>
                    {/* <StyledContentModal>
                        <ul>
                            {getTypeProcess?.data?.map((data, index) => (
                                <li key={index}>{data.process_name}</li>
                            ))}
                        </ul>
                    </StyledContentModal> */}

                    <Input
                        onChange={(e) => {
                            setDescSuborder(e.target.value)
                        }}
                        placeholder='รายละเอียดเพิ่มเติม'
                        size='large'
                        style={{ color: 'black' }}
                    />

                    {/* setDescSuborder */}
                    {/* {idSubOrdersTarget && (
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
                    )} */}
                </div>
            </Modal>
            <Modal
                centered
                footer={null}
                onCancel={() => {
                    setVisibleModalAddOn(false)
                    setIdSubOrdersTarget(null)
                    // setSelectedIdProcess(null)
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
                        {currentStepSalt === stepsSalt.length - 1 && (
                            <Button htmlType='submit' type='primary'>
                                ยืนยัน
                            </Button>
                        )}
                        {currentStepSalt > 0 && (
                            <Button onClick={() => prev()} style={{ margin: '0 8px' }}>
                                ย้อนกลับ
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

            <Modal
                centered
                destroyOnClose
                footer={null}
                onCancel={() => {
                    setVisibleModalSendToLabs(false)
                }}
                open={visibleModalSendToLabs}
                title={`ส่งข้อมูลไปยังห้อง Labs`}
                width={600}
            >
                <>
                    <Form autoComplete='off' form={formSendToLabs} layout='vertical' onFinish={handleAddToLab}>
                        {/* Specific Chem */}

                        <StyledFormItems
                            label='Product name'
                            name='ProductName'
                            rules={[
                                {
                                    required: true,
                                    message: 'กรุณากรอกจำนวนให้ครบถ้วน',
                                },
                            ]}
                        >
                            <Input placeholder='ชื่อตัวอย่าง' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                        <StyledFormItems
                            label='เลือกสูตร'
                            name='idScfChem'
                            rules={[{ required: true, message: 'กรุณาเลือกสูตร' }]}
                        >
                            <Select placeholder='เลือกสูตร' size='large' style={{ width: '100%' }}>
                                {getSpecific?.data?.message &&
                                    getSpecific?.data?.message.map((data, index) => (
                                        <Option key={index} value={data.idPdSpecificChem}>
                                            <span>{data.name}</span>
                                        </Option>
                                    ))}
                            </Select>
                        </StyledFormItems>
                        <Checkbox.Group onChange={onChange} style={{ width: '100%', marginBottom: '24px' }}>
                            <Row gutter={[16, 8]}>
                                <Col span={8}>
                                    <Checkbox value='Tn'>Tn</Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox value='Salt'>Salt</Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox value='PH'>PH</Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox value='Histamine'>Histamine</Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox value='Tss'>Tss</Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox value='Aw'>Aw</Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox value='Spg'>Spg</Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox value='AN'>AN</Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox value='Acidity'>Acidity</Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox value='Viscosity'>Viscosity</Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox value='SaltMeter'>SaltMeter</Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox value='Color'>Color</Checkbox>
                                </Col>
                            </Row>
                        </Checkbox.Group>

                        <StyledFormItems label='Micro' name='Micro'>
                            <Checkbox onChange={onChangeMicro}>Micro</Checkbox>
                        </StyledFormItems>

                        <Button htmlType='submit' type='primary'>
                            Submit
                        </Button>
                    </Form>
                </>
            </Modal>

            <Modal
                centered
                destroyOnClose
                footer={null}
                onCancel={() => {
                    setVisibleModalWaterFish(false)
                    setIdSubOrdersTarget(null)
                    // setSelectedIdProcess(null)
                }}
                open={visibleModalWaterFish}
                title={`เติมน้ำคาว : ${getPuddleDetailById?.data?.lasted_order}`}
                width={990}
            >
                <StyledForm
                    autoComplete='off'
                    form={formFishy}
                    hideRequiredMark
                    layout='vertical'
                    name='formFishy'
                    onFinish={handleSubmitWaterFish}
                >
                    <Steps current={currentStepFishy} items={itemsStepsFishy} />
                    <StyledContentSteop>{stepFishy[currentStepFishy].content}</StyledContentSteop>
                    <div>
                        {currentStepFishy === stepFishy.length - 1 && (
                            <Button htmlType='submit' type='primary'>
                                ยืนยัน
                            </Button>
                        )}
                        {currentStepFishy > 0 && (
                            <Button onClick={() => prevFishy()} style={{ margin: '0 8px' }}>
                                ย้อนกลับ
                            </Button>
                        )}
                    </div>{' '}
                </StyledForm>
            </Modal>

            <Modal
                centered
                destroyOnClose
                footer={null}
                onCancel={() => {
                    setVisibleModalHitWaterFish(false)
                    setIdSubOrdersTarget(null)
                    // setSelectedIdProcess(null)
                }}
                open={visibleModalHitWaterFish}
                title={`เติมน้ำรถน้าอำพัน : ${getPuddleDetailById?.data?.lasted_order}`}
                width={990}
            >
                <StyledForm
                    autoComplete='off'
                    form={formHitWater}
                    hideRequiredMark
                    layout='vertical'
                    name='formHitWater'
                    onFinish={handleSubmitHitWater}
                >
                    <Steps current={currentStepAmpan} items={itemsStepsAmpan} />
                    <StyledContentSteop>{stepsAmpan[currentStepAmpan].content}</StyledContentSteop>
                    <div>
                        {currentStepAmpan === stepsAmpan.length - 1 && (
                            <Button htmlType='submit' type='primary'>
                                ยืนยัน
                            </Button>
                        )}
                        {currentStepAmpan > 0 && (
                            <Button onClick={() => prevAmpan()} style={{ margin: '0 8px' }}>
                                ย้อนกลับ
                            </Button>
                        )}
                    </div>{' '}
                </StyledForm>
            </Modal>
            {/* itemsStepsAmpan */}
            <Modal
                centered
                destroyOnClose
                footer={null}
                onCancel={() => {
                    setVisibleModalAddOnFishSauce(false)
                    setIdSubOrdersTarget(null)
                    // setSelectedIdProcess(null)
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
            {/* modalMultiTransfer */}
            <Modal
                bodyStyle={{ height: '100%' }}
                centered
                destroyOnClose
                footer={null}
                onCancel={() => {
                    setModeMulti(false)
                }}
                // onOk={() => {
                //     handleSubMitMixed()
                // }}
                open={modeMulti}
                title='ปล่อยแบบหลายบ่อ'
                width={990}
            >
                <ModalContent>
                    <>
                        {listBuildingTransfser.map((data, indexList) => (
                            <div
                                key={indexList}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: '16px',
                                    marginBottom: '16px',
                                }}
                            >
                                <StyledFormItems
                                    label='เลือกอาคาร'
                                    name='id_building'
                                    rules={[{ required: false, message: 'กรุณาเลือกบ่อปลายทาง' }]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Select
                                        onChange={(e) => {
                                            onChangeBuildingByKeySelectTransfer(e, indexList)
                                        }}
                                        placeholder='เลือกอาคาร'
                                        style={{ width: '100%' }}
                                    >
                                        {getAllBuildings.data &&
                                            getAllBuildings.data.map((data, index) => (
                                                <Option key={index} value={data.idbuilding}>
                                                    <span>{data.name}</span>
                                                </Option>
                                            ))}
                                    </Select>
                                </StyledFormItems>
                                <StyledFormItems
                                    label='เลือกบ่อปลายทาง'
                                    name='id_puddle'
                                    rules={[{ required: false, message: 'กรุณาเลือกบ่อปลายทาง' }]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Select
                                        filterOption={(input, option) => (option?.label.toString() ?? '').includes(input)}
                                        onChange={onChangewwww}
                                        onSearch={onSearch}
                                        onSelect={(labelValue) => {
                                            handleSelectMultiPuddleByKey(labelValue, indexList)
                                        }}
                                        optionFilterProp='children'
                                        options={listBuildingTransfser[indexList].puddle_id}
                                        placeholder='Select a person'
                                        showSearch
                                    />
                                </StyledFormItems>

                                <Button
                                    onClick={() => {
                                        setListBuildingTransfser([
                                            ...listBuildingTransfser,
                                            {
                                                building: null,
                                                puddle_id: [],
                                                selectedPuddle: null,
                                                serialPuddle: null,
                                            },
                                        ])
                                    }}
                                    type='primary'
                                >
                                    เพิ่ม
                                </Button>
                                {/* <Button
                                    onClick={() => {
                                        handleDeletePuddleWithMultiListPuddle(indexList)      
                                    }}
                                    type='ghost'
                                >
                                    ลบ
                                </Button> */}
                            </div>
                        ))}

                        <Form autoComplete='off' form={form} layout='vertical' onFinish={handleSubmitTransfer}>
                            <StyledFormItems
                                extra={`~ ${amountItemsKG} kg.`}
                                label='จำนวนที่ปล่อยออก L.'
                                name='volume'
                                rules={[
                                    {
                                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                                        required: true,
                                        message: 'กรุณากรอกจำนวนให้ครบถ้วน',
                                    },
                                ]}
                            >
                                <Input
                                    onChange={handleChangeAmountItems}
                                    placeholder='จำนวนที่ปล่อยออก'
                                    size='large'
                                    style={{ color: 'black' }}
                                />
                            </StyledFormItems>
                            <StyledFormItems
                                label='ปริมาตรที่เหลือ (kg.)'
                                name='remaining_volume'
                                rules={[
                                    {
                                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                                        required: true,
                                        message: 'กรุณากรอก ปริมาตรที่เหลือ (L.)',
                                    },
                                ]}
                            >
                                <Input disabled placeholder='ปริมาตรที่เหลือ (L.)' size='large' style={{ color: 'black' }} />
                            </StyledFormItems>
                            <StyledFormItems
                                label='ร้อยละที่ปล่อยออก'
                                name='amount_items'
                                rules={[
                                    {
                                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                                        required: true,
                                        message: 'กรุณากรอกจำนวนให้ครบถ้วน',
                                    },
                                ]}
                            >
                                <Input disabled placeholder='ร้อยละคงเหลือ' size='large' style={{ color: 'black' }} />
                            </StyledFormItems>
                            <StyledFormItems
                                label='ร้อยละคงเหลือ'
                                name='remaining_items'
                                rules={[
                                    {
                                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                                        required: true,
                                        message: 'กรุณากรอกจำนวนให้ครบถ้วน',
                                    },
                                ]}
                            >
                                <Input disabled placeholder='ร้อยละคงเหลือ' size='large' style={{ color: 'black' }} />
                            </StyledFormItems>
                            <StyledFormItems
                                label='ราคาต่อหน่วย ล่าสุด'
                                name='amount_unit_per_price'
                                rules={[
                                    {
                                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                                        required: true,
                                        message: 'กรุณากรอกจำนวนให้ครบถ้วน',
                                    },
                                ]}
                            >
                                <Input disabled placeholder='จำนวนคงเหลือ' size='large' style={{ color: 'black' }} />
                            </StyledFormItems>
                            <StyledFormItems
                                label='ราคาต่อหน่วย คงเหลือ'
                                name='remaining_unit_per_price'
                                rules={[
                                    {
                                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                                        required: true,
                                        message: 'กรุณากรอกจำนวนให้ครบถ้วน',
                                    },
                                ]}
                            >
                                <Input disabled placeholder='ราคาต่อหน่วย คงเหลือ' size='large' style={{ color: 'black' }} />
                            </StyledFormItems>
                            <StyledFormItems
                                label='มูลค่า'
                                name='amount_price'
                                rules={[
                                    {
                                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                                        required: true,
                                        message: 'กรุณากรอกจำนวนให้ครบถ้วน',
                                    },
                                ]}
                            >
                                <Input disabled placeholder='มูลค่า' size='large' style={{ color: 'black' }} />
                            </StyledFormItems>
                            <StyledFormItems
                                label='มูลค่า คงเหลือ'
                                name='remaining_price'
                                rules={[
                                    {
                                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                                        required: true,
                                        message: 'กรุณากรอกจำนวนให้ครบถ้วน',
                                    },
                                ]}
                            >
                                <Input disabled placeholder='มูลค่า คงเหลือ' size='large' style={{ color: 'black' }} />
                            </StyledFormItems>
                            <StyledFormItems label='เลือกรายการการทำงาน' name='process' rules={[{ required: false }]}>
                                <Select placeholder='เลือกรายการการทำงาน' style={{ width: '100%' }}>
                                    {getTypeProcess?.data &&
                                        getTypeProcess?.data.map((data, index) => (
                                            <Option key={index} value={data.idtype_process}>
                                                <span>{data?.process_name}</span>
                                            </Option>
                                        ))}
                                </Select>
                            </StyledFormItems>
                            <StyledFormItems
                                label='รอบ'
                                name='round'
                                rules={[
                                    {
                                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                                        required: false,
                                        message: 'กรุณากรอกจำนวนให้ครบถ้วน',
                                    },
                                ]}
                            >
                                <Input placeholder='จำนวนรอบ' size='large' style={{ color: 'black' }} />
                            </StyledFormItems>
                            <StyledFormItems
                                label='วันที่ทำรายการ'
                                name='date_action'
                                rules={[{ required: true, message: 'กรุณาระบุวันที่ทำรายการ' }]}
                            >
                                <DatePicker onChange={onChangeDateTransfer} style={{ width: '100%' }} />
                            </StyledFormItems>

                            <Button block htmlType='submit' type='primary'>
                                คกลง
                            </Button>
                        </Form>
                    </>
                </ModalContent>
            </Modal>
            {/* modalMixing */}
            <Modal
                bodyStyle={{ height: '100%' }}
                centered
                destroyOnClose
                onCancel={() => {
                    setModalMixing(false)
                }}
                onOk={() => {
                    handleSubMitMixed()
                }}
                open={modalMixing}
                title='ผสมน้ำปลา'
                width={990}
            >
                <ModalContent>
                    <>
                        <StyledFormItems
                            label='เลือก Process'
                            name='type_process'
                            rules={[{ required: false, message: 'กรุณาเลือก Process' }]}
                            style={{ width: '100%' }}
                        >
                            <Select
                                onChange={onChangeOptionProcess}
                                options={optionProcess}
                                placeholder='เลือก Process'
                                style={{ width: '100%' }}
                            />
                        </StyledFormItems>
                        {listSelectdItemsComponent.map((data, indexList) => (
                            <div
                                key={indexList}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: '16px',
                                    marginBottom: '16px',
                                }}
                            >
                                <StyledFormItems
                                    label='เลือกอาคาร'
                                    name='id_building'
                                    rules={[{ required: false, message: 'กรุณาเลือกบ่อปลายทาง' }]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Select
                                        onChange={(e) => {
                                            onChangeBuildingByKeySelect(e, indexList)
                                        }}
                                        placeholder='เลือกอาคาร'
                                        style={{ width: '100%' }}
                                    >
                                        {getAllBuildings.data &&
                                            getAllBuildings.data.map((data, index) => (
                                                <Option key={index} value={data.idbuilding}>
                                                    <span>{data.name}</span>
                                                </Option>
                                            ))}
                                    </Select>
                                </StyledFormItems>
                                <StyledFormItems
                                    label='เลือกบ่อปลายทาง'
                                    name='id_puddle'
                                    rules={[{ required: false, message: 'กรุณาเลือกบ่อปลายทาง' }]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Select
                                        filterOption={(input, option) => (option?.label.toString() ?? '').includes(input)}
                                        onChange={onChangewwww}
                                        onSearch={onSearch}
                                        onSelect={(labelValue) => {
                                            handleSelectPuddleByKey(labelValue, indexList)
                                        }}
                                        optionFilterProp='children'
                                        options={listSelectdItemsComponent[indexList].puddle_id}
                                        placeholder='Select a person'
                                        showSearch
                                    />
                                </StyledFormItems>

                                <Button
                                    onClick={() => {
                                        setListSelectdItemsComponent([
                                            ...listSelectdItemsComponent,
                                            {
                                                building: null,
                                                puddle_id: [],
                                                tx: [],
                                                selectedPuddle: null,
                                                vloumnTx: 0,
                                                volumnInput: 0,
                                                serialPuddle: null,
                                            },
                                        ])
                                        setCalTxVolumn([...calTxVolumn, { vloumnTx: 0 }])
                                    }}
                                    type='dashed'
                                >
                                    เพิ่ม
                                </Button>
                                {/* */}
                            </div>
                        ))}
                        Calculate :
                        <StyledContentMixing>
                            <table id='customers' style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 1em' }}>
                                <tr style={{ marginBottom: '16px', textAlign: 'right' }}>
                                    <th>บ่อ</th>
                                    <th>TN</th>
                                    <th>ปริมาตร</th>
                                    <th>ผลคูณ</th>
                                    <th>action</th>
                                </tr>
                                {listSelectdItemsComponent.map((data, index) => (
                                    <tr key={index} style={{ marginBottom: '16px', textAlign: 'right' }}>
                                        <td>{data.serialPuddle}</td>
                                        <td>{data?.tx[0]?.tn}</td>
                                        <td>
                                            <Input
                                                onChange={(e) => {
                                                    handleChangeVolumnMixing(e.target.value, index)
                                                }}
                                                style={{ width: '60%' }}
                                            />
                                        </td>
                                        <td>{listSelectdItemsComponent[index]?.vloumnTx}</td>
                                        <td>
                                            <Button
                                                onClick={() => {
                                                    setTriggerCal(!triggerCal)
                                                    handleSummaryMixingTN()
                                                }}
                                                type='primary'
                                            >
                                                คำนวน
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                <tr style={{ marginBottom: '16px', textAlign: 'right' }}>
                                    <td></td>
                                    <td>{sumCalculatedTxVolumn}</td>

                                    <td>
                                        {listSelectdItemsComponent
                                            .map((order) => order.volumnInput)
                                            .reduce((prev, curr) => {
                                                return prev + curr
                                            })}
                                    </td>
                                    <td></td>
                                    <td>
                                        {' '}
                                        <Button
                                            onClick={() => {
                                                setTriggerCal(!triggerCal)
                                                handleSummaryMixingTN()
                                            }}
                                            type='primary'
                                        >
                                            คำนวน
                                        </Button>
                                    </td>
                                </tr>
                            </table>
                            <StyledFormItems
                                label='วันที่ทำรายการ'
                                name='date_action'
                                rules={[{ required: true, message: 'กรุณาระบุวันที่ทำรายการ' }]}
                            >
                                <DatePicker onChange={onChangeDateTransfer} style={{ width: '100%' }} />
                            </StyledFormItems>
                            {/* {JSON.stringify(listSelectdItemsComponent[0]?.vloumnTx)} */}
                        </StyledContentMixing>
                    </>
                </ModalContent>
            </Modal>
            <Modal
                centered
                destroyOnClose
                onCancel={() => {
                    setVisibleModalSelling(false)
                }}
                open={visibleModalSelling}
                title={'นำออกไปขึ้นตู้'}
            >
                <ModalContent>
                    <Form autoComplete='off' form={formSelling} layout='vertical' onFinish={handleSubmitTransfer}>
                        <StyledFormItems
                            extra={`~ ${amountItemsKG} kg.`}
                            label='จำนวนที่ปล่อยออก L.'
                            name='volume'
                            rules={[
                                {
                                    pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                                    required: true,
                                    message: 'กรุณากรอกจำนวนให้ครบถ้วน',
                                },
                            ]}
                        >
                            <Input
                                onChange={handleChangeAmountItems}
                                placeholder='จำนวนที่ปล่อยออก'
                                size='large'
                                style={{ color: 'black' }}
                            />
                        </StyledFormItems>
                    </Form>
                </ModalContent>
            </Modal>

            <Modal
                centered
                destroyOnClose
                onCancel={() => {
                    setVisibleModalChangeVoume(false)
                }}
                onOk={handleSubmitChangeVolume}
                open={visibleModalChangeVoume}
                title={`แก้ไขค่าปริมาตรหมายเลข Transaction ที่ : ${idSubOrderChangeVolume}`}
            >
                <ModalContent>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '24px' }}>
                        <InputNumber
                            max={1000000}
                            min={0}
                            onChange={(e) => {
                                setValueVolumeChanged(e)
                            }}
                            placeholder='กรุณาระบุค่าปริมาตรที่ต้องการจะเปลี่ยน (KG)'
                            step={0.1}
                            style={{ width: '100%' }}
                            value={valueVolumeChanged}
                        />
                    </div>
                </ModalContent>
            </Modal>
            <FloatButton.Group icon={<BranchesOutlined />} style={{ right: 24 }} trigger='click' type='primary'>
                {Boolean(building?.length) &&
                    building.map((data, index) => (
                        <FloatButton
                            description={data.name}
                            key={index}
                            onClick={() => {
                                navigation.navigateTo.allPuddle(data.idbuilding.toString())
                            }}
                        />
                    ))}
            </FloatButton.Group>
            <FloatButton.Group icon={<VerticalAlignMiddleOutlined />} style={{ left: 24 }} trigger='click' type='primary'>
                <FloatButton
                    href='#section-0'
                    icon={<UpCircleFilled />}
                    key={1}
                    onClick={handleScroll}
                    // onClick={() => {
                    //     navigation.navigateTo.allPuddle(data.idbuilding.toString())
                    // }}
                />
                <FloatButton
                    href='#section-1'
                    icon={<DownCircleFilled />}
                    key={2}
                    onClick={handleScroll}
                    // onClick={() => {
                    //     navigation.navigateTo.allPuddle(data.idbuilding.toString())
                    // }}
                />
            </FloatButton.Group>
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

const ModalHistory = styled(Modal)`
    width: fit-content !important;
`
// const StyledTitleBetween = styled.div`
//     width: 100%;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     font-size: 14px;
// `
const StyledContentMixing = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
`
const StyledInputNumber = styled(InputNumber)`
    width: 100%;
    .ant-input-number-handler-wrap {
        display: none;
    }
`
// const RowChem = styled.div`
//     display: flex;
//     gap: 8px;
// `
// const BoxChem = styled.div`
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     border-radius: 2px;
//     min-width: 150px;
//     height: 50px;
//     background: #51459e98;
//     color: white;
//     padding: 8px;
// `

// const StyledGlassBox = styled.div`
//     background: rgba(255, 255, 255, 1);
//     border-radius: 8px;
//     box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
//     backdrop-filter: blur(5.3px);
//     -webkit-backdrop-filter: blur(5.3px);
//     width: 100%;
//     padding: 10px 20px;
//     cursor: pointer;
// `

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
