import { Layout, Form } from 'antd'
import { ReactElement, useEffect, useState } from 'react'
import { LeftOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import type { DatePickerProps } from 'antd'

import AppLayout from '../../components/Layouts'
import { createReceiveWeightFishTask, getCustomerByBillTask } from '../../share-module/FishWeightBill/task'
import { NextPageWithLayout } from '../_app'
import { useNavigation } from '../../utils/use-navigation'
import CreateFishWeightBox from '../../components/ReceiveFishWeightBill/CreateBox'
import { NoticeError, NoticeSuccess } from '../../utils/noticeStatus'
import { getListFishTypeTask } from '../../share-module/order/task'
const { Content } = Layout

const CreateFishWeightPage: NextPageWithLayout = () => {
    const [form] = Form.useForm()
    const navigation = useNavigation()

    const [dateBill, setDateBill] = useState(null)

    const createReceiveWeightFish = createReceiveWeightFishTask.useTask()

    const getCustomerByBill = getCustomerByBillTask.useTask()
    const getListFishType = getListFishTypeTask.useTask()

    useEffect(() => {
        ;(async () => {
            await getListFishType.onRequest()
            await getCustomerByBill.onRequest({ type_bill: 2 })
        })()
    }, [])

    const handleChangeValue = (changedValues: any, allValues: any) => {
        form.setFieldsValue({
            amount_price: Number(allValues.price_per_weigh) * Number(allValues.weigh_net),
        })
    }

    const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
        setDateBill(dateString)
    }

    const handleSubmit = async (values: any) => {
        try {
            const payload = {
                no: values.no,
                weigh_net: Number(values.weigh_net),
                price_per_weigh: Number(values.price_per_weigh),
                amount_price: Number(values.amount_price),
                vehicle_register: values.vehicle_register,
                customer_name: values.customer_name,
                product_name: values.product_name,
                store_name: values.store_name,
                description: values.description,
                date_action: dateBill,
            }
            const res = await createReceiveWeightFish.onRequest(payload)
            if (res.success === 'success') {
                NoticeSuccess('ทำรายการสำเร็จ')
            }
        } catch (e: any) {
            console.error(e)
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        } finally {
            form.resetFields()
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
            <SectionFillter>
                <StyledForm
                    autoComplete='off'
                    form={form}
                    hideRequiredMark
                    layout='vertical'
                    name='create_fishWeight_bill'
                    onFinish={handleSubmit}
                    onValuesChange={handleChangeValue}
                >
                    <CreateFishWeightBox
                        customerList={getCustomerByBill.data}
                        listFish={getListFishType.data}
                        onChangeDate={onChangeDate}
                    />
                </StyledForm>
            </SectionFillter>
        </MainLayout>
    )
}

CreateFishWeightPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout hideSidebar isFullscreen>
            <>{page}</>
        </AppLayout>
    )
}

export default CreateFishWeightPage

const MainLayout = styled(Content)`
    width: 100%;
    max-width: 990px;
    padding: 24px 0px;
    display: flex;
    flex-direction: column;
`

const StyledBackPage = styled.span`
    cursor: pointer;
    width: fit-content;
`

const StyledForm = styled(Form)`
    width: 100%;
    display: flex;
    justify-content: center;
`

const SectionFillter = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
`
