import React, { ReactElement } from 'react'
import Head from 'next/head'
import { Breadcrumb, Button, Tag } from 'antd'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import AppLayout from '../../../../components/Layouts'
import { NextPageWithLayout } from '../../../_app'
import { useNavigation } from '../../../../utils/use-navigation'

const DetailPuddlePage: NextPageWithLayout = () => {
    const router = useRouter()
    const navigation = useNavigation()
    const { building_id, puddle_id } = router.query
    return (
        <>
            <Head>
                <title>Puddle | Jaw Management</title>
                <meta content='Jaw Management' name='description' />
                <meta content='width=device-width, initial-scale=1' name='viewport' />
                <link href='/favicon.ico' rel='icon' />
            </Head>
            <Breadcrumb style={{ margin: '16px 0', fontSize: '12px' }}>
                <Breadcrumb.Item>Process Menagement</Breadcrumb.Item>
                <StyledBreadcrumbItem
                    onClick={() => {
                        navigation.navigateTo.home()
                    }}
                >
                    อาคารทั้งหมด
                </StyledBreadcrumbItem>
                <StyledBreadcrumbItem
                    onClick={() => {
                        navigation.navigateTo.allPuddle(building_id as string)
                    }}
                >
                    รหัสอาคาร {building_id}
                </StyledBreadcrumbItem>
                <StyledBreadcrumbItem>รหัสบ่อ {puddle_id}</StyledBreadcrumbItem>
            </Breadcrumb>

            <StyledBoxHeader>
                <StyledTitleBoxHeader>
                    <span>บ่อหมายเลข {puddle_id}</span>
                    <StyledTag color='#2db7f5'>สถานะว่าง</StyledTag>
                </StyledTitleBoxHeader>

                <StyledButton type='primary'>ลงทะเบียนบ่อ</StyledButton>
            </StyledBoxHeader>
        </>
    )
}

DetailPuddlePage.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>
            <>{page}</>
        </AppLayout>
    )
}

export default DetailPuddlePage

const StyledTag = styled(Tag)<{ isStatus?: number }>`
    border-radius: 12px;
    font-size: 12px;
    padding: 0px 15px;
`

const StyledTitleBoxHeader = styled.div`
    display: flex;
    align-items: start;
    justify-content: center;
    flex-direction: column;
`
const StyledBreadcrumbItem = styled(Breadcrumb.Item)`
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
const StyledButton = styled(Button)`
    border-radius: 4px;
`
