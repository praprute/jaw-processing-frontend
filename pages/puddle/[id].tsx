import React, { ReactElement, useEffect, useState } from 'react'
import { Breadcrumb, Button, Col, Drawer, Form, Modal, Row, Space, Spin } from 'antd'
import Head from 'next/head'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

import { NextPageWithLayout } from '../_app'
import AppLayout from '../../components/Layouts'
import { createPuddleTask, getPuddleByIdBuildingTask } from '../../share-module/building/task'
import FormInsertPuddle from '../../components/FormInsertPuddle'
import { NoticeError, NoticeSuccess } from '../../utils/noticeStatus'
import { useNavigation } from '../../utils/use-navigation'
import { TypeOrderPuddle, TypeProcess } from '../../utils/type_puddle'

const PuddlePage: NextPageWithLayout = () => {
    const router = useRouter()
    const navigation = useNavigation()
    const [form] = Form.useForm()
    const { id } = router.query
    const [open, setOpen] = useState(false)
    const [tigger, setTigger] = useState(false)
    const [columnGrid, setColumnGrid] = useState(6)
    const [visable, setVisable] = useState(false)
    const [selectedPuddle, setSelectedPuddle] = useState(null)
    const [selectedSerialPuddle, setSelectedSerialPuddle] = useState(null)

    const getPuddleByIdBuilding = getPuddleByIdBuildingTask.useTask()
    const createPuddleRequest = createPuddleTask.useTask()

    useEffect(() => {
        ;(async () => {
            await getPuddleByIdBuilding.onRequest({ building_id: Number(id) })
        })()
    }, [id, tigger])

    useEffect(() => {
        id === '1' && setColumnGrid(6)
        id === '4' && setColumnGrid(12)
        id === '5' && setColumnGrid(12)
        id === '6' && setColumnGrid(12)
        id === '7' && setColumnGrid(8)
        id === '9' && setColumnGrid(4)
    }, [id])

    useEffect(() => {
        if (id) {
            form.setFieldsValue({
                building_id: Number(id),
                serial: '',
                date_create: dayjs(new Date()).format('DD/MM/YYYY'),
            })
        }
    }, [id])

    const handleSubmitCreatePuddle = async () => {
        try {
            let payload = {
                building_id: form.getFieldValue('building_id'),
                serial: form.getFieldValue('serial'),
            }

            const result = await createPuddleRequest.onRequest(payload)
            if (result.success === 'success') {
                setTigger(!tigger)
                NoticeSuccess('เพิ่มบ่อสำเร็จ')
            }
        } catch (err: any) {
            NoticeError('เพิ่มบ่อไม่สำเร็จ')
            setTigger(!tigger)
        } finally {
            onClose()
        }
    }

    const showDrawer = () => {
        setOpen(true)
    }

    const onClose = () => {
        setOpen(false)
    }

    const mapStatusPuddle = (status: number) => {
        switch (status) {
            case TypeOrderPuddle.FREE:
                return <span>ว่าง</span>
            case TypeOrderPuddle.FERMENT:
                return <span>หมักปลา</span>
            case TypeOrderPuddle.CIRCULAR:
                return <span>บ่อเวียน</span>
            case TypeOrderPuddle.MIXING:
                return <span>บ่อผสม</span>
            case TypeOrderPuddle.CLARIFIER:
                return <span>ถ่ายกาก</span>
            case TypeOrderPuddle.FILTER:
                return <span>บ่อกรอง</span>
            case TypeOrderPuddle.BREAK:
                return <span>บ่อพักใส</span>
            case TypeOrderPuddle.STOCK:
                return <span>บ่อพัก</span>
            case TypeOrderPuddle.REPELLENT:
                return <span>บ่อไล่น้ำสอง</span>
            case TypeOrderPuddle.HITMARK:
                return <span>บ่อตีกาก</span>
            case TypeOrderPuddle.MIXED:
                return <span>ดูดไปผสม</span>
            case TypeOrderPuddle.MIXEDPAUSE:
                return <span>ดูดมาพัก</span>
            default:
                break
        }
    }

    const handleTypeOrder = (type: number) => {
        switch (type) {
            case TypeProcess.FERMENT:
                return 'ลงปลา'
            case TypeProcess.TRANSFER:
                return 'ปล่อยน้ำปลาออก'
            case TypeProcess.IMPORT:
                return 'เติมน้ำปลา'
            case TypeProcess.CLEARING:
                return 'ถ่ายกาก'
            case TypeProcess.GETFISHRESIDUE:
                return 'รับกาก'
            case TypeProcess.CLEARINGALL:
                return 'ถ่ายกากทิ้ง'
            case TypeProcess.ADDONWATERSALT:
                return 'เติมน้ำเกลือ'
            case TypeProcess.ADDONFISHSAUCE:
                return 'เติมน้ำปลาที่อื่น'
            case TypeProcess.TRANSFERSALTWATER:
                return 'ปล่อยน้ำเกลือ'
            case TypeProcess.IMPORTSALTWATER:
                return 'เติมน้ำเกลือเข้าจากภายใน'
            case TypeProcess.IMPORTHITWATER:
                return 'เติมน้ำตีกาก'
            case TypeProcess.IMPORTWATERFISH:
                return 'เติมน้ำคาว'
            case TypeProcess.MIXING:
                return 'ดูดไปผสม'
            case TypeProcess.EMPTY:
                return 'บ่อว่าง'
            case TypeOrderPuddle.MIXEDPAUSE:
                return 'ดูดมาพัก'
            default:
                return ' '
                break
        }
    }

    //
    return (
        <>
            <Head>
                <title>Puddle | Jaw Management</title>
                <meta content='Jaw Management' name='description' />
                <meta content='width=device-width, initial-scale=1' name='viewport' />
                <link href='/favicon.ico' rel='icon' />
            </Head>
            <Breadcrumb style={{ margin: '16px 0', fontSize: '12px' }}>
                <StyledBreadcrumbItem>Process Menagement</StyledBreadcrumbItem>
                <StyledBreadcrumbItem
                    onClick={() => {
                        navigation.navigateTo.home()
                    }}
                >
                    อาคารทั้งหมด
                </StyledBreadcrumbItem>
                <StyledBreadcrumbItem>รหัสอาคาร {id}</StyledBreadcrumbItem>
            </Breadcrumb>
            <StyledBoxHeader>
                <span>รหัสอาคาร {id}</span>
                <StyledButton onClick={showDrawer} type='primary'>
                    ลงทะเบียนบ่อ
                </StyledButton>
            </StyledBoxHeader>
            <br />
            <SectionBoxAllPuddled>
                {getPuddleByIdBuilding.loading ? (
                    <StyledLoadingContent>
                        <Spin size='large' />
                    </StyledLoadingContent>
                ) : (
                    <>
                        {id !== '2' && id !== '3' && id !== '8' && id !== '10' ? (
                            <Row gutter={[0, 0]}>
                                {Boolean(getPuddleByIdBuilding?.data?.length) &&
                                    getPuddleByIdBuilding?.data?.map((data, index) => (
                                        <Col key={index} md={columnGrid} sm={24} span={12} xs={24}>
                                            <StyledGlassBox
                                                diff={Number(dayjs().diff(dayjs(data?.action_time), 'day'))}
                                                isStatus={data.type_process}
                                                onClick={() => {
                                                    if (data.status !== 999) {
                                                        setSelectedPuddle(data.idpuddle.toString())
                                                        setSelectedSerialPuddle(data.serial)
                                                        setVisable(true)
                                                    }
                                                }}
                                                style={{ backgroundColor: data.color }}
                                            >
                                                <StyledTitleBetween>
                                                    <span>{data?.serial}</span>
                                                    <span>
                                                        {data.status !== 999 && dayjs(data.update_time).format('DD/MM/YYYY')}{' '}
                                                    </span>
                                                    <span>{mapStatusPuddle(data.status)}</span>
                                                </StyledTitleBetween>{' '}
                                                <StyledTitleBetweenTag>
                                                    <span>{handleTypeOrder(data?.type_process)}</span>
                                                    <span>
                                                        {!!data?.action_time ? dayjs(data?.action_time).format('DD/MM/YYYY') : ''}
                                                    </span>
                                                    <span>รอบ {data?.round}</span>
                                                </StyledTitleBetweenTag>
                                                <StyledTitleBetween>
                                                    <span>
                                                        {!!data?.working_status_title
                                                            ? data?.working_status_title
                                                            : 'non process'}
                                                    </span>

                                                    {!!data?.action_time
                                                        ? `${dayjs().diff(dayjs(data?.action_time), 'day')} วัน`
                                                        : '0  วัน'}

                                                    {data?.topSalt === 1 ? (
                                                        <span>กลบเกลือแล้ว</span>
                                                    ) : (
                                                        <span>ยังไม่กลบเกลือ</span>
                                                    )}
                                                </StyledTitleBetween>
                                                {!!data?.description ? (
                                                    <StyledTitleBetween>des: {data?.description}</StyledTitleBetween>
                                                ) : (
                                                    <StyledTitleBetween>des: - </StyledTitleBetween>
                                                )}
                                            </StyledGlassBox>
                                        </Col>
                                    ))}
                            </Row>
                        ) : (
                            <WrapGridCustom>
                                {Boolean(getPuddleByIdBuilding?.data?.length) &&
                                    getPuddleByIdBuilding?.data?.map((data, index) => (
                                        <StyledGlassBox
                                            diff={Number(dayjs().diff(dayjs(data?.action_time), 'day'))}
                                            isStatus={data.type_process}
                                            key={index}
                                            onClick={() => {
                                                // data.status !== 999 &&
                                                //     setSelectedPuddle(data.idpuddle.toString() && setVisable(true))
                                                if (data.status !== 999) {
                                                    setSelectedPuddle(data.idpuddle.toString())
                                                    setSelectedSerialPuddle(data.serial)
                                                    setVisable(true)
                                                }
                                            }}
                                            style={{ backgroundColor: data.color }}
                                        >
                                            <StyledTitleBetween>
                                                <span>{data?.serial}</span>
                                                <span>
                                                    {data.status !== 999 && dayjs(data.update_time).format('DD/MM/YYYY')}{' '}
                                                </span>
                                                <span>{mapStatusPuddle(data.status)}</span>
                                            </StyledTitleBetween>{' '}
                                            <StyledTitleBetweenTag>
                                                <span>{handleTypeOrder(data?.type_process)}</span>
                                                <span>
                                                    {!!data?.action_time ? dayjs(data?.action_time).format('DD/MM/YYYY') : ''}
                                                </span>
                                                <span>รอบ {data?.round}</span>
                                            </StyledTitleBetweenTag>
                                            <StyledTitleBetween>
                                                <span>
                                                    {!!data?.working_status_title ? data?.working_status_title : 'non process'}
                                                </span>

                                                {!!data?.action_time
                                                    ? `${dayjs().diff(dayjs(data?.action_time), 'day')} วัน`
                                                    : '0  วัน'}
                                                {data?.topSalt === 1 ? <span>กลบเกลือแล้ว</span> : <span>ยังไม่กลบเกลือ</span>}
                                            </StyledTitleBetween>
                                            {!!data?.description ? (
                                                <StyledTitleBetween>des: {data?.description}</StyledTitleBetween>
                                            ) : (
                                                <StyledTitleBetween>des: - </StyledTitleBetween>
                                            )}
                                        </StyledGlassBox>
                                    ))}
                            </WrapGridCustom>
                        )}
                    </>
                )}
            </SectionBoxAllPuddled>

            <StyledDrawe
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={onClose} style={{ color: '#FFFFFF' }} type='dashed'>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitCreatePuddle} type='primary'>
                            Submit
                        </Button>
                    </Space>
                }
                onClose={onClose}
                open={open}
                title='เพิ่มบ่อ'
                width={720}
            >
                <Form autoComplete='off' form={form} hideRequiredMark layout='vertical'>
                    <FormInsertPuddle />
                </Form>
            </StyledDrawe>
            <Modal
                centered
                onCancel={() => {
                    setVisable(false)
                }}
                onOk={() => {
                    console.log('selectedPuddle.toString()  :', process.env.NEXT_PUBLIC_CANTAINER_SELLING_id)
                    if (selectedPuddle.toString() === process.env.NEXT_PUBLIC_CANTAINER_SELLING_id) {
                        navigation.navigateTo.sellingPage()
                        setVisable(false)
                    } else {
                        navigation.navigateTo.detailPuddle(id as string, selectedPuddle.toString())
                        setVisable(false)
                    }
                }}
                open={visable}
                title='กรุณาตรวจสอบ'
            >
                <p>คุณต้องการเข้าไปที่บ่อ {selectedSerialPuddle} ใช่หรือไม่</p>
            </Modal>
        </>
    )
}

