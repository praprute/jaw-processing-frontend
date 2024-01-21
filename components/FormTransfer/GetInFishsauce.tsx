import { DatePicker, Form, Input } from 'antd'
import { Dayjs } from 'dayjs'
import styled from 'styled-components'

interface ITransferFishsauce {
    onChangeDate?: (value: Dayjs, dateString: string) => void
    defaultDateAction?: string
}

const GetInFishsauce = (props: ITransferFishsauce) => {
    const { onChangeDate } = props
    return (
        <>
            <StyledFormItems
                label='หมายเลขออเดอร์'
                name='order_id'
                rules={[{ required: true, message: 'กรุณาระบุหมายเลขออเดอร์' }]}
            >
                <Input disabled placeholder='หมายเลขออเดอร์' size='large' style={{ color: 'black' }} />
            </StyledFormItems>

            <StyledFormItems
                label='id บ่อที่นำเข้า'
                name='source_puddle'
                rules={[{ required: true, message: 'กรุณาระบุหมายเลขบ่อที่นำเข้า' }]}
            >
                <Input disabled placeholder='หมายเลขบ่อที่นำเข้า' size='large' style={{ color: 'black' }} />
            </StyledFormItems>

            <StyledFormItems
                label='หมายเลขบ่อที่นำเข้า'
                name='action_serial_puddle'
                rules={[{ required: true, message: 'กรุณาระบุหมายเลขบ่อที่นำเข้า' }]}
            >
                <Input disabled placeholder='หมายเลขบ่อที่นำเข้า' size='large' style={{ color: 'black' }} />
            </StyledFormItems>

            <StyledFormItems
                label='หมายเลขออเดอร์ย่อย'
                name='lasted_subId'
                rules={[{ required: true, message: 'กรุณาระบุหมายเลขออเดอร์ย่อย' }]}
            >
                <Input disabled placeholder='หมายเลขออเดอร์ย่อย' size='large' style={{ color: 'black' }} />
            </StyledFormItems>

            <StyledFormItems
                label='หมายเลข Transaction'
                name='idtarget_puddle'
                rules={[
                    {
                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                        required: true,
                        message: 'กรุณาระบุหมายเลข Transaction',
                    },
                ]}
            >
                <Input disabled placeholder='หมายเลข Transaction' size='large' style={{ color: 'black' }} />
            </StyledFormItems>

            <StyledFormItems
                label='จำนวนที่เติมเข้า'
                name='volume'
                rules={[
                    { pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณาระบุจำนวนที่เติมเข้า' },
                ]}
            >
                <Input placeholder='จำนวนที่เติมเข้า' size='large' style={{ color: 'black' }} />
            </StyledFormItems>

            <StyledFormItems
                label='ปริมาตรที่เหลือ (kg)'
                name='remaining_volume'
                rules={[
                    {
                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                        required: true,
                        message: 'กรุณากรอก ปริมาตรที่เหลือ (L.)',
                    },
                ]}
            >
                <Input placeholder='ปริมาตรที่เหลือ (L.)' size='large' style={{ color: 'black' }} />
            </StyledFormItems>

            <StyledFormItems
                label='ร้อยละที่เติมเข้า'
                name='amount_items'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input placeholder='จำนวนคงเหลือ' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                label='ร้อยละคงเหลือ'
                name='remaining_items'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input placeholder='ร้อยละคงเหลือ' size='large' style={{ color: 'black' }} />
            </StyledFormItems>

            <StyledFormItems
                label='มูลค่า'
                name='amount_price'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input placeholder='มูลค่า' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                label='มูลค่า คงเหลือ'
                name='remaining_price'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input placeholder='มูลค่า คงเหลือ' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                label='รอบ'
                name='round'
                rules={[
                    { pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: false, message: 'กรุณากรอกจำนวนให้ครบถ้วน' },
                ]}
            >
                <Input placeholder='จำนวนรอบ' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                label='วันที่ทำรายการ'
                name='date_action'
                rules={[{ required: true, message: 'กรุณาระบุวันที่ทำรายการ' }]}
            >
                <DatePicker
                    // defaultValue={moment(defaultDateAction, 'YYYY-MM-DD')}
                    onChange={onChangeDate}
                    style={{ width: '100%' }}
                />
            </StyledFormItems>
        </>
    )
}

export default GetInFishsauce

const StyledFormItems = styled(Form.Item)`
    .ant-form-item-label > label {
        font-size: 18px;
        font-weight: normal;
    }
`
