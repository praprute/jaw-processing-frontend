import { Button, Divider, Form, Table } from 'antd'
import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ColumnsType } from 'antd/lib/table'
import moment from 'moment'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

import AppLayout from '../../components/Layouts'
import FillterBox from '../../components/ReceiveFishWeightBill/FillterBox'
import { getReceiveFishWeightPaginationTask, getReceiveFishWeightReportTask } from '../../share-module/FishWeightBill/task'
import { NextPageWithLayout } from '../_app'
import { numberWithCommas } from '../../utils/format-number'
import { useNavigation } from '../../utils/use-navigation'
import { NoticeError } from '../../utils/noticeStatus'

const FishWeightReceivePage: NextPageWithLayout = () => {
    const [form] = Form.useForm()
    const navigation = useNavigation()

    const [currentPage, setCurrentPage] = useState(1)
    const [sourceData, setSourceData] = useState([])
    const [sourceDataReport, setSourceDataReport] = useState([])
    const [totalList, setTotalList] = useState(0)
    const getReceiveFishWeight = getReceiveFishWeightPaginationTask.useTask()
    const getReceiveFishWeightReport = getReceiveFishWeightReportTask.useTask()
    const [fillterValues, setFillterValues] = useState({
        no: null,
        weigh_in: null,
        weigh_out: null,
        weigh_net: null,
        time_in: null,
        time_out: null,
        vehicle_register: null,
        customer_name: null,
        product_name: null,
        store_name: null,
        dateStart: null,
        dateEnd: null,
    })

    const OFFSET_PAGE = 10

    const columns: ColumnsType<any> = [
        {
            title: 'ลำดับที่',
            dataIndex: 'no',
            key: 'no',
        },
        {
            title: 'วันที่',
            dataIndex: 'date_action',
            key: 'date_action',
            render: (date_action: string) => <span>{moment(date_action).format('DD/MM/YYYY')}</span>,
        },

        {
            title: 'น้ำหนักสุทธิ',
            dataIndex: 'weigh_net',
            key: 'weigh_net',
            render: (weigh_net: number) => <span>{numberWithCommas(weigh_net)}</span>,
        },
        {
            title: 'ราคา / กก.',
            dataIndex: 'price_per_weigh',
            key: 'price_per_weigh',
        },
        {
            title: 'จำนวนเงินรวม',
            dataIndex: 'amount_price',
            key: 'amount_price',
            render: (amount_price: number) => <span>{numberWithCommas(amount_price)}</span>,
        },
        {
            title: 'ทะเบียนรถ',
            dataIndex: 'vehicle_register',
            key: 'vehicle_register',
        },
        {
            title: 'ชื่อลูกค้า',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'ชื่อสินค้า',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            title: 'stock คงเหลือ',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock: number) => <span>{numberWithCommas(stock)}</span>,
        },
    ]

    useEffect(() => {
        ;(async () => {
            await handleSubmit(fillterValues)
        })()
    }, [currentPage])

    const handleSubmit = async (values: any) => {
        try {
            setFillterValues(values)
            const payload = {
                page: currentPage - 1,
                offset: OFFSET_PAGE,
                no: values.no,
                weigh_in: values.weigh_in,
                weigh_out: values.weigh_out,
                weigh_net: values.weigh_net,
                time_in: values.time_in,
                time_out: values.time_out,
                vehicle_register: values.vehicle_register,
                customer_name: values.customer_name,
                product_name: values.product_name,
                store_name: values.store_name,
                dateStart: !!form.getFieldValue('date_start')
                    ? dayjs(form.getFieldValue('date_start')).format('YYYY-MM-DD')
                    : null,
                dateEnd: !!form.getFieldValue('date_end') ? dayjs(form.getFieldValue('date_end')).format('YYYY-MM-DD') : null,
            }

            const res = await getReceiveFishWeight.onRequest(payload)
            const dataReport = await getReceiveFishWeightReport.onRequest(payload)

            setSourceData(res.data)
            setTotalList(res.total)

            if (dataReport.data) {
                let buffer = []
                console.log('dataReport.data : ', dataReport.data)
                dataReport.data.map((da) => {
                    buffer.push({
                        idreceipt: da.idreceipt,
                        no: da.no,
                        น้ำหนักสุทธิ: da.weigh_net,
                        ราคาต่อหน่วย: da.price_per_weigh,
                        ราคาสุทธิ: da.amount_price,
                        ทะเบียนรถ: da.vehicle_register,
                        ลูกค้า: da.customer_name,
                        ปลา: da.product_name,
                        store_name: da.product_name,
                        รายละเอียดเพิ่มเติม: da.description,
                        วันที่ลงบิล: da.date_action,
                        stock: da.stock,
                        วันที่คีข้อมูล: da.date_create,
                    })
                })
                setSourceDataReport(buffer)
            }
        } catch (e: any) {
            NoticeError(`ทำรายการไม่สำเร็จ : ${e}`)
        }
    }

    const handleExport = () => {
        // var wb = XLSX.utils.book_new(),
        //     ws = XLSX.utils.json_to_sheet(data)
        // XLSX.utils.book_append_sheet(wb, ws, 'Report')

        // XLSX.writeFile(wb, 'Report.xlsx')

        // var elt = document.getElementById('tbl_exporttable_to_xls')
        // var wb = XLSX.utils.table_to_book(elt, { sheet: 'sheet1' })

        // var ws = XLSX.utils.json_to_sheet(sourceDataReport)
        // var wb = { Sheets: { data: ws }, SheetNames: ['data'] }
        // return dl
        //     ? XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' })
        //     : XLSX.writeFile(wb, fn || 'บิลปลา.' + (type || 'xlsx'))

        const worksheet = XLSX.utils.json_to_sheet(sourceDataReport)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })

        saveAs(
            blob,
            `${'บิลปลา'}-${dayjs(form.getFieldValue('date_start')).format('YYYY-MM-DD')}-${dayjs(
                form.getFieldValue('date_end'),
            ).format('YYYY-MM-DD')}.xlsx`,
        )
    }

    const handleChangePagination = (pagination: any) => {
        setCurrentPage(pagination.current)
    }

    return (
        <>
            <StyledNavMenu>
                <div className='container'>
                    <Button
                        onClick={() => {
                            navigation.navigateTo.createFishWeightReceive()
                        }}
                        type='primary'
                    >
                        ลงทะเบียนใบชั่ง
                    </Button>
                </div>
            </StyledNavMenu>
            <SectionFillter>
                <StyledForm autoComplete='off' form={form} hideRequiredMark layout='vertical' onFinish={handleSubmit}>
                    <FillterBox onExport={handleExport} />
                </StyledForm>
            </SectionFillter>

            <SectionFillter>
                <Container>
                    <Divider style={{ backgroundColor: '#FFFFFF66' }} type='horizontal' />{' '}
                </Container>
            </SectionFillter>

            <SectionTable>
                <Container>
                    <h3>รายการใบชั่งปลา {totalList} รายการ</h3>
                    <StyledTable
                        columns={columns}
                        dataSource={sourceData}
                        loading={getReceiveFishWeight.loading}
                        onChange={handleChangePagination}
                        pagination={{
                            total: totalList,
                            current: currentPage,
                            showSizeChanger: false,
                        }}
                    />
                </Container>
            </SectionTable>
        </>
    )
}

FishWeightReceivePage.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>
            <>{page}</>
        </AppLayout>
    )
}

export default FishWeightReceivePage

const StyledNavMenu = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    .container {
        width: 100%;
        max-width: 1280px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 0px;
    }
    Button {
        padding: 0px 32px;
    }
`
const StyledTable = styled(Table)`
    width: 100%;
    .ant-table-thead .ant-table-cell {
        font-weight: 400;
    }
`

const StyledForm = styled(Form)`
    width: 100%;
    display: flex;
    justify-content: center;
`

const Container = styled.div`
    width: 100%;
    max-width: 1280px;
`

const SectionTable = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    overflow-x: scroll;
`
const SectionFillter = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
`
