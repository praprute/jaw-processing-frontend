import { Layout, Form } from 'antd'
import { ReactElement, useEffect } from 'react'
import { LeftOutlined } from '@ant-design/icons'
import styled from 'styled-components'

import AppLayout from '../../components/Layouts'
import { createReceiveWeightFishTask } from '../../share-module/FishWeightBill/task'
import { NextPageWithLayout } from '../_app'
import { useNavigation } from '../../utils/use-navigation'
import CreateFishWeightBox from '../../components/ReceiveFishWeightBill/CreateBox'
import { NoticeError, NoticeSuccess } from '../../utils/noticeStatus'
import { getListFishTypeTask } from '../../share-module/order/task'

const { Content } = Layout

const CreateFishWeightPage: NextPageWithLayout = () => {
    const [form] = Form.useForm()
    const navigation = useNavigation()

    const createReceiveWeightFish = createReceiveWeightFishTask.useTask()
    const getListFishType = getListFishTypeTask.useTask()

    useEffect(() => {
        ;(async () => {
            await getListFishType.onRequest()
        })()
    }, [])

    const handleChangeValue = (changedValues: any, allValues: any) => {
        form.setFieldsValue({
            amount_price: Number(allValues.price_per_weigh) * Number(allValues.weigh_net),
        })
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
                    <CreateFishWeightBox listFish={getListFishType.data} />
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

// const StyledTable = styled(Table)`
//     width: 100%;
//     .ant-table-thead .ant-table-cell {
//         font-weight: 400;
//     }
// `

const StyledForm = styled(Form)`
    width: 100%;
    display: flex;
    justify-content: center;
`

// const Container = styled.div`
//     width: 100%;
//     max-width: 1280px;
// `

// const ContentFillter = styled.div`
//     padding: 20px;
// `
// const HeaderFillterBox = styled.div`
//     width: 100%;
//     background: rgb(26, 28, 33);
//     padding: 12px;
//     color: white;
//     border-radius: 8px 8px 0px 0px;
//     font-size: 18px;
//     font-weight: 500;
// `

// const SectionTable = styled.div`
//     width: 100%;
//     display: flex;
//     justify-content: center;
//     overflow-x: scroll;
// `
const SectionFillter = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
`
// const BoxFillter = styled.div`
//     width: 100%;
//     border-radius: 8px;
//     max-width: 990px;
//     background: white; //#f7f8f9;
//     box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
// `
