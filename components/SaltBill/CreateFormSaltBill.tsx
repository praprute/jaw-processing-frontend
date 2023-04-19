import { Col, Input, Row, Form, Button, DatePicker } from 'antd'
import styled from 'styled-components'

const config = {
    rules: [{ type: 'object' as const, required: true, message: 'Please select time!' }],
}

const CreateSaltBillBox = () => {
    return (
        <BoxFillter>
            <HeaderFillterBox>ลงทะเบียนบิลเกลือ</HeaderFillterBox>
            <ContentFillter>
                <Row gutter={[16, 8]}>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems
                            label='ลำดับที่'
                            name='no'
                            rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
                        >
                            <Input placeholder='ลำดับที่' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>

                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems
                            label='น้ำหนักสุทธิ'
                            name='weigh_net'
                            rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
                        >
                            <Input placeholder='น้ำหนักสุทธิ' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems
                            label='ราคา / กก.'
                            name='price_per_weigh'
                            rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
                        >
                            <Input placeholder='ราคา / กก.' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems
                            label='ราคารวม'
                            name='price_net'
                            rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
                        >
                            <Input placeholder='ราคารวม' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>

                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems
                            label='ชื่อลูกค้า'
                            name='customer'
                            rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
                        >
                            <Input placeholder='ชื่อลูกค้า' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={12} sm={24} xs={24}>
                        <StyledFormItems
                            label='ชื่อสินค้า'
                            name='product_name'
                            rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
                        >
                            <Input placeholder='ชื่อสินค้า' size='large' style={{ color: 'black' }} />
                        </StyledFormItems>
                    </Col>

                    <Col md={24} sm={24} xs={24}>
                        <StyldeButtonSubmit type='primary' htmlType='submit'>
                            ลงทะเบียน
                        </StyldeButtonSubmit>
                    </Col>
                </Row>
            </ContentFillter>
        </BoxFillter>
    )
}

export default CreateSaltBillBox

const StyldeButtonSubmit = styled(Button)`
    width: 100%;
    height: 48px;
    font-size: 18px;
    font-weight: 500;
`

const StyledFormItemDatePicker = styled(Form.Item)`
    .ant-form-item-label > label {
        font-size: 18px;
        font-weight: normal;
    }
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
