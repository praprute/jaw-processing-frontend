import { Button } from 'antd'
import React from 'react'
import styled from 'styled-components'

import { IOrderDetailDto } from '../../share-module/order/type'
import { numberWithCommas } from '../../utils/format-number'
import { TypeProcess } from '../../utils/type_puddle'

interface IOrderLastedSection {
    data: IOrderDetailDto[]
    statusPuddle: number
    onSelected: (id: number) => void
    onOpenBill: (id: number) => void
}

const OrderLastedSection = (props: IOrderLastedSection) => {
    const { data, onSelected, onOpenBill } = props

    const handleTypeOrder = (type: number) => {
        switch (type) {
            case TypeProcess.FERMENT:
                return 'ลงปลา'
            case TypeProcess.TRANSFER:
                return 'ปล่อยน้ำปลาออก'
            case TypeProcess.IMPORT:
                return 'เติมน้ำปลา'
            case TypeProcess.CLEARING:
                return 'ถ่ายกาก'
            case TypeProcess.GET_FISH_RESIDUE:
                return 'รับกาก'
            case TypeProcess.CLEARING_ALL:
                return 'ถ่ายกากทิ้ง'
            case TypeProcess.ADD_ON_WATER_SALT:
                return 'เติมน้ำเกลือ'
            default:
                break
        }
    }

    return (
        <StyledContent>
            <span>หมายเลขรายการ : {data[0].idOrders}</span>
            <StyledTable>
                <tr>
                    <th>วันที่</th>
                    <th>การทำงาน</th>
                    <th>รายการ</th>
                    <th>จำนวน</th>
                    <th>ราคาต่อหน่วย</th>
                    <th>มูลค่า</th>
                    <th>ปริมาตร</th>
                    <th>สถานะ</th>
                    <th>รายละเอียด</th>
                </tr>
                {data &&
                    data.map((data, index) => (
                        <React.Fragment key={index}>
                            {data.type === TypeProcess.FERMENT && (
                                <>
                                    <StyledRowTransaction>
                                        <td>{data.date_create}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td>ปลา</td>
                                        <td>{numberWithCommas(data.fish)}</td>
                                        <td>{numberWithCommas(data.fish === 0 ? 0 : data.fish_price / data.fish)}</td>
                                        <td>{numberWithCommas(data.fish_price)}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction>
                                        <td></td>
                                        <td></td>
                                        <td>เกลือ</td>
                                        <td>{numberWithCommas(data.salt)}</td>
                                        <td>{numberWithCommas(data.salt === 0 ? 0 : data.salt_price / data.salt)}</td>
                                        <td>{numberWithCommas(data.salt_price)}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction>
                                        <td></td>
                                        <td></td>
                                        <td>ค่าเเรงปลาลงบ่อ</td>
                                        <td>{numberWithCommas(data.laber)}</td>
                                        <td>{numberWithCommas(data.laber === 0 ? 0 : data.laber_price / data.laber)}</td>
                                        <td>{numberWithCommas(data.laber_price)}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction>
                                        <td></td>
                                        <td></td>
                                        <td>รวมทั้งสิ้น</td>
                                        <td>{numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.amount_price)}</td>
                                        <td>{numberWithCommas(data.volume)} kg.</td>
                                        <td></td>
                                        <td>
                                            {' '}
                                            <StyledButton
                                                type='primary'
                                                onClick={() => {
                                                    onOpenBill(data.idOrders)
                                                }}
                                            >
                                                ดูใบชั่งปลา
                                            </StyledButton>
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.TRANSFER && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{data.date_create}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td style={{ color: 'red' }}>- {numberWithCommas(data.amount_items)}</td>
                                        <td>{data.amount_unit_per_price}</td>
                                        <td style={{ color: 'red' }}>- {numberWithCommas(data.amount_price)}</td>
                                        <td>{data.volume}</td>
                                        <td>บ่อปลายทาง {data?.action_serial_puddle}</td>

                                        <td></td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td></td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>{numberWithCommas(data.remaining_volume)} kg.</td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {data?.process_name ? (
                                                data?.process_name
                                            ) : (
                                                <StyledButton
                                                    type='primary'
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.IMPORT && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{data.date_create}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td> {numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td> {numberWithCommas(data.amount_price)}</td>
                                        <td>{numberWithCommas(data.volume)}</td>
                                        <td>บ่อที่มา {data?.action_serial_puddle}</td>
                                        <td></td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td></td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>{numberWithCommas(data.remaining_volume)} kg.</td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {data?.process_name ? (
                                                data?.process_name
                                            ) : (
                                                <StyledButton
                                                    type='primary'
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.CLEARING && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{data.date_create}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td> {numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td> {numberWithCommas(data.amount_price)}</td>
                                        <td>{numberWithCommas(data.volume)}</td>
                                        <td>บ่อปลายทาง {data?.action_serial_puddle}</td>
                                        <td></td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td></td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>{numberWithCommas(data.remaining_volume)} kg.</td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {' '}
                                            {data?.process_name ? (
                                                data?.process_name
                                            ) : (
                                                <StyledButton
                                                    type='primary'
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.GET_FISH_RESIDUE && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{data.date_create}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td> {numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td> {numberWithCommas(data.amount_price)}</td>
                                        <td>{numberWithCommas(data.volume)}</td>
                                        <td>บ่อที่มา {data?.action_serial_puddle}</td>
                                        <td></td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td></td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>{numberWithCommas(data.remaining_volume)} kg.</td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {' '}
                                            {data?.process_name ? (
                                                data?.process_name
                                            ) : (
                                                <StyledButton
                                                    type='primary'
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.CLEARING_ALL && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{data.date_create}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td>-{numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td>-{numberWithCommas(data.amount_price)}</td>
                                        <td>-{numberWithCommas(data.volume)}</td>
                                        <td></td>
                                        <td></td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td></td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>{numberWithCommas(data.remaining_volume)} kg.</td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {' '}
                                            {data?.process_name ? (
                                                data?.process_name
                                            ) : (
                                                <StyledButton
                                                    type='primary'
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.ADD_ON_WATER_SALT && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{data.date_create}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td> {numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td> {numberWithCommas(data.amount_price)}</td>
                                        <td>{numberWithCommas(data.volume)}</td>
                                        <td></td>
                                        <td></td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td></td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>{numberWithCommas(data.remaining_volume)} kg.</td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {data?.process_name ? (
                                                data?.process_name
                                            ) : (
                                                <StyledButton
                                                    type='primary'
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                        </React.Fragment>
                    ))}
            </StyledTable>
        </StyledContent>
    )
}

export default OrderLastedSection

const StyledButton = styled(Button)`
    border-radius: 4px;
`

const StyledRowTransaction = styled.tr<{ isStatus?: number }>`
    ${(p) => {
        switch (p.isStatus) {
            case TypeProcess.TRANSFER:
            case TypeProcess.ADD_ON_WATER_SALT:
                return `background:#DEFCBA;`
            case TypeProcess.IMPORT:
                return `background:#FDD298;`
            case TypeProcess.CLEARING:
            case TypeProcess.GET_FISH_RESIDUE:
                return `background:#D68B8B;`
        }
    }}
`

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    td,
    th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }

    th {
        background: #00000011;
    }
`
const StyledContent = styled.div`
    width: 100%;
    min-width: max-content;
    display: flex;
    align-items: start;
    justify-content: center;
    flex-direction: column;
`
