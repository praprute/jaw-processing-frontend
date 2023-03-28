import { Col, Input, Row, Form, Button } from 'antd'
import styled from 'styled-components'

const FillterBox = () => {
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
                        <StyledFormItems label='น้ำหนักชั่งเข้า' name='weigh_in'>
                            <Input placeholder='น้ำหนักชั่งเข้า' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems label='น้ำหนักชั่งออก' name='weigh_out'>
                            <Input placeholder='น้ำหนักชั่งออก' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems label='น้ำหนักสุทธิ' name='weigh_net'>
                            <Input placeholder='น้ำหนักสุทธิ' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems label='เวลาเข้า' name='time_in'>
                            <Input placeholder='เวลาเข้า' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems label='เวลาออก' name='time_out'>
                            <Input placeholder='เวลาออก' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems label='ทะเบียนรถ' name='vehicle_register'>
                            <Input placeholder='ทะเบียนรถ' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems
                            label='ชื่อลูกค้า'
                            name='customer_name'
                            
                        >
                            <Input placeholder='ชื่อลูกค้า' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems
                            label='ชื่อสินค้า'
                            name='product_name'
                        >
                            <Input placeholder='ชื่อสินค้า' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems
                            label='สถานที่จัดเก็บ'
                            name='store_name'
                        >
                            <Input placeholder='สถานที่จัดเก็บ' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={24} sm={24} xs={24}>
                        <StyldeButtonSubmit type='primary'>ค้นหา</StyldeButtonSubmit>
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
    background: rgb(26, 28, 33);
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
