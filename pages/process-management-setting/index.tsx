import React, { ReactElement, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { Button, Form, Input, Modal, Spin } from 'antd'
import { Colorpicker } from 'antd-colorpicker'

import AppLayout from '../../components/Layouts'
import { NextPageWithLayout } from '../_app'
import { getTypeProcessTask, submitTypeProcessTask } from '../../share-module/puddle/task'
import { NoticeError, NoticeSuccess } from '../../utils/noticeStatus'
import {
    createFishTypeTask,
    createWorkingStatusTask,
    deleteFishTypeTask,
    deleteWorkingStatusTask,
    getAllFeeLaborFermentTask,
    getAllFeeLaborPerBuildingTask,
    getListFishTypeTask,
    getWorkingStatusTypeTask,
    updateFeeLaborFermentTask,
    updateFeeLaborPerBuildingTask,
} from '../../share-module/order/task'
import { numberWithCommas } from '../../utils/format-number'

interface ICostLaborPerBuildingDto {
    idlabor_price_per_building: number
    building: number
    price: number
    date_create: string
    idbuilding: number
    name: string
}
const ProcessManagementSetting: NextPageWithLayout = () => {
    const [valueTypeProcess, setValueTypeProcess] = useState(null)
    const [valueCostLaborFerment, setValueCostLaborFerment] = useState('0')
    const [idCostLaborFerment, setIdCostLaborFerment] = useState(null)
    const [visibleModal, setVisibleModal] = useState(false)
    const [stateUpdateCostPerBuilding, setStateUpdateCostPerBuilding] = useState<ICostLaborPerBuildingDto>(null)
    const [valueCostLaborByBuilding, setValueCostLaborByBuilding] = useState('0')
    const [valueFishType, setValueFishType] = useState(null)
    const [titleWorkingStatus, setTitleWorkingStatus] = useState(null)
    const [colorWorkingStatus, setColorWorkingStatus] = useState(null)

    const initialValues = { color: { r: 26, g: 14, b: 85, a: 1 } }

    // titleWorkingStatus

    const getTypeProcess = getTypeProcessTask.useTask()
    const submitTypeProcess = submitTypeProcessTask.useTask()
    const getAllFeeLaborFerment = getAllFeeLaborFermentTask.useTask()
    const updateFeeLaborFerment = updateFeeLaborFermentTask.useTask()
    const getAllFeeLaborPerBuilding = getAllFeeLaborPerBuildingTask.useTask()
    const updateFeeLaborPerBuilding = updateFeeLaborPerBuildingTask.useTask()
    const getListFishType = getListFishTypeTask.useTask()
    const createFishType = createFishTypeTask.useTask()
    const deleteFishType = deleteFishTypeTask.useTask()
    const getListWorkingStatus = getWorkingStatusTypeTask.useTask()
    const createWorkingStatus = createWorkingStatusTask.useTask()
    const deleteWorkingStatus = deleteWorkingStatusTask.useTask()

    useEffect(() => {
        ;(async () => {
            await getTypeProcess.onRequest()
            await getAllFeeLaborPerBuilding.onRequest()
            await getListFishType.onRequest()
            await getListWorkingStatus.onRequest()
            const costLaborFerment = await getAllFeeLaborFerment.onRequest()
            setIdCostLaborFerment(costLaborFerment.idlabor_price_ferment)
        })()
    }, [])

    const handleSubmitUpdateCostLaborFerment = async () => {
        try {
            if (idCostLaborFerment === null) {
                return
            } else {
                await updateFeeLaborFerment.onRequest({
                    id_price: Number(idCostLaborFerment),
                    price: Number(valueCostLaborFerment),
                })

                NoticeSuccess('ทำรายการสำเร็จ')
                setValueCostLaborFerment('0')
            }
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
            setValueCostLaborFerment('0')
        }
    }

    const handleSubmitCreateFishType = async () => {
        try {
            if (valueFishType === null || valueFishType === '') {
                return
            } else {
                await createFishType.onRequest({ name: valueFishType })
                await getListFishType.onRequest()
                NoticeSuccess('ทำรายการสำเร็จ')
                setValueFishType(null)
            }
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
            setValueFishType(null)
        }
    }
    const handleDeleteFishType = async (id: number) => {
        try {
            await deleteFishType.onRequest({ idfish_type: id })
            await getListFishType.onRequest()
            NoticeSuccess('ทำรายการสำเร็จ')
            setValueFishType(null)
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
            setValueFishType(null)
        }
    }

    const handleChangeColor = async (value: any) => {
        setColorWorkingStatus(value.hex)
    }

    const handleSubmitCreateWorkingStatus = async () => {
        try {
            if (titleWorkingStatus === null || titleWorkingStatus === '') {
                return
            } else {
                await createWorkingStatus.onRequest({ title: titleWorkingStatus, color: colorWorkingStatus.toString() })
                await getListWorkingStatus.onRequest()
                NoticeSuccess('ทำรายการสำเร็จ')
            }
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setTitleWorkingStatus(null)
            setColorWorkingStatus(null)
        }
    }

    const handleDeleteWorkingStatus = async (id: number) => {
        try {
            await deleteWorkingStatus.onRequest({ idworking_status: id })
            await getListWorkingStatus.onRequest()
            NoticeSuccess('ทำรายการสำเร็จ')
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
        } finally {
            setTitleWorkingStatus(null)
            setColorWorkingStatus(null)
        }
    }

    const handleSubmitTypeProcessTask = async () => {
        try {
            if (valueTypeProcess === null || valueTypeProcess === '') {
                return
            } else {
                await submitTypeProcess.onRequest({ process_name: valueTypeProcess })
                await getTypeProcess.onRequest()
                NoticeSuccess('ทำรายการสำเร็จ')
                setValueTypeProcess(null)
            }
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
            setValueTypeProcess(null)
        }
    }

    const openModalUpdateCost = (data: ICostLaborPerBuildingDto) => {
        setStateUpdateCostPerBuilding(data)
        setVisibleModal(true)
    }

    const handleSubmitUpdateCostLaborByBuilding = async () => {
        try {
            if (stateUpdateCostPerBuilding === null || valueCostLaborByBuilding === null || valueCostLaborByBuilding === '') {
                return
            } else {
                const payload = {
                    id_price: Number(stateUpdateCostPerBuilding.idlabor_price_per_building),
                    price: Number(valueCostLaborByBuilding),
                }

                await updateFeeLaborPerBuilding.onRequest(payload)

                NoticeSuccess('ทำรายการสำเร็จ')
                setValueCostLaborByBuilding('0')
            }
        } catch (e: any) {
            NoticeError('ทำรายการไม่สำเร็จ')
            setValueCostLaborByBuilding('0')
        } finally {
            await getAllFeeLaborPerBuilding.onRequest()
            setVisibleModal(false)
        }
    }

    return (
        <Main>
            <Container>
                <BoxContent>
                    <HeaderBoxContent>รายการ การทำงาน</HeaderBoxContent>
                    <Content>
                        <StyledUl>
                            {getTypeProcess?.data?.map((data, index) => (
                                <li key={index}>{data.process_name}</li>
                            ))}
                        </StyledUl>
                        <Input
                            onChange={(e) => {
                                setValueTypeProcess(e.target.value)
                            }}
                            placeholder='เพิ่มรายการการทำงาน'
                            value={valueTypeProcess}
                        />
                        <StyledButton block onClick={handleSubmitTypeProcessTask} type='primary'>
                            ตกลง
                        </StyledButton>
                    </Content>
                </BoxContent>
                <BoxContent>
                    <HeaderBoxContent>ค่าแรงดองปลา</HeaderBoxContent>
                    <Content>
                        <StyledSpan>ค่าแรงดองปลา {getAllFeeLaborFerment.data?.price} บาท/กก. ค่าแรงลงปลา ต่อ บ่อ</StyledSpan>
                        <Input
                            onChange={(e) => {
                                setValueCostLaborFerment(e.target.value)
                            }}
                            placeholder='ค่าแรงดองปลา'
                            value={valueCostLaborFerment}
                        />
                        <StyledButton block onClick={handleSubmitUpdateCostLaborFerment} type='primary'>
                            อัพเดทค่าแรงดองปลา
                        </StyledButton>
                    </Content>
                </BoxContent>
                <BoxContent>
                    <HeaderBoxContent>ค่าแรงในแต่ละอาคาร</HeaderBoxContent>
                    <Content>
                        {getAllFeeLaborPerBuilding?.data ? (
                            <StyledTable>
                                <tr>
                                    <th>อาคาร</th>
                                    <th>ค่าเเรง</th>
                                    <th>action</th>
                                </tr>
                                {getAllFeeLaborPerBuilding?.data.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.name}</td>
                                        <td>{numberWithCommas(data.price)}</td>
                                        <td>
                                            <StyledButton
                                                onClick={() => {
                                                    openModalUpdateCost(data)
                                                }}
                                                type='primary'
                                            >
                                                อัพเดท
                                            </StyledButton>
                                        </td>
                                    </tr>
                                ))}
                                {/* {!getAllFeeLaborPerBuilding.data ?} */}
                            </StyledTable>
                        ) : (
                            <LoadingSections>
                                <Spin size='large' tip='Loading...' />
                            </LoadingSections>
                        )}
                    </Content>
                </BoxContent>

                <BoxContent>
                    <HeaderBoxContent>ชนิดของปลา</HeaderBoxContent>
                    <Content>
                        {getListFishType?.data ? (
                            <StyledTable>
                                <tr>
                                    {/* <th>id</th> */}
                                    <th>ปลา</th>
                                    <th>action</th>
                                </tr>
                                {getListFishType?.data.map((data, index) => (
                                    <tr key={index}>
                                        {/* <td>{data.idfish_type}</td> */}
                                        <td>{data.name}</td>
                                        <td>
                                            <StyledButton
                                                onClick={() => {
                                                    handleDeleteFishType(data.idfish_type)
                                                }}
                                                type='primary'
                                            >
                                                ลบ
                                            </StyledButton>
                                        </td>
                                    </tr>
                                ))}
                                {/* {!getAllFeeLaborPerBuilding.data ?} */}
                            </StyledTable>
                        ) : (
                            <LoadingSections>
                                <Spin size='large' tip='Loading...' />
                            </LoadingSections>
                        )}
                        <br />
                        <Input
                            onChange={(e) => {
                                setValueFishType(e.target.value)
                            }}
                            placeholder='เพิ่มชนิดของปลา'
                            value={valueFishType}
                        />
                        <StyledButton block onClick={handleSubmitCreateFishType} type='primary'>
                            ตกลง
                        </StyledButton>
                    </Content>
                </BoxContent>

                <BoxContent>
                    <HeaderBoxContent>Working Status</HeaderBoxContent>
                    <Content isMinHeight={'800'}>
                        {getListWorkingStatus?.data ? (
                            <StyledTable>
                                <tr>
                                    <th>status</th>
                                    <th>color</th>
                                    <th>action</th>
                                </tr>
                                {getListWorkingStatus?.data.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.title}</td>
                                        <td>
                                            <div
                                                style={{
                                                    width: '80px',
                                                    height: '30px',
                                                    borderRadius: '4px',
                                                    backgroundColor: data.color,
                                                }}
                                            ></div>
                                        </td>
                                        <td>
                                            <StyledButton
                                                onClick={() => {
                                                    handleDeleteWorkingStatus(data.idworking_status)
                                                }}
                                                type='primary'
                                            >
                                                ลบ
                                            </StyledButton>
                                        </td>
                                    </tr>
                                ))}
                            </StyledTable>
                        ) : (
                            <LoadingSections>
                                <Spin size='large' tip='Loading...' />
                            </LoadingSections>
                        )}
                        <br />

                        <Form initialValues={initialValues} style={{ width: '100%' }}>
                            <Form.Item style={{ width: '100%' }}>
                                <Input
                                    onChange={(e) => {
                                        setTitleWorkingStatus(e.target.value)
                                    }}
                                    placeholder='Working Status'
                                    value={titleWorkingStatus}
                                />
                                {/* <Button type='primary' htmlType='submit'>
                                    Show values in console
                                </Button> */}
                            </Form.Item>{' '}
                            <Form.Item label={'Colorpicker'} name={`color`}>
                                <Colorpicker onChange={handleChangeColor} popup />
                            </Form.Item>
                        </Form>

                        <StyledButton block onClick={handleSubmitCreateWorkingStatus} type='primary'>
                            ตกลง
                        </StyledButton>
                    </Content>
                </BoxContent>
            </Container>

            <StyledModal
                centered
                onCancel={() => {
                    setVisibleModal(false)
                }}
                onOk={() => {
                    handleSubmitUpdateCostLaborByBuilding()
                }}
                open={visibleModal}
                title={`อัพเดทราคาค่าแรง ณ ${stateUpdateCostPerBuilding?.name}`}
            >
                {/* <StyledContentModal> */}
                <span className='content'>ค่าเเรงเดิม {stateUpdateCostPerBuilding?.price}</span>

                <Input
                    onChange={(e) => {
                        setValueCostLaborByBuilding(e.target.value)
                    }}
                    placeholder='ค่าแรงใหม่'
                    value={valueCostLaborByBuilding}
                />
                {/* </StyledContentModal> */}
            </StyledModal>
        </Main>
    )
}

