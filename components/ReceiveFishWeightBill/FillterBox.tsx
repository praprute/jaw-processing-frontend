import { Col, Input, Row, Form, Button, DatePicker } from 'antd'
import styled from 'styled-components'
import { Dayjs } from 'dayjs'

interface IFillterBox {
    onChangeDate?: (value: Dayjs, dateString: string) => void
    onChangeDateEnd?: (value: Dayjs, dateString: string) => void
    onExport?: () => void
}
const FillterBox = (props: IFillterBox) => {
    const { onChangeDate, onChangeDateEnd, onExport } = props

    return (
        <BoxFillter>
            <HeaderFillterBox>เรียกดูใบชั่งปลา</HeaderFillterBox>
            <ContentFillter>
                <Row gutter={[16, 8]}>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems label='ลำดับที่' name='no'>
                            <Input placeholder='ลำดับที่' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems label='น้ำหนักสุทธิ' name='weigh_net'>
                            <Input placeholder='น้ำหนักสุทธิ' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems label='ทะเบียนรถ' name='vehicle_register'>
                            <Input placeholder='ทะเบียนรถ' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems label='ชื่อลูกค้า' name='customer_name'>
                            <Input placeholder='ชื่อลูกค้า' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems label='ชื่อสินค้า' name='product_name'>
                            <Input placeholder='ชื่อสินค้า' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems label='สถานที่จัดเก็บ' name='store_name'>
                            <Input placeholder='สถานที่จัดเก็บ' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={24} sm={24} xs={24}>
                        <StyledFormItems label='stock คงเหลือ' name='stock'>
                            <Input placeholder='stock คงเหลือ' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems
                            label='วันที่ทำรายการตั้งต้น'
                            name='date_start'
                            rules={[{ required: false, message: 'กรุณาระบุวันที่ทำรายการ' }]}
                        >
                            <DatePicker onChange={onChangeDate} style={{ width: '100%' }} />
                        </StyledFormItems>
                    </Col>{' '}
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems
                            label='วันที่ทำรายการสิ้นสุด'
                            name='date_end'
                            rules={[{ required: false, message: 'กรุณาระบุวันที่ทำรายการ' }]}
                        >
                            <DatePicker onChange={onChangeDateEnd} style={{ width: '100%' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={24} sm={24} xs={24}>
                        <Row gutter={[16, 16]}>
                            <Col md={20} sm={24} xs={24}>
                                {' '}
                                <StyldeButtonSubmit htmlType='submit' type='primary'>
                                    ค้นหา
                                </StyldeButtonSubmit>
                            </Col>
                            <Col md={4} sm={24} xs={24}>
                                {' '}
                                <StyldeButtonSubmit onClick={onExport}>EXPORT</StyldeButtonSubmit>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </ContentFillter>
        </BoxFillter>
    )
}

export default FillterBox

const StyldeButtonSubmit = styled(Button)`
    width: 100%;
    height: 48px;
    font-size: 18px;
    font-weight: 500;
`
const StyledFormItems = styled(Form.Item)`
    .ant-form-item-label > label {
        font-size: 18px;
        font-weight: normal;
    }
`

const ContentFillter = styled.div`
    padding: 20px;
`
const HeaderFillterBox = styled.div`
    width: 100%;
    background: linear-gradient(107.85deg, #51459e 0%, #00b2ff 160.5%);
    padding: 12px;
    color: white;
    border-radius: 8px 8px 0px 0px;
    font-size: 20px;
    font-weight: 500;
`

const BoxFillter = styled.div`
    width: 100%;
    border-radius: 8px;
    max-width: 1280px;
    background: white; //#f7f8f9;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`
