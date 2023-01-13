import { Col, Form, Input, Row, Tag } from 'antd'
import styled from 'styled-components'

// import { react } from 'react'
const FormInsertPuddle = () => {
  return (
    <>
      <Row gutter={16}>
        <Col span={12} xs={24}>
          <Form.Item name="building_id" label="หมายเลขอาคาร" rules={[{ required: true, message: 'Please enter building_id' }]}>
            <Input disabled style={{ color: 'black' }} placeholder="หมายเลขอาคาร" />
          </Form.Item>
        </Col>
        <Col span={12} xs={24}>
          <Form.Item name="date_create" label="วันที่ลงทะเบียน" rules={[{ required: true, message: 'Please enter date_create' }]}>
            <Input disabled style={{ color: 'black' }} placeholder="วันที่ลงทะเบียน" />
          </Form.Item>
        </Col>
        <Col span={12} xs={24}>
          <span>สถานะตั้งต้น</span>
          <br />
          <StyledTag color="#2db7f5">สถานะว่าง</StyledTag>
        </Col>
      </Row>
    </>
  )
}

export default FormInsertPuddle

export const StyledTag = styled(Tag)`
  border-radius: 12px;
  font-size: 12px;
  padding: 0px 15px;
`
