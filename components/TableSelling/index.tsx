// import React from 'react'
// import { Button, Table, Tag } from 'antd'
// import { ColumnsType } from 'antd/lib/table'
// import styled from 'styled-components'

// interface ITableSelling {
//     data: {
//         idorder_selling: number
//         volume: number
//         price_per_unit: number
//         total_price: number
//         description?: string
//         customer_name?: string
//         puddle_id: number
//         lot?: string
//         date_action?: string
//         date_create: string
//         idpuddle?: number
//         serial?: number
//     }[]
//     total: number
//     current: number
//     loading: boolean
//     onVisibleModal?: (e: boolean) => void
//     onSelectIdHistory?: (id: number) => void
//     handleChangePagination: (e: any) => void
// }

// const TableSelling = (props: ITableSelling) => {
//     const { data, loading, total, current, handleChangePagination } = props

//     const columns: ColumnsType<any> = [
//         {
//             title: 'หมายเลขรายการ',
//             dataIndex: 'idorder_selling',
//             key: 'idorder_selling',
//         },
//         {
//             title: 'ปริมาตร',
//             key: 'volume',
//             dataIndex: 'volume',
//         },
//         {
//             title: 'ราคาต่อหน่วย',
//             dataIndex: 'price_per_unit',
//             key: 'price_per_unit',
//         },
//         {
//             title: 'มูลค่ารวม',
//             dataIndex: 'total_price',
//             key: 'total_price',
//         },
//         {
//             title: 'ชื่อลูกค้า',
//             dataIndex: 'customer_name',
//             key: 'customer_name',
//         },
//         {
//             title: 'บ่อที่มา',
//             dataIndex: 'serial',
//             key: 'serial',
//         },
//         {
//             title: 'รายละเอียดเพิ่มเติม',
//             dataIndex: 'description',
//             key: 'description',
//         },
//         {
//             title: 'วันที่ทำรายการ',
//             dataIndex: 'date_action',
//             key: 'date_action',
//         },
//     ]
//     return (
//         <StyledTable
//             columns={columns}
//             dataSource={data}
//             loading={loading}
//             onChange={handleChangePagination}
//             pagination={{
//                 total: total,
//                 current: current,
//                 showSizeChanger: false,
//             }}
//         />
//     )
// }
// // columns={columns}
// // dataSource={sourceData}
// // loading={getCustomerByBillTaskPagination.loading}
// // onChange={handleChangePagination}

// export default TableSelling

// const StyledTable = styled(Table)`
//     width: 100%;
//     .ant-table-thead .ant-table-cell {
//         // background-color: #23252b99;
//         // color: white;
//         font-weight: 400;
//     }
// `
