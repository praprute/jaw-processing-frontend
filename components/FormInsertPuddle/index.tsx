import { Col, DatePicker, Form, Input, Row, Select } from 'antd'
const { Option } = Select
// import { react } from 'react'
const FormInsertPuddle = () => {
  return (
    <>
      <Row gutter={16}>
        <Col span={12} xs={24}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter user name' }]}>
            <Input style={{ color: 'black' }} placeholder="Please enter user name" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12} xs={24}>
          <Form.Item name="owner" label="Owner" rules={[{ required: true, message: 'Please select an owner' }]}>
            <Select style={{ color: 'black' }} placeholder="Please select an owner">
              <Option style={{ color: 'black' }} value="xiao">
                Xiaoxiao Fu
              </Option>
              <Option style={{ color: 'black' }} value="mao">
                Maomao Zhou
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12} xs={24}>
          <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please choose the type' }]}>
            <Select style={{ color: 'black' }} placeholder="Please choose the type">
              <Option value="private">Private</Option>
              <Option value="public">Public</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12} xs={24}>
          <Form.Item name="approver" label="Approver" rules={[{ required: true, message: 'Please choose the approver' }]}>
            <Select style={{ color: 'black' }} placeholder="Please choose the approver">
              <Option value="jack">Jack Ma</Option>
              <Option value="tom">Tom Liu</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12} xs={24}>
          <Form.Item name="dateTime" label="DateTime" rules={[{ required: true, message: 'Please choose the dateTime' }]}>
            <DatePicker.RangePicker style={{ width: '100%', color: 'black' }} getPopupContainer={(trigger) => trigger.parentElement!} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24} xs={24}>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: 'please enter url description'
              }
            ]}>
            <Input.TextArea style={{ color: 'black' }} rows={4} placeholder="please enter url description" />
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}

export default FormInsertPuddle
