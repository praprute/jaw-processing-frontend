import React from 'react'
import styled from 'styled-components'

import { IOrderDetailDto } from '../../share-module/order/type'

interface IOrderLastedSection {
    data: IOrderDetailDto[]
}

const OrderLastedSection = (props: IOrderLastedSection) => {
    const { data } = props

    const handleTypeOrder = (type: number) => {
        switch (type) {
            case 0:
                return 'ลงปลา'
            case 1:
                return 'นำออก'
            case 2:
                return 'นำเข้า'
            case 3:
                return 'ถ่ายกาก'
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
                    <th>รายละเอียด</th>
                </tr>
                {data &&
                    data.map((data, index) => (
                        <>
                            {data.type === 0 && (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td>{data.date_create}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td>ปลา</td>
                                        <td>{data.fish}</td>
                                        <td>{data.fish_price / data.fish}</td>
                                        <td>{data.fish_price}</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>เกลือ</td>
                                        <td>{data.salt}</td>
                                        <td>{data.salt_price / data.salt}</td>
                                        <td>{data.salt_price}</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>ค่าเเรงปลาลงบ่อ</td>
                                        <td>{data.laber}</td>
                                        <td>{data.laber_price / data.laber}</td>
                                        <td>{data.laber_price}</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>รวมทั้งสิ้น</td>
                                        <td>{data.amount_items}</td>
                                        <td>{data.amount_unit_per_price}</td>
                                        <td>{data.amount_price}</td>
                                        <td></td>
                                    </tr>
                                </React.Fragment>
                            )}
                        </>
                    ))}
            </StyledTable>
        </StyledContent>
    )
}

export default OrderLastedSection

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
    display: flex;
    align-items: start;
    justify-content: center;
    flex-direction: column;
`
