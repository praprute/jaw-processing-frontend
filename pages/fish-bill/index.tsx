import { Form } from 'antd'
import { ReactElement } from 'react'
import styled from 'styled-components'
import AppLayout from '../../components/Layouts'
import FillterBox from '../../components/ReceiveFishWeightBill/FillterBox'
import { NextPageWithLayout } from '../_app'

const FishWeightReceivePage: NextPageWithLayout = () => {
    const [form] = Form.useForm()

    return (
        <>
            <SectionFillter>
                <StyledForm autoComplete='off' form={form} hideRequiredMark layout='vertical'>
                    <FillterBox />
                </StyledForm>
            </SectionFillter>
        </>
    )
}

FishWeightReceivePage.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>
            <>{page}</>
        </AppLayout>
    )
}

export default FishWeightReceivePage

const StyledForm = styled(Form)`
    width: 100%;
    display:flex;
    justify-content:center;
`

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

const SectionFillter = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`
// const BoxFillter = styled.div`
//     width: 100%;
//     border-radius: 8px;
//     max-width: 990px;
//     background: white; //#f7f8f9;
//     box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
// `


// no,
//       weigh_in,
//       weigh_out,
//       weigh_net,
//       time_in,
//       time_out,
//       vehicle_register,
//       customer_name,
//       product_name,
//       store_name,