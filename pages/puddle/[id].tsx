import React, { ReactElement, useEffect, useState } from 'react'
import { Breadcrumb, Button, Col, Drawer, Form, Row, Space, Spin } from 'antd'
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
import { TypeOrderPuddle } from '../../utils/type_puddle'

const PuddlePage: NextPageWithLayout = () => {
    const router = useRouter()
    const navigation = useNavigation()
    const [form] = Form.useForm()
    const { id } = router.query
    const [open, setOpen] = useState(false)
    const [tigger, setTigger] = useState(false)
    const [columnGrid, setColumnGrid] = useState(6)

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
            default:
                break
        }
    }

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
                                                isStatus={data.status}
                                                onClick={() => {
                                                    data.status !== 999 &&
                                                        navigation.navigateTo.detailPuddle(id as string, data.idpuddle.toString())
                                                }}
                                            >
                                                <StyledTitleBetween>
                                                    <span>{data?.serial}</span>
                                                    <span>
                                                        {data.status !== 999 && dayjs(data.update_time).format('DD/MM/YYYY')}{' '}
                                                    </span>
                                                    <span>{mapStatusPuddle(data.status)}</span>
                                                    {/* <span>{data.description}</span> */}
                                                </StyledTitleBetween>
                                            </StyledGlassBox>
                                        </Col>
                                    ))}
                            </Row>
                        ) : (
                            <WrapGridCustom>
                                {Boolean(getPuddleByIdBuilding?.data?.length) &&
                                    getPuddleByIdBuilding?.data?.map((data, index) => (
                                        <StyledGlassBox
                                            isStatus={data.status}
                                            key={index}
                                            onClick={() => {
                                                data.status !== 999 &&
                                                    navigation.navigateTo.detailPuddle(id as string, data.idpuddle.toString())
                                            }}
                                        >
                                            <StyledTitleBetween>
                                                <span>{data?.serial}</span>
                                                <span>
                                                    {data.status !== 999 && dayjs(data.update_time).format('DD/MM/YYYY')}{' '}
                                                </span>
                                                <span>{mapStatusPuddle(data.status)}</span>
                                                {/* <span>{data.description}</span> */}
                                            </StyledTitleBetween>
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
                        <Button onClick={onClose} style={{ color: '#FFFFFF' }} type='ghost'>
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
const StyledGlassBox = styled.div<{ isStatus: number }>`
    ${(p) => {
        switch (p.isStatus) {
            case TypeOrderPuddle.FREE:
                return `background:#2db7f5;`
            case TypeOrderPuddle.FERMENT:
                return `background:#FC0F0f;`
            case TypeOrderPuddle.CIRCULAR:
                return `background:#FDD298;`
            case TypeOrderPuddle.MIXING:
                return `background:#B49ADF;`
            case TypeOrderPuddle.FILTER:
                return `background:#94B2D6;`
            case TypeOrderPuddle.BREAK:
                return `background:#82AC64;`
        }
    }}
    border-radius: 0px;
    border: 0.1px solid #ffffff66;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5.3px);
    -webkit-backdrop-filter: blur(5.3px);
    width: 100%;
    padding: 10px 20px;
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
