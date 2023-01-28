import { LeftOutlined } from '@ant-design/icons'
import { Layout, Row, Col, Form, Input, Select, Button } from 'antd'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import AppLayout from '../../../components/Layouts'
import ModalLoading from '../../../components/Modal/ModalLoading'
import { createOrderTask } from '../../../share-module/order/task'
import { NoticeError, NoticeSuccess } from '../../../utils/noticeStatus'
import { parseFloat2Decimals } from '../../../utils/parseFloat'
import { TypeOrderPuddle } from '../../../utils/type_puddle'
import { useNavigation } from '../../../utils/use-navigation'
import { NextPageWithLayout } from '../../_app'

const { Content } = Layout

const CreateOrderPage: NextPageWithLayout = () => {
    const router = useRouter()
    const navigation = useNavigation()
    const [form] = Form.useForm()
    const { puddle_address, id } = router.query
    const [statusPuddleOrder, setStatusPuddleOrder] = useState(1)
    const [valuePrice, setValuePrice] = useState({
        fish_price: 0,
        salt_price: 0,
        laber_price: 0,
    })
    const [visible, setVisible] = useState(false)

    const createOrder = createOrderTask.useTask()

    const MAX_ITEMS_PERCENTAGE = 100

    const TYPE_ORDER = [
        {
            value: TypeOrderPuddle.FERMENT,
            label: 'บ่อหมัก',
        },
        {
            value: TypeOrderPuddle.CIRCULAR,
            label: 'บ่อเวียน',
        },
    ]

    const summaryPricePerUnit = useMemo(() => {
        const valueForm = form.getFieldsValue(['fish_price', 'salt_price', 'laber_price'])
        return (
            (Number(valueForm.fish_price) + Number(valueForm.salt_price) + Number(valueForm.laber_price)) / MAX_ITEMS_PERCENTAGE
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
        if (statusPuddleOrder === TypeOrderPuddle.CIRCULAR) {
            form.setFieldsValue({
                fish: 0,
                fish_price: 0,
                salt: 0,
                salt_price: 0,
                laber: 0,
                laber_price: 0,
                volume: 0,
                price_per_unit: 0,
                description: 'บ่อเวียน',
            })
        }
    }, [statusPuddleOrder])

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
                description: form.getFieldValue('description'),
                volume: parseFloat2Decimals(form.getFieldValue('volume')),
                fish_price: parseFloat2Decimals(form.getFieldValue('fish_price')),
                salt_price: parseFloat2Decimals(form.getFieldValue('salt_price')),
                laber_price: parseFloat2Decimals(form.getFieldValue('laber_price')),
                amount_items: statusPuddleOrder === TypeOrderPuddle.FERMENT ? MAX_ITEMS_PERCENTAGE : 0,
            }
            const result = await createOrder.onRequest(payload)

            if (result === 'success') {
                NoticeSuccess('ทำรายการสำเร็จ')
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
                                    <Input placeholder='จำนวนปลา' size='large' style={{ color: 'black' }} />
                                </StyledFormItems>
                            </Col>
                            <Col md={12} span={12} xs={24}>
                                <StyledFormItems
                                    label='มูลค่าปลา'
                                    name='fish_price'
                                    rules={[{ required: true, message: 'กรุณาเลือกประเภทบ่อ' }]}
                                >
                                    <Input
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
                                <StyledFormItems
                                    label='ปริมาตรตั้งต้น'
                                    name='volume'
                                    rules={[{ required: true, message: 'กรุณากรอกปริมาตรตั้งต้น' }]}
                                >
                                    <Input placeholder='ปริมาตรตั้งต้น' size='large' style={{ color: 'black' }} />
                                </StyledFormItems>
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
            <ModalLoading
                onClose={() => {
                    setVisible(false)
                }}
                visible={visible}
            />
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
