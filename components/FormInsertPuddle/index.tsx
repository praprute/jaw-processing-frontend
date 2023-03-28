import { Col, Form, Input, Row, Tag } from 'antd'
import styled from 'styled-components'

const FormInsertPuddle = () => {
    return (
        <>
            <Row gutter={16}>
                <Col span={12} xs={24}>
                    <Form.Item
                        label='หมายเลขอาคาร'
                        name='building_id'
                        rules={[{ required: true, message: 'Please enter building_id' }]}
                    >
                        <Input disabled placeholder='หมายเลขอาคาร' style={{ color: 'black' }} />
                    </Form.Item>
                </Col>
                <Col span={12} xs={24}>
                    <Form.Item label='หมายเลขบ่อ' name='serial'>
                        <Input placeholder='หมายเลขบ่อ' style={{ color: 'black' }} />
                    </Form.Item>
                </Col>
                <Col span={12} xs={24}>
                    <Form.Item
                        label='วันที่ลงทะเบียน'
                        name='date_create'
                        rules={[{ required: true, message: 'Please enter date_create' }]}
                    >
                        <Input disabled placeholder='วันที่ลงทะเบียน' style={{ color: 'black' }} />
                    </Form.Item>
                </Col>
                <Col span={12} xs={24}>
                    <span>สถานะตั้งต้น</span>
                    <br />
                    <StyledTag color='#2db7f5'>สถานะว่าง</StyledTag>
                </Col>
            </Row>
        </>
    )
}

export default FormInsertPuddle

const StyledTag = styled(Tag)`
    border-radius: 12px;
    font-size: 12px;
    padding: 0px 15px;
`
