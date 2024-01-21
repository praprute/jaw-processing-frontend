import { Button, DatePicker, Divider, Form, Input, Select } from 'antd'
import { LabeledValue } from 'antd/lib/select'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Dayjs } from 'dayjs'

import { IAllBuildingAndPuddleDto, IAllPuddleDto } from '../../share-module/building/type'
import { IOrderDetailDto } from '../../share-module/order/type'
import { ITypeProcess } from '../../share-module/puddle/type'

const { Option } = Select

interface ITransferFishsauce {
    puddleOption?: IAllPuddleDto[]
    lastedOrder?: IOrderDetailDto
    onChangeAmountItems?: (e: React.ChangeEvent<HTMLInputElement>) => void
    amountItemsKG?: number
    buildingOption?: IAllBuildingAndPuddleDto[]
    onChangeBuilding?: (value: number) => void
    onSelectAction?: (labelValue: LabeledValue) => void
    typeProcess?: ITypeProcess[]
    throwOutProcess?: boolean
    onChangeDate?: (value: Dayjs, dateString: string) => void
    multi?: boolean
    listBuilding?: any[]
    onChangeMultiBuilding?: (value: any, index: any) => void
    onChangeMultiuddle?: (labelValue: any, index: any) => void
    setMultiBuildingTransfser?: (e: any) => void
    onChangewwwwBuff?: (value: string) => void
    onSearchBuff?: (value: string) => void
}

