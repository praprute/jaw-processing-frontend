import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import { DownloadOutlined } from '@ant-design/icons'

import { IOrderDetailDto } from '../../share-module/order/type'
import { numberWithCommas } from '../../utils/format-number'
import { TypeProcess } from '../../utils/type_puddle'
import { getResultTestTask } from '../../share-module/order/task'

interface IOrderLastedSection {
    data: IOrderDetailDto[]
    statusPuddle?: number
    onSelected?: (id: number) => void
    onOpenBill?: (id: number) => void
    openModalLabs?: (visible: boolean) => void
    setIdRef?: (id: number) => void

    onOpenModalChangeVolums?: (visible: boolean) => void
    setSubIdRef?: (id: number) => void
    hideHeader?: boolean
    hideAction?: boolean
}

const OrderLastedSection = (props: IOrderLastedSection) => {
    const {
        data,
        onSelected,
        onOpenBill,
        openModalLabs,
        setIdRef,
        onOpenModalChangeVolums,
        setSubIdRef,
        hideHeader = false,
        hideAction = false,
    } = props

    const [resultTest, setResultTest] = useState<any>([])

    const getResultTest = getResultTestTask.useTask()

    useEffect(() => {
        ;(async () => {
            if (!!data) {
                let buffer = []
                for (const element of data) {
                    const res = await getResultTest.onRequest({ ref: element.idsub_orders })
                    if (res.success === 'success') {
                        buffer.push(res.message[res.message.length - 1])
                        setResultTest((resultTest: any) => [...resultTest, res.message[res.message.length - 1]])
                    }
                }
            }
        })()
    }, [data])

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
            case TypeProcess.GETFISHRESIDUE:
                return 'รับกาก'
            case TypeProcess.CLEARINGALL:
                return 'ถ่ายกากทิ้ง'
            case TypeProcess.ADDONWATERSALT:
                return 'เติมน้ำเกลือ'
            case TypeProcess.ADDONFISHSAUCE:
                return 'เติมน้ำปลาข้างนอก'
            case TypeProcess.TRANSFERSALTWATER:
                return 'ปล่อยน้ำเกลือ'
            case TypeProcess.IMPORTSALTWATER:
                return 'เติมน้ำเกลือเข้าจากภายใน'
            case TypeProcess.IMPORTHITWATER:
                return 'เติมน้ำตีกาก'
            case TypeProcess.IMPORTWATERFISH:
                return 'เติมน้ำคาว'
            case TypeProcess.MIXING:
                return 'ดูดไปผสม'
            case TypeProcess.MIXEDPAUSE:
                return 'ดูดมาพัก'
            default:
                break
        }
    }

    const handleExport = (type?: any, fn?: any, dl?: any) => {
        // var wb = XLSX.utils.book_new(),
        //     ws = XLSX.utils.json_to_sheet(data)
        // XLSX.utils.book_append_sheet(wb, ws, 'Report')

        // XLSX.writeFile(wb, 'Report.xlsx')

        var elt = document.getElementById('tbl_exporttable_to_xls')
        var wb = XLSX.utils.table_to_book(elt, { sheet: 'sheet1' })
        return dl
            ? XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' })
            : XLSX.writeFile(wb, fn || 'MySheetName.' + (type || 'xlsx'))
    }

    return (
        <StyledContent>
            {!!!hideHeader && (
                <HeadTableRow>
                    <span>หมายเลขรายการ : {data[0]?.idOrders}</span>
                    <StyledButtonAction
                        icon={<DownloadOutlined />}
                        onClick={() => {
                            handleExport('xlsx')
                        }}
                        type='primary'
                    >
                        Export
                    </StyledButtonAction>
                </HeadTableRow>
            )}

            <StyledTable id='tbl_exporttable_to_xls'>
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
                    <th>ส่งตัวอย่าง</th>
                </tr>
                {data &&
                    data.map((data, index) => (
                        <React.Fragment key={index}>
                            {data.type === TypeProcess.FERMENT && (
                                <>
                                    <StyledRowTransaction>
                                        <td>{!!data.date_action ? dayjs(data.date_action).format('DD/MM/YYYY') : '-'}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td>ปลา</td>
                                        <td>{numberWithCommas(data.fish)}</td>
                                        <td>{numberWithCommas(data.fish === 0 ? 0 : data.fish_price / data.fish)}</td>
                                        <td>{numberWithCommas(data.fish_price)}</td>
                                        <td></td>
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
                                        <td>
                                            <StyledButton
                                                onClick={() => {
                                                    onOpenBill(data.idOrders)
                                                }}
                                                type='primary'
                                            >
                                                ดูใบชั่งปลา
                                            </StyledButton>
                                        </td>
                                        <td>
                                            Tn:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Tn,
                                            )}
                                            , Salt:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Salt,
                                            )}
                                            , PH:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.PH,
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction>
                                        <td></td>
                                        <td></td>
                                        <td>รวมทั้งสิ้น</td>
                                        <td>{numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.amount_price)}</td>
                                        <td>
                                            {numberWithCommas(data.volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td></td>
                                        <td>
                                            <StyledButton
                                                disabled={hideAction}
                                                onClick={() => {
                                                    console.log('data: ', data)
                                                    onOpenModalChangeVolums(true)
                                                    setSubIdRef(data.idsub_orders)
                                                }}
                                                type='primary'
                                            >
                                                แก้ไขปริมาตร
                                            </StyledButton>
                                        </td>
                                        <td>
                                            <StyledButton
                                                disabled={hideAction}
                                                onClick={() => {
                                                    openModalLabs(true)
                                                    setIdRef(data.idsub_orders)
                                                }}
                                                type='primary'
                                            >
                                                ส่งตัวอย่างไปที่ Labs
                                            </StyledButton>
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.MIXING && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{!!data.date_action ? dayjs(data.date_action).format('DD/MM/YYYY') : '-'}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td style={{ color: 'red' }}>- {numberWithCommas(data.amount_items)}</td>
                                        <td>{data.amount_unit_per_price}</td>
                                        <td style={{ color: 'red' }}>- {numberWithCommas(data.amount_price)}</td>
                                        <td>
                                            {numberWithCommas(data.volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>บ่อปลายทาง {data?.action_serial_puddle}</td>

                                        <td></td>
                                        <td>
                                            Tn:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Tn,
                                            )}
                                            , Salt:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Salt,
                                            )}
                                            , PH:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.PH,
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td>{!!data.round ? `รอบ ${data.round}` : ''}</td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>
                                            {numberWithCommas(data.remaining_volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.remaining_volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {data?.description ? (
                                                data?.description
                                            ) : (
                                                <StyledButton
                                                    disabled={hideAction}
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                    type='primary'
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                        <td>
                                            <StyledButton
                                                disabled={hideAction}
                                                onClick={() => {
                                                    openModalLabs(true)
                                                    setIdRef(data.idsub_orders)
                                                }}
                                                type='primary'
                                            >
                                                ส่งตัวอย่างไปที่ Labs
                                            </StyledButton>
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.MIXEDPAUSE && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{!!data.date_action ? dayjs(data.date_action).format('DD/MM/YYYY') : '-'}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td> {numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td> {numberWithCommas(data.amount_price)}</td>
                                        <td>
                                            {numberWithCommas(data.volume)} KG |{' '}
                                            {numberWithCommas(Number((data.volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>บ่อที่มา {data?.action_serial_puddle}</td>
                                        <td></td>
                                        <td>
                                            Tn:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Tn,
                                            )}
                                            , Salt:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Salt,
                                            )}
                                            , PH:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.PH,
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td>{!!data.round ? `รอบ ${data.round}` : ''}</td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>
                                            {numberWithCommas(data.remaining_volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.remaining_volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {data?.description ? (
                                                data?.description
                                            ) : (
                                                <StyledButton
                                                    disabled={hideAction}
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                    type='primary'
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                        <td>
                                            <StyledButton
                                                disabled={hideAction}
                                                onClick={() => {
                                                    openModalLabs(true)
                                                    setIdRef(data.idsub_orders)
                                                }}
                                                type='primary'
                                            >
                                                ส่งตัวอย่างไปที่ Labs
                                            </StyledButton>
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.TRANSFER && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{!!data.date_action ? dayjs(data.date_action).format('DD/MM/YYYY') : '-'}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td style={{ color: 'red' }}>- {numberWithCommas(data.amount_items)}</td>
                                        <td>{data.amount_unit_per_price}</td>
                                        <td style={{ color: 'red' }}>- {numberWithCommas(data.amount_price)}</td>
                                        <td>
                                            {numberWithCommas(data.volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>บ่อปลายทาง {data?.action_serial_puddle}</td>

                                        <td></td>
                                        <td>
                                            Tn:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Tn,
                                            )}
                                            , Salt:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Salt,
                                            )}
                                            , PH:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.PH,
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td>{!!data.round ? `รอบ ${data.round}` : ''}</td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>
                                            {numberWithCommas(data.remaining_volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.remaining_volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {data?.description ? (
                                                data?.description
                                            ) : (
                                                <StyledButton
                                                    disabled={hideAction}
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                    type='primary'
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                        <td>
                                            <StyledButton
                                                disabled={hideAction}
                                                onClick={() => {
                                                    openModalLabs(true)
                                                    setIdRef(data.idsub_orders)
                                                }}
                                                type='primary'
                                            >
                                                ส่งตัวอย่างไปที่ Labs
                                            </StyledButton>
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.IMPORT && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{!!data.date_action ? dayjs(data.date_action).format('DD/MM/YYYY') : '-'}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td> {numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td> {numberWithCommas(data.amount_price)}</td>
                                        <td>
                                            {numberWithCommas(data.volume)} KG |{' '}
                                            {numberWithCommas(Number((data.volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>บ่อที่มา {data?.action_serial_puddle}</td>
                                        <td></td>
                                        <td>
                                            Tn:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Tn,
                                            )}
                                            , Salt:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Salt,
                                            )}
                                            , PH:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.PH,
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td>{!!data.round ? `รอบ ${data.round}` : ''}</td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>
                                            {numberWithCommas(data.remaining_volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.remaining_volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {data?.description ? (
                                                data?.description
                                            ) : (
                                                <StyledButton
                                                    disabled={hideAction}
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                    type='primary'
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                        <td>
                                            <StyledButton
                                                disabled={hideAction}
                                                onClick={() => {
                                                    openModalLabs(true)
                                                    setIdRef(data.idsub_orders)
                                                }}
                                                type='primary'
                                            >
                                                ส่งตัวอย่างไปที่ Labs
                                            </StyledButton>
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.CLEARING && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{!!data.date_action ? dayjs(data.date_action).format('DD/MM/YYYY') : '-'}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td> {numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td> {numberWithCommas(data.amount_price)}</td>
                                        <td>
                                            {numberWithCommas(data.volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>บ่อปลายทาง {data?.action_serial_puddle}</td>
                                        <td></td>
                                        <td>
                                            Tn:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Tn,
                                            )}
                                            , Salt:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Salt,
                                            )}
                                            , PH:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.PH,
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td></td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>
                                            {numberWithCommas(data.remaining_volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.remaining_volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {' '}
                                            {data?.description ? (
                                                data?.description
                                            ) : (
                                                <StyledButton
                                                    disabled={hideAction}
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                    type='primary'
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                        <td>
                                            <StyledButton
                                                disabled={hideAction}
                                                onClick={() => {
                                                    openModalLabs(true)
                                                    setIdRef(data.idsub_orders)
                                                }}
                                                type='primary'
                                            >
                                                ส่งตัวอย่างไปที่ Labs
                                            </StyledButton>
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.GETFISHRESIDUE && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{!!data.date_action ? dayjs(data.date_action).format('DD/MM/YYYY') : '-'}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td> {numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td> {numberWithCommas(data.amount_price)}</td>
                                        <td>
                                            {numberWithCommas(data.volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>บ่อที่มา {data?.action_serial_puddle}</td>
                                        <td></td>
                                        <td>
                                            Tn:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Tn,
                                            )}
                                            , Salt:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Salt,
                                            )}
                                            , PH:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.PH,
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td></td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>
                                            {numberWithCommas(data.remaining_volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.remaining_volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {' '}
                                            {data?.description ? (
                                                data?.description
                                            ) : (
                                                <StyledButton
                                                    disabled={hideAction}
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                    type='primary'
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                        <td>
                                            <StyledButton
                                                disabled={hideAction}
                                                onClick={() => {
                                                    openModalLabs(true)
                                                    setIdRef(data.idsub_orders)
                                                }}
                                                type='primary'
                                            >
                                                ส่งตัวอย่างไปที่ Labs
                                            </StyledButton>
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.CLEARINGALL && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{!!data.date_action ? dayjs(data.date_action).format('DD/MM/YYYY') : '-'}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td>-{numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td>-{numberWithCommas(data.amount_price)}</td>
                                        <td>
                                            -{numberWithCommas(data.volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            Tn:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Tn,
                                            )}
                                            , Salt:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Salt,
                                            )}
                                            , PH:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.PH,
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td></td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>
                                            {numberWithCommas(data.remaining_volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.remaining_volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {' '}
                                            {data?.description ? (
                                                data?.description
                                            ) : (
                                                <StyledButton
                                                    disabled={hideAction}
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                    type='primary'
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                        <td>
                                            <StyledButton
                                                disabled={hideAction}
                                                onClick={() => {
                                                    openModalLabs(true)
                                                    setIdRef(data.idsub_orders)
                                                }}
                                                type='primary'
                                            >
                                                ส่งตัวอย่างไปที่ Labs
                                            </StyledButton>
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.ADDONWATERSALT && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{!!data.date_action ? dayjs(data.date_action).format('DD/MM/YYYY') : '-'}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td> {numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td> {numberWithCommas(data.amount_price)}</td>
                                        <td>
                                            {numberWithCommas(data.volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            Tn:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Tn,
                                            )}
                                            , Salt:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Salt,
                                            )}
                                            , PH:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.PH,
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td></td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>
                                            {numberWithCommas(data.remaining_volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.remaining_volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {data?.description ? (
                                                data?.description
                                            ) : (
                                                <StyledButton
                                                    disabled={hideAction}
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                    type='primary'
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                        <td>
                                            <StyledButton
                                                disabled={hideAction}
                                                onClick={() => {
                                                    openModalLabs(true)
                                                    setIdRef(data.idsub_orders)
                                                }}
                                                type='primary'
                                            >
                                                ส่งตัวอย่างไปที่ Labs
                                            </StyledButton>
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.ADDONFISHSAUCE && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{!!data.date_action ? dayjs(data.date_action).format('DD/MM/YYYY') : '-'}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td> {numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td> {numberWithCommas(data.amount_price)}</td>
                                        <td>
                                            {numberWithCommas(data.volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            Tn:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Tn,
                                            )}
                                            , Salt:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Salt,
                                            )}
                                            , PH:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.PH,
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td></td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>
                                            {numberWithCommas(data.remaining_volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.remaining_volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {data?.description ? (
                                                data?.description
                                            ) : (
                                                <StyledButton
                                                    disabled={hideAction}
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                    type='primary'
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                        <td>
                                            <StyledButton
                                                disabled={hideAction}
                                                onClick={() => {
                                                    openModalLabs(true)
                                                    setIdRef(data.idsub_orders)
                                                }}
                                                type='primary'
                                            >
                                                ส่งตัวอย่างไปที่ Labs
                                            </StyledButton>
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.TRANSFERSALTWATER && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{!!data.date_action ? dayjs(data.date_action).format('DD/MM/YYYY') : '-'}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td style={{ color: 'red' }}>- {numberWithCommas(data.amount_items)}</td>
                                        <td>{data.amount_unit_per_price}</td>
                                        <td style={{ color: 'red' }}>- {numberWithCommas(data.amount_price)}</td>
                                        <td>
                                            {numberWithCommas(data.volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>บ่อปลายทาง {data?.action_serial_puddle}</td>

                                        <td></td>
                                        <td>
                                            Tn:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Tn,
                                            )}
                                            , Salt:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Salt,
                                            )}
                                            , PH:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.PH,
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td></td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>
                                            {numberWithCommas(data.remaining_volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.remaining_volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {data?.description ? (
                                                data?.description
                                            ) : (
                                                <StyledButton
                                                    disabled={hideAction}
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                    type='primary'
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                        <td>
                                            <StyledButton
                                                disabled={hideAction}
                                                onClick={() => {
                                                    openModalLabs(true)
                                                    setIdRef(data.idsub_orders)
                                                }}
                                                type='primary'
                                            >
                                                ส่งตัวอย่างไปที่ Labs
                                            </StyledButton>
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}

                            {data.type === TypeProcess.IMPORTSALTWATER && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{!!data.date_action ? dayjs(data.date_action).format('DD/MM/YYYY') : '-'}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td> {numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td> {numberWithCommas(data.amount_price)}</td>
                                        <td>
                                            {numberWithCommas(data.volume)} KG |{' '}
                                            {numberWithCommas(Number((data.volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>บ่อที่มา {data?.action_serial_puddle}</td>
                                        <td></td>
                                        <td>
                                            Tn:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Tn,
                                            )}
                                            , Salt:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Salt,
                                            )}
                                            , PH:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.PH,
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td></td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>
                                            {numberWithCommas(data.remaining_volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.remaining_volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {data?.description ? (
                                                data?.description
                                            ) : (
                                                <StyledButton
                                                    disabled={hideAction}
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                    type='primary'
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                        <td>
                                            <StyledButton
                                                disabled={hideAction}
                                                onClick={() => {
                                                    openModalLabs(true)
                                                    setIdRef(data.idsub_orders)
                                                }}
                                                type='primary'
                                            >
                                                ส่งตัวอย่างไปที่ Labs
                                            </StyledButton>
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}

                            {data.type === TypeProcess.IMPORTHITWATER && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{!!data.date_action ? dayjs(data.date_action).format('DD/MM/YYYY') : '-'}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td> {numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td> {numberWithCommas(data.amount_price)}</td>
                                        <td>
                                            {numberWithCommas(data.volume)} KG |{' '}
                                            {numberWithCommas(Number((data.volume / 1).toFixed(2)))} L
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            Tn:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Tn,
                                            )}
                                            , Salt:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Salt,
                                            )}
                                            , PH:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.PH,
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td></td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>
                                            {numberWithCommas(data.remaining_volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.remaining_volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {data?.description ? (
                                                data?.description
                                            ) : (
                                                <StyledButton
                                                    disabled={hideAction}
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                    type='primary'
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                        <td>
                                            <StyledButton
                                                disabled={hideAction}
                                                onClick={() => {
                                                    openModalLabs(true)
                                                    setIdRef(data.idsub_orders)
                                                }}
                                                type='primary'
                                            >
                                                ส่งตัวอย่างไปที่ Labs
                                            </StyledButton>
                                        </td>
                                    </StyledRowTransaction>
                                </>
                            )}
                            {data.type === TypeProcess.IMPORTWATERFISH && (
                                <>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td>{!!data.date_action ? dayjs(data.date_action).format('DD/MM/YYYY') : '-'}</td>
                                        <td>{handleTypeOrder(data.type)}</td>
                                        <td></td>
                                        <td> {numberWithCommas(data.amount_items)}</td>
                                        <td>{numberWithCommas(data.amount_unit_per_price)}</td>
                                        <td> {numberWithCommas(data.amount_price)}</td>
                                        <td>
                                            {numberWithCommas(data.volume)} KG |{' '}
                                            {numberWithCommas(Number((data.volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            Tn:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Tn,
                                            )}
                                            , Salt:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.Salt,
                                            )}
                                            , PH:
                                            {JSON.stringify(
                                                resultTest.find((element: any) => element?.ref === data.idsub_orders)?.PH,
                                            )}
                                        </td>
                                    </StyledRowTransaction>
                                    <StyledRowTransaction isStatus={data.type}>
                                        <td></td>
                                        <td></td>
                                        <td>คงเหลือ</td>
                                        <td>{numberWithCommas(data.remaining_items)}</td>
                                        <td>{numberWithCommas(data.remaining_unit_per_price)}</td>
                                        <td>{numberWithCommas(data.remaining_price)}</td>
                                        <td>
                                            {numberWithCommas(data.remaining_volume)} kg. |{' '}
                                            {numberWithCommas(Number((data.remaining_volume / 1.2).toFixed(2)))} L
                                        </td>
                                        <td>{data.approved === 0 ? 'non approve' : 'approve'}</td>
                                        <td>
                                            {data?.description ? (
                                                data?.description
                                            ) : (
                                                <StyledButton
                                                    disabled={hideAction}
                                                    onClick={() => {
                                                        onSelected(data.idsub_orders)
                                                    }}
                                                    type='primary'
                                                >
                                                    เพิ่มรายละเอียด
                                                </StyledButton>
                                            )}
                                        </td>
                                        <td>
                                            <StyledButton
                                                disabled={hideAction}
                                                onClick={() => {
                                                    openModalLabs(true)
                                                    setIdRef(data.idsub_orders)
                                                }}
                                                type='primary'
                                            >
                                                ส่งตัวอย่างไปที่ Labs
                                            </StyledButton>
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

const HeadTableRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
`
const StyledButton = styled(Button)`
    border-radius: 4px;
`

const StyledRowTransaction = styled.tr<{ isStatus?: number }>`
    ${(p) => {
        switch (p.isStatus) {
            case TypeProcess.TRANSFER:
                return `background:#DEFCBA;`
            case TypeProcess.IMPORT:
                return `background:#FDD298;`
            case TypeProcess.CLEARING:
            case TypeProcess.GETFISHRESIDUE:
                return `background:#D68B8B;`
            case TypeProcess.ADDONFISHSAUCE:
                return `background:#e5cee6;`
            case TypeProcess.ADDONWATERSALT:
                return `background:#dfc5be;`
            case TypeProcess.IMPORTHITWATER:
                return `background:#BEDFDF;`
            case TypeProcess.IMPORTWATERFISH:
                return `background:#CFBEDF;`
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

const StyledButtonAction = styled(Button)`
    border-radius: 2px;
`
