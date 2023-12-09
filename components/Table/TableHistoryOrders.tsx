import React from 'react'
import { Button, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import styled from 'styled-components'

import { IOrderDto } from '../../share-module/order/type'

interface ITableHistoryOrders {
    data: IOrderDto[]
    loading: boolean
    onVisibleModal?: (e: boolean) => void
    onSelectIdHistory?: (id: number) => void
}

const TableHistoryOrders = (props: ITableHistoryOrders) => {
    const { data, loading, onVisibleModal, onSelectIdHistory } = props

    const columns: ColumnsType<any> = [
        {
            title: 'หมายเลขออเดอร์',
            dataIndex: 'idorders',
            key: 'idorders',
        },
        {
            title: 'สถานะ',
            key: 'status',
            dataIndex: 'status',
            render: (status: number) => (
                <span>
                    {status === 0 && <Tag color='magenta'>หมักปลา</Tag>}
                    {status === 1 && <Tag color='orange'>ถ่ายออก</Tag>}
                    {status === 2 && <Tag color='green'>เติมเข้า</Tag>}
                    {status === 3 && <Tag color='red'>ถ่ายกาก</Tag>}
                </span>
            ),
        },
        {
            title: 'จำนวน',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'ราคาต่อหน่วย',
            dataIndex: 'unit_per_price',
            key: 'unit_per_price',
        },
        {
            title: 'มูลค่า',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'action',
            key: 'action',
            render: (order) => {
                return (
                    <Button
                        onClick={() => {
                            onVisibleModal(true)
                            onSelectIdHistory(order.idorders)
                        }}
                    >
                        <a>เลือก</a>
                    </Button>
                )
            },
        },
        {
            title: 'วันที่ทำรายการ',
            dataIndex: 'date_create',
            key: 'date_create',
        },
    ]
    return <StyledTable columns={columns} dataSource={data} loading={loading} />
}

export default TableHistoryOrders

const StyledTable = styled(Table)`
    width: 100%;
    .ant-table-thead .ant-table-cell {
        // background-color: #23252b99;
        // color: white;
        font-weight: 400;
    }
`