PuddlePage.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>
            <>{page}</>
        </AppLayout>
    )
}

export default PuddlePage

const SectionBoxAllPuddled = styled.div`
    width: 100%;
    overflow-x: scroll;
`
const WrapGridCustom = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
`

const StyledBreadcrumbItem = styled(Breadcrumb.Item)`
    cursor: pointer;
`
const StyledLoadingContent = styled.div`
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    min-height: 50vh;
`
const StyledDrawe = styled(Drawer)`
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
const StyledButton = styled(Button)`
    border-radius: 4px;
`
const StyledTitleBetween = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
`

const StyledTitleBetweenTag = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    background-color: #51459e;
    color: #ffffff;
`
const StyledGlassBox = styled.div<{ isStatus: number; diff: number }>`
    ${(p) => {
        if (p.isStatus === null) {
            return ``
        }
        // if (p.isStatus === TypeProcess.FREE) {
        //     return `background:#2db7f5;`
        // }
        if (p.isStatus === TypeProcess.FERMENT && p.diff < 365) {
            return `background:#FC0F0f;`
        }

        if (p.isStatus === TypeProcess.FERMENT && p.diff >= 365) {
            return `background:#56E033;`
        }

        if (p.isStatus === TypeProcess.TRANSFER && p.diff >= 7) {
            return `background:#E78E19;`
        }
        if (p.isStatus === TypeProcess.TRANSFER && p.diff < 7) {
            return `background:#2db7f5;`
        }

        if (p.isStatus === TypeProcess.IMPORT && p.diff >= 90) {
            return `background:#BA5BE6;`
        }
        if (p.isStatus === TypeProcess.IMPORT && p.diff < 90) {
            return `background:#2db7f5;`
        }

        if (p.isStatus === TypeProcess.CLEARING) {
            return `background:#BA5BE6;`
        }
        if (p.isStatus === TypeProcess.GETFISHRESIDUE) {
            return `background:#BA5BE6;`
        }
        if (p.isStatus === TypeProcess.CLEARINGALL) {
            return `background:#BA5BE6;`
        }

        if (p.isStatus === TypeProcess.ADDONWATERSALT && p.diff >= 90) {
            return `background:#BA5BE6;`
        }
        if (p.isStatus === TypeProcess.ADDONWATERSALT && p.diff < 90) {
            return `background:#2db7f5;`
        }

        if (p.isStatus === TypeProcess.ADDONFISHSAUCE && p.diff >= 90) {
            return `background:#BA5BE6;`
        }
        if (p.isStatus === TypeProcess.ADDONFISHSAUCE && p.diff < 90) {
            return `background:#2db7f5;`
        }

        if (p.isStatus === TypeProcess.TRANSFERSALTWATER && p.diff >= 7) {
            return `background:#E78E19;`
        }
        if (p.isStatus === TypeProcess.TRANSFERSALTWATER && p.diff < 7) {
            return `background:#2db7f5;`
        }

        if (p.isStatus === TypeProcess.IMPORTSALTWATER && p.diff >= 90) {
            return `background:#BA5BE6;`
        }
        if (p.isStatus === TypeProcess.IMPORTSALTWATER && p.diff < 90) {
            return `background:#2db7f5;`
        }

        if (p.isStatus === TypeProcess.IMPORTHITWATER && p.diff >= 90) {
            return `background:#BA5BE6;`
        }
        if (p.isStatus === TypeProcess.IMPORTHITWATER && p.diff < 90) {
            return `background:#2db7f5;`
        }

        if (p.isStatus === TypeProcess.IMPORTWATERFISH && p.diff >= 180) {
            return `background:#BA5BE6;`
        }
        if (p.isStatus === TypeProcess.IMPORTWATERFISH && p.diff < 180) {
            return `background:#2db7f5;`
        }

        if (p.isStatus === TypeProcess.MIXING && p.diff >= 90) {
            return `background:#BA5BE6;`
        }
        if (p.isStatus === TypeProcess.MIXING && p.diff < 90) {
            return `background:#2db7f5;`
        }
        // switch (p.isStatus) {
        //     case TypeOrderPuddle.FREE:
        //         return `background:#2db7f5;`
        //     case TypeOrderPuddle.FERMENT && p.diff >= 365:
        //         return `background:#56E033;`
        //     case TypeOrderPuddle.FERMENT:
        //         return `background:#FC0F0f;`
        //     case TypeOrderPuddle.CIRCULAR:
        //         return `background:#FDD298;`
        //     case TypeOrderPuddle.MIXING:
        //         return `background:#B49ADF;`
        //     case TypeOrderPuddle.FILTER:
        //         return `background:#94B2D6;`
        //     case TypeOrderPuddle.BREAK:
        //         return `background:#82AC64;`
        //     case TypeOrderPuddle.REPELLENT:
        //         return `background:#35acc6;`
        //     case TypeOrderPuddle.HITMARK:
        //         return `background:#c68e62;`
        // }
    }}
    border-radius: 0px;
    border: 0.1px solid #ffffff66;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5.3px);
    -webkit-backdrop-filter: blur(5.3px);
    width: 100%;
    padding: 10px 10px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    min-height: 75px;
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
