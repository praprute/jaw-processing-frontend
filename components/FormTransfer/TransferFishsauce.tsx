import { Form, Input, Select } from 'antd'
import styled from 'styled-components'

import { IAllPuddleDto } from '../../share-module/building/type'
import { IOrderDetailDto } from '../../share-module/order/type'

const { Option } = Select

interface ITransferFishsauce {
    puddleOption?: IAllPuddleDto[]
    lastedOrder?: IOrderDetailDto
    onChangeAmountItems?: (e: React.ChangeEvent<HTMLInputElement>) => void
    amountItemsKG?: number
}

const TransferFishsauce = (props: ITransferFishsauce) => {
    const { puddleOption, onChangeAmountItems, amountItemsKG } = props
    return (
        <>
            <StyledFormItems
                label='เลือกบ่อปลายทาง'
                name='id_puddle'
                rules={[{ required: true, message: 'กรุณาเลือกบ่อปลายทาง' }]}
            >
                <Select placeholder='เลือกบ่อปลายทาง' style={{ width: '100%' }}>
                    {puddleOption &&
                        puddleOption.map((data, index) => (
                            <Option key={index} value={data.idpuddle}>
                                <span>{data.idpuddle}</span>
                            </Option>
                        ))}
                </Select>
            </StyledFormItems>
            <StyledFormItems
                label='ปริมาตรตั้งต้น'
                name='volume_start'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input placeholder='ปริมาตรตั้งต้น' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                extra={`~ ${amountItemsKG} kg.`}
                label='จำนวนที่ปล่อยออก'
                name='volume'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input onChange={onChangeAmountItems} placeholder='จำนวนที่ปล่อยออก' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                label='ร้อยละที่ปล่อยออก'
                name='amount_items'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input placeholder='ร้อยละคงเหลือ' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                label='ร้อยละคงเหลือ'
                name='remaining_items'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input placeholder='ร้อยละคงเหลือ' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                label='ราคาต่อหน่วย ล่าสุด'
                name='amount_unit_per_price'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input placeholder='จำนวนคงเหลือ' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                label='ราคาต่อหน่วย คงเหลือ'
                name='remaining_unit_per_price'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input placeholder='ราคาต่อหน่วย คงเหลือ' size='large' style={{ color: 'black' }} />
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
        </>
    )
}

export default TransferFishsauce

const StyledFormItems = styled(Form.Item)`
    .ant-form-item-label > label {
        font-size: 18px;
        font-weight: normal;
    }
`
