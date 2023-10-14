import { Col, Input, Row, Form, Button, DatePicker, Select } from 'antd'
import styled from 'styled-components'

import { ICustomerList } from '../../share-module/FishWeightBill/type'
const { Option } = Select

interface ICreateFishSauceBillBox {
    customerList: ICustomerList[]
    onChangeDate: (value: moment.Moment, dateString: string) => void
}

const CreateFishSauceBillBox = (props: ICreateFishSauceBillBox) => {
    const { customerList, onChangeDate } = props
    return (
        <BoxFillter>
            <HeaderFillterBox>ลงทะเบียนบิล</HeaderFillterBox>
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
                            label='ชื่อผู้จำหน่าย'
                            name='customer'
                            rules={[{ required: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }]}
                        >
                            <Select placeholder='ชื่อผู้จำหน่าย' size='large'>
                                {customerList &&
                                    customerList.map((data, index) => (
                                        <Option key={index} value={data.name}>
                                            {data.name}
                                        </Option>
                                    ))}
                            </Select>
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
                        <StyledFormItems
                            label='วันที่บิล'
                            name='date_action'
                            rules={[{ required: true, message: 'กรุณาระบุวันที่บิล' }]}
                        >
                            <DatePicker onChange={onChangeDate} style={{ width: '100%' }} />
                        </StyledFormItems>
                    </Col>
                    <Col md={24} sm={24} xs={24}>
                        <StyldeButtonSubmit htmlType='submit' type='primary'>
                            ลงทะเบียน
                        </StyldeButtonSubmit>
                    </Col>
                </Row>
            </ContentFillter>
        </BoxFillter>
    )
}

export default CreateFishSauceBillBox

const StyldeButtonSubmit = styled(Button)`
    width: 100%;
    height: 48px;
    font-size: 18px;
    font-weight: 500;
`

// const StyledFormItemDatePicker = styled(Form.Item)`
//     .ant-form-item-label > label {
//         font-size: 18px;
//         font-weight: normal;
//     }
// `
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
