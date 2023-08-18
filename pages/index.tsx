import React, { ReactElement, useEffect, useState } from 'react'
import { Breadcrumb, Button, Col, Row } from 'antd'
import Head from 'next/head'
import styled from 'styled-components'

import AppLayout from '../components/Layouts'
import { getAllBuildingTask } from '../share-module/building/task'
import { IAllBuildingAndPuddleDto } from '../share-module/building/type'
import { NextPageWithLayout } from './_app'
import { useNavigation } from '../utils/use-navigation'
import { loginTask, userInfoTask } from '../share-module/auth/task'

const Home: NextPageWithLayout = () => {
    const navigation = useNavigation()
    const [building, setBuilding] = useState<IAllBuildingAndPuddleDto[]>([])
    const getAllBuildings = getAllBuildingTask.useTask()
    const { data: loginToken } = loginTask.useTask()
    const { data: userInfoData } = userInfoTask.useTask()

    useEffect(() => {
        ;(async () => {
            if (loginToken?.message?.token || userInfoData?.message?.accessToken) {
                const result = await getAllBuildings.onRequest()
                setBuilding(result)
            }
        })()
    }, [loginToken, userInfoData])

    return (
        <>
            <Head>
                <title>Dashboard | Jaw Management</title>
                <meta content='Jaw Management' name='description' />
                <meta content='width=device-width, initial-scale=1' name='viewport' />
                <link href='/favicon.ico' rel='icon' />
            </Head>

            <Breadcrumb style={{ margin: '16px 0', fontSize: '12px' }}>
                <Breadcrumb.Item>Process Menagement</Breadcrumb.Item>
                <Breadcrumb.Item>อาคารทั้งหมด</Breadcrumb.Item>
            </Breadcrumb>
            <StyledBoxHeader>
                <span>อาคารทั้งหมด</span>
                <StyledButton type='primary'>ลงทะเบียนอาคาร</StyledButton>
            </StyledBoxHeader>
            <br />
            <Row gutter={[16, 16]}>
                {Boolean(building?.length) &&
                    building.map((data, index) => (
                        <Col key={index} md={12} sm={24} xs={24}>
                            <StyledGlassBox>
                                <StyledTitleBetween>
                                    <span style={{ fontSize: '16px' }}>{data.name}</span>
                                    <span>จำนวนบ่อทั้งหมด : {data.allPuddle} บ่อ</span>
                                </StyledTitleBetween>
                                <StyledTitleBetween>
                                    <span style={{ fontSize: '16px' }}></span>
                                    <span>ลิมิต : {data.limit_pool} บ่อ</span>
                                </StyledTitleBetween>
                                <br />
                                <StyledTitleBetween>
                                    <span style={{ fontSize: '16px' }}></span>

                                    <StyledButton
                                        key={index}
                                        onClick={() => {
                                            navigation.navigateTo.allPuddle(data.idbuilding.toString())
                                        }}
                                        size='middle'
                                        type='ghost'
                                    >
                                        รายละเอียด
                                    </StyledButton>
                                </StyledTitleBetween>
                            </StyledGlassBox>
                        </Col>
                    ))}
            </Row>
        </>
    )
}

Home.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>
            <>{page}</>
        </AppLayout>
    )
}

export default Home

const StyledButton = styled(Button)`
    border-radius: 8px;
`
const StyledTitleBetween = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
`
const StyledGlassBox = styled.div`
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5.3px);
    -webkit-backdrop-filter: blur(5.3px);
    width: 100%;
    padding: 10px 20px;
    cursor: pointer;
`
const StyledBoxHeader = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5.3px);
    -webkit-backdrop-filter: blur(5.3px);
    width: 100%;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`
