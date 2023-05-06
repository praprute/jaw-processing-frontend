import { Layout, Form } from 'antd'
import { ReactElement } from 'react'
import { LeftOutlined } from '@ant-design/icons'
import styled from 'styled-components'

import AppLayout from '../../components/Layouts'
import { createReceiveFishSauceTask } from '../../share-module/FishWeightBill/task'
import { NextPageWithLayout } from '../_app'
import { useNavigation } from '../../utils/use-navigation'
import { NoticeError, NoticeSuccess } from '../../utils/noticeStatus'
import CreateFishSauceBillBox from '../../components/FishSauceOutSide/CreateFormFishSauceBill'

const { Content } = Layout

const CreateFishSauceBillPage: NextPageWithLayout = () => {
    const [form] = Form.useForm()
    const navigation = useNavigation()

    const createReceiveFishSauce = createReceiveFishSauceTask.useTask()

    const handleSubmit = async (values: any) => {
        try {
            const payload = {
                no: values.no,
                weigh_net: Number(values.weigh_net),
                price_per_weigh: Number(values.price_per_weigh),
                price_net: Number(values.price_net),
                customer: values.customer,
                product_name: values.product_name,
            }
            const res = await createReceiveFishSauce.onRequest(payload)
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
                    name='create_salt_bill'
                    onFinish={handleSubmit}
                >
                    <CreateFishSauceBillBox />
                </StyledForm>
            </SectionFillter>
        </MainLayout>
    )
}

CreateFishSauceBillPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout hideSidebar isFullscreen>
            <>{page}</>
        </AppLayout>
    )
}

export default CreateFishSauceBillPage

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