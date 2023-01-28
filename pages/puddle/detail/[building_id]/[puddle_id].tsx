import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { Breadcrumb, Button, Divider, Drawer, Empty, Form, Input, Space, Spin } from 'antd'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import AppLayout from '../../../../components/Layouts'
import { NextPageWithLayout } from '../../../_app'
import { useNavigation } from '../../../../utils/use-navigation'
import { getPuddleByIdBuildingTask, getPuddleDetailByIdTask } from '../../../../share-module/building/task'
import BadgeStatus from '../../../../components/BadgeStatus'
import { getOrdersDetailFromIdTask, getAllOrdersFromPuddleIdTask, submitTransferTask } from '../../../../share-module/order/task'
import TableHistoryOrders from '../../../../components/Table/TableHistoryOrders'
import OrderLastedSection from '../../../../components/OrderLasted'
import TransferFishsauce from '../../../../components/FormTransfer/TransferFishsauce'
import { NoticeError, NoticeSuccess } from '../../../../utils/noticeStatus'
import { parseFloat2Decimals } from '../../../../utils/parseFloat'
import ModalLoading from '../../../../components/Modal/ModalLoading'
import { TypeProcess } from '../../../../utils/type_puddle'

const DetailPuddlePage: NextPageWithLayout = () => {
    const router = useRouter()
    const navigation = useNavigation()
    const { building_id, puddle_id } = router.query
    const [form] = Form.useForm()
    const [formGetIn] = Form.useForm()

    const [open, setOpen] = useState(false)
    const [openGetIN, setOpenGetIn] = useState(false)
    const [orderDetailLasted, setOrderDetailLasted] = useState(null)
    const [amountItemsKG, setAmountItemsKG] = useState(0)
    const [amountItemsPercent, setAmountItemsPercent] = useState(0)
    const [remainingItems, setRemainingItems] = useState(0)
    const [lastedPrice, setLastedPrice] = useState(0)
    const [lastedPerUnit, setLastedPerUnit] = useState(0)
    const [tragetPuddle, setTragetPuddle] = useState([])
    const [modalLoadingVisivble, setModalLoadingVisivble] = useState(false)
    const [trigger, setTrigger] = useState(false)

    const getPuddleDetailById = getPuddleDetailByIdTask.useTask()
    const getAllOrdersFromPuddleId = getAllOrdersFromPuddleIdTask.useTask()
    const getOrdersDetailFromId = getOrdersDetailFromIdTask.useTask()
    const getPuddleByIdBuilding = getPuddleByIdBuildingTask.useTask()
    const submitTransfer = submitTransferTask.useTask()

    useEffect(() => {
        if (!getPuddleByIdBuilding.data && building_id) {
            ;(async () => {
                const res = await getPuddleByIdBuilding.onRequest({ building_id: Number(building_id) })
                const fillterPuddle = res.filter((data) => data.idpuddle !== Number(puddle_id))
                setTragetPuddle(fillterPuddle)
            })()
        }
    }, [building_id, puddle_id, trigger])

    useEffect(() => {
        if (getOrdersDetailFromId?.data) {
            setOrderDetailLasted(getOrdersDetailFromId?.data[getOrdersDetailFromId?.data?.length - 1])
        }
    }, [getOrdersDetailFromId?.data, trigger])

    useEffect(() => {
        ;(async () => {
            if (puddle_id) {
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
                })
            }
        })()
    }, [puddle_id, trigger])

    useMemo(() => {
        form.setFieldsValue({
            amount_price: parseFloat2Decimals((amountItemsPercent * lastedPerUnit).toString()),
            remaining_price: lastedPrice - parseFloat2Decimals((amountItemsPercent * lastedPerUnit).toString()),
        })
    }, [lastedPrice, lastedPerUnit, amountItemsPercent, trigger])

    const handleChangeAmountItems = (e: React.ChangeEvent<HTMLInputElement>) => {
        let volumn = form.getFieldValue('volume_start')
        let volumnTransfer = Number(e.target.value) * 1.2
        let amount_item = ((volumnTransfer * remainingItems) / volumn).toFixed(2)
        setAmountItemsKG(Number(e.target.value) * 1.2)
        setAmountItemsPercent((volumnTransfer * remainingItems) / volumn)
        form.setFieldsValue({
            amount_items: parseFloat2Decimals(amount_item),
            remaining_items: remainingItems - parseFloat2Decimals(amount_item),
        })
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

    const handleSubmitTransfer = async () => {
        try {
            setModalLoadingVisivble(true)
            let payload = {
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
                id_puddle: form.getFieldValue('id_puddle'),
            }

            const result = await submitTransfer.onRequest(payload)
            if (result === 'success') {
                NoticeSuccess('ทำรายการสำเร็จ')
                onClose()
                setTrigger(!trigger)
            }
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setModalLoadingVisivble(false)
        }
    }

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
                <StyledBreadcrumbItem>รหัสบ่อ {puddle_id}</StyledBreadcrumbItem>
            </Breadcrumb>
            <StyledBoxHeader>
                <StyledTitleBoxHeader>
                    <span>
                        บ่อหมายเลข {puddle_id} : {getPuddleDetailById.data?.uuid_puddle}
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
                            <OrderLastedSection data={getOrdersDetailFromId.data} />
                        )}
                    </>
                )}
                <StyledSectionAction>
                    <StyledButtonAction onClick={showDrawer} type='primary'>
                        ถ่ายออก
                    </StyledButtonAction>
                    <StyledButtonAction onClick={showDrawerGetIn} type='ghost'>
                        เติมเข้า
                    </StyledButtonAction>
                    <StyledButtonAction type='dashed'>ถ่ายกาก</StyledButtonAction>
                </StyledSectionAction>
            </StyledBoxContent>

            <Divider />
            <StyledBoxContent>
                <span>การทำรายการทั้งหมดทั้งหมด</span>
                <br />
                <TableHistoryOrders data={getAllOrdersFromPuddleId.data} loading={getAllOrdersFromPuddleId.loading} />
            </StyledBoxContent>

            <StyledDrawer bodyStyle={{ paddingBottom: 80 }} onClose={onClose} open={open} title='ถ่ายออก' width={720}>
                {' '}
                <Form autoComplete='off' form={form} layout='vertical' onFinish={handleSubmitTransfer}>
                    <TransferFishsauce
                        amountItemsKG={amountItemsKG}
                        lastedOrder={orderDetailLasted}
                        onChangeAmountItems={handleChangeAmountItems}
                        puddleOption={tragetPuddle}
                    />
                    <Button htmlType='submit' type='primary'>
                        Submit
                    </Button>
                </Form>
                {/* <FormInsertPuddle /> */}
            </StyledDrawer>

            <StyledDrawer
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={onCloseGetIn} style={{ color: '#FFFFFF' }} type='ghost'>
                            Cancel
                        </Button>
                    </Space>
                }
                onClose={onCloseGetIn}
                open={openGetIN}
                title='นำออก'
                width={720}
            >
                <Form autoComplete='off' form={formGetIn} layout='vertical'>
                    <Form.Item
                        label='หมายเลขอาคาร'
                        name='building_id_2'
                        rules={[{ required: true, message: 'Please enter building_id' }]}
                    >
                        <Input placeholder='หมายเลขอาคาร' style={{ color: 'black' }} />
                    </Form.Item>{' '}
                    <Button htmlType='submit' type='primary'>
                        Submit
                    </Button>
                </Form>
                {/* <FormInsertPuddle /> */}
            </StyledDrawer>

            <ModalLoading
                onClose={() => {
                    setModalLoadingVisivble(false)
                }}
                visible={modalLoadingVisivble}
            />
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