ProcessManagementSetting.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>
            <>{page}</>
        </AppLayout>
    )
}

export default ProcessManagementSetting

const StyledModal = styled(Modal)`
    .ant-modal-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
        height: fit-content;
    }
`

// const StyledContentModal = styled.div`
//     width: 100%;

//     &&
// `

const LoadingSections = styled.div`
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
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

const StyledSpan = styled.span`
    margin-bottom: 12px;
`
const StyledButton = styled(Button)`
    border-radius: 4px;
    margin: 10px 0px;
`

const StyledUl = styled.ul`
    margin-left: 24px;
`
const Content = styled.div<{ isMinHeight?: string }>`
    width: 100%;
    height: fit-content;
    max-height: 300px;
    overflow: auto;
    padding: 24px;
    display: flex;
    align-items: start;
    flex-direction: column;
    ${({ isMinHeight }) =>
        isMinHeight &&
        css`
            min-height: ${isMinHeight}px;
            max-height: 100%;
        `}
`

const Main = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
`
const Container = styled.div`
    width: 100%;
    max-width: 1280px;
`
const BoxContent = styled.div`
    width: 100%;
    height: 100%;
    margin-bottom: 24px;
    -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    border-radius: 5px;
`

const HeaderBoxContent = styled.div`
    width: 100%;
    background: rgb(26, 28, 33);
    padding: 12px;
    color: white;
    border-radius: 8px 8px 0px 0px;
    font-size: 20px;
    font-weight: 500;
`