const TransferFishsauce = (props: ITransferFishsauce) => {
    const {
        onChangeDate,
        puddleOption,
        onChangeAmountItems,
        amountItemsKG,
        buildingOption,
        onChangeBuilding,
        onSelectAction,
        typeProcess,
        multi,
        listBuilding,
        onChangeMultiBuilding,
        onChangeMultiuddle,
        setMultiBuildingTransfser,
        onChangewwwwBuff,
        onSearchBuff,
    } = props

    const [puddleList, setPuddleList] = useState([])

    useEffect(() => {
        if (!!puddleOption) {
            let puddle = puddleOption.map((data) => {
                return {
                    value: data.idpuddle,
                    label: data.serial,
                }
            })
            setPuddleList(puddle)
        }
    }, [puddleOption])

    return (
        <>
            {!!!multi && (
                <StyledFormItems
                    label='เลือกอาคาร'
                    name='id_building'
                    rules={[{ required: true, message: 'กรุณาเลือกบ่อปลายทาง' }]}
                >
                    <Select onChange={onChangeBuilding} placeholder='เลือกอาคาร' style={{ width: '100%' }}>
                        {buildingOption &&
                            buildingOption.map((data, index) => (
                                <Option key={index} value={data.idbuilding}>
                                    <span>{data.name}</span>
                                </Option>
                            ))}
                    </Select>
                </StyledFormItems>
            )}
            {!!!multi && (
                <StyledFormItems
                    label='เลือกบ่อปลายทาง'
                    name='id_puddle'
                    rules={[{ required: true, message: 'กรุณาเลือกบ่อปลายทาง' }]}
                >
                    <Select
                        filterOption={(input, option) => (option?.label.toString() ?? '').includes(input)}
                        onSelect={onSelectAction}
                        optionFilterProp='children'
                        options={puddleList}
                        placeholder='เลือกบ่อปลายทาง'
                        showSearch
                        style={{ width: '100%' }}
                    />
                </StyledFormItems>
            )}
            {!!multi && (
                <>
                    {listBuilding.map((data, indexList) => (
                        <div key={indexList}>
                            <StyledFormItems
                                label='เลือกอาคาร 2'
                                name='id_building'
                                rules={[{ required: true, message: 'กรุณาเลือกบ่อปลายทาง' }]}
                            >
                                <Select
                                    onChange={(e) => {
                                        console.log('onChangeMultiBuilding : ', e, indexList)
                                        onChangeMultiBuilding(e, indexList)
                                    }}
                                    placeholder='เลือกอาคาร'
                                    style={{ width: '100%' }}
                                    value={data.building}
                                >
                                    {buildingOption &&
                                        buildingOption.map((data, index) => (
                                            <Option key={index} value={data.idbuilding}>
                                                <span>{data.name}</span>
                                            </Option>
                                        ))}
                                </Select>
                            </StyledFormItems>
                            <StyledFormItems
                                label='เลือกบ่อปลายทาง'
                                name='id_puddle'
                                rules={[{ required: true, message: 'กรุณาเลือกบ่อปลายทาง' }]}
                            >
                                <Select
                                    filterOption={(input, option) => (option?.label.toString() ?? '').includes(input)}
                                    onChange={onChangewwwwBuff}
                                    onSearch={onSearchBuff}
                                    onSelect={(labelValue) => {
                                        onChangeMultiuddle(labelValue, indexList)
                                    }}
                                    optionFilterProp='children'
                                    options={listBuilding[indexList].puddle_id}
                                    placeholder='เลือกบ่อปลายทาง'
                                    showSearch
                                    style={{ width: '100%' }}
                                />
                            </StyledFormItems>
                        </div>
                    ))}
                </>
            )}
            {!!multi && (
                <Button
                    block
                    onClick={() => {
                        setMultiBuildingTransfser([
                            ...listBuilding,
                            {
                                building: null,
                                puddle_id: [],
                                selectedPuddle: null,
                                serialPuddle: null,
                            },
                        ])
                    }}
                    type='primary'
                >
                    เพิ่มอาคาร
                </Button>
            )}
            {!!multi && <Divider />}
            <StyledFormItems label='confirmation action puddle serial' name='action_puddle'>
                <Input disabled placeholder='confirmation action puddle serial' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                extra={`~ ${amountItemsKG} kg.`}
                label='จำนวนที่ปล่อยออก L.'
                name='volume'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input onChange={onChangeAmountItems} placeholder='จำนวนที่ปล่อยออก' size='large' style={{ color: 'black' }} />
            </StyledFormItems>

            <StyledFormItems
                label='ปริมาตรที่เหลือ (kg.)'
                name='remaining_volume'
                rules={[
                    {
                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                        required: true,
                        message: 'กรุณากรอก ปริมาตรที่เหลือ (L.)',
                    },
                ]}
            >
                <Input disabled placeholder='ปริมาตรที่เหลือ (L.)' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                label='ร้อยละที่ปล่อยออก'
                name='amount_items'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input disabled placeholder='ร้อยละคงเหลือ' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                label='ร้อยละคงเหลือ'
                name='remaining_items'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input disabled placeholder='ร้อยละคงเหลือ' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                label='ราคาต่อหน่วย ล่าสุด'
                name='amount_unit_per_price'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input disabled placeholder='จำนวนคงเหลือ' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                label='ราคาต่อหน่วย คงเหลือ'
                name='remaining_unit_per_price'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input disabled placeholder='ราคาต่อหน่วย คงเหลือ' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                label='มูลค่า'
                name='amount_price'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input disabled placeholder='มูลค่า' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems
                label='มูลค่า คงเหลือ'
                name='remaining_price'
                rules={[{ pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/), required: true, message: 'กรุณากรอกจำนวนให้ครบถ้วน' }]}
            >
                <Input disabled placeholder='มูลค่า คงเหลือ' size='large' style={{ color: 'black' }} />
            </StyledFormItems>
            <StyledFormItems label='เลือกรายการการทำงาน' name='process' rules={[{ required: false }]}>
                <Select placeholder='เลือกรายการการทำงาน' style={{ width: '100%' }}>
                    {typeProcess &&
                        typeProcess.map((data, index) => (
                            <Option key={index} value={data.idtype_process}>
                                <span>{data?.process_name}</span>
                            </Option>
                        ))}
                </Select>
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
                <DatePicker onChange={onChangeDate} style={{ width: '100%' }} />
            </StyledFormItems>

            {/* {throwOutProcess && (
                <StyledFormItems label='ยืนยันการถ่ายกากไปบ่ออื่น' name='throwOut' rules={[{ required: false }]}>
                    <Select onSelect={onSelectAction} placeholder='ยืนยันการถ่ายกากไปบ่ออื่น' style={{ width: '100%' }}>
                        <Checkbox checked={throwOutProcess} disabled={true}>
                            ยืนยันการถ่ายกากไปบ่ออื่น
                        </Checkbox>
                    </Select>
                </StyledFormItems>
            )} */}
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
