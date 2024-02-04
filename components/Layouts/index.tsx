import { DeploymentUnitOutlined, MenuOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Button, Divider, Layout, Menu, Drawer, Avatar } from 'antd'
import { MenuProps } from 'antd/lib/menu'
import React, { ReactNode, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import NextImage from 'next/image'

import { IUserInfo } from '../../share-module/auth/type'
import { useNavigation } from '../../utils/use-navigation'
import { userInfoTask } from '../../share-module/auth/task'

interface ILayout {
    children: ReactNode
    hideSidebar?: boolean
    isFullscreen?: boolean
}

const { Header, Content, Sider, Footer } = Layout

const AppLayout = (props: ILayout) => {
    const { children, hideSidebar = false, isFullscreen = false } = props
    const { data: userInfoData, onRequest: userInfoRequest } = userInfoTask.useTask()
    const router = useRouter()
    const navigation = useNavigation()
    const [defaultKey, setDefaultKey] = useState('/')
    const [myInfo, setMyInfo] = useState<IUserInfo>()
    const [visible, setVisible] = useState(false)
    const placement = 'left'
    const [collapsed, setCollapsed] = useState(false)

    const menuItems = [
        { key: '/', name: 'ระบบจัดการ การเดินน้ำปลา' },
        { key: '/fish-bill', name: 'ระบบบิลปลา' },
        { key: '/salt-bill', name: 'ระบบบิลเกลือ และ น้ำเกลือ' },
        { key: '/fishsauce-bill', name: 'ระบบบิลน้ำปลา' },
        { key: '/ampan-bill', name: 'ระบบบิลน้ำรถน้าอำพัน' },
        { key: '/fishy-bill', name: 'ระบบบิลน้ำคาว' },
        { key: '/process-management-setting', name: 'ตั้งค่า' },

        // { key: '/c', name: 'Accounting Doc' },
        // { key: '/d', name: 'Setting' },
    ]
    const menuItems_CUSTOMER = [
        { key: '/customer-management/fish-customer', name: 'ผู้จำหน่ายปลา' },
        { key: '/customer-management/fishsauce-customer', name: 'ผู้จำหน่ายปลาน้ำปลา' },
        { key: '/customer-management/solid-salt-customer', name: 'ผู้จำหน่ายเกลือ' },
        { key: '/customer-management/salt-water-customer', name: 'ผู้จำหน่ายน้ำเกลือ' },
        { key: '/customer-management/ampan-customer', name: 'ผู้จำหน่ายน้ำรถน้าอำพัน' },
        { key: '/customer-management/fishy-customer', name: 'ผู้จำหน่ายน้ำคาว' },
    ]

    const menuItems_ACCOUNT = [{ key: '/menuItems_ACCOUNT', name: 'Coming soon' }]
    const menuItems_PRODUCT = [{ key: '/menuItems_PRODUCT', name: 'Coming soon' }]
    const menuItems_STOCK = [{ key: '/menuItems_STOCK', name: 'Coming soon' }]
    const menuItems_USER = [{ key: '/menuItems_USER', name: 'Coming soon' }]

    const itemsMenu: MenuProps['items'] = menuItems.map((text) => {
        return {
            key: `${text.key}`,
            label: `${text.name}`,
        }
    })

    const itemsMenu_CUSTOMER: MenuProps['items'] = menuItems_CUSTOMER.map((text) => {
        return {
            key: `${text.key}`,
            label: `${text.name}`,
        }
    })

    const itemsMenu_ACCOUNT: MenuProps['items'] = menuItems_ACCOUNT.map((text) => {
        return {
            key: `${text.key}`,
            label: `${text.name}`,
        }
    })
    const itemsMenu_PRODUCT: MenuProps['items'] = menuItems_PRODUCT.map((text) => {
        return {
            key: `${text.key}`,
            label: `${text.name}`,
        }
    })
    const itemsMenu_STOCK: MenuProps['items'] = menuItems_STOCK.map((text) => {
        return {
            key: `${text.key}`,
            label: `${text.name}`,
        }
    })
    const itemsMenu_USER: MenuProps['items'] = menuItems_USER.map((text) => {
        return {
            key: `${text.key}`,
            label: `${text.name}`,
        }
    })

    const stringAvatar = (name: string) => {
        if (name) {
            const uppercaseName = name[0].toUpperCase()
            const uppercaseLastName = name[1].toUpperCase()
            return `${uppercaseName.split(' ')[0][0]}${uppercaseLastName.split(' ')[0][0]}`
        }
    }

    useEffect(() => {
        ;(async () => {
            if (userInfoData?.success === 'success') {
                setMyInfo(userInfoData.message)
                setDefaultKey(`${router.pathname}`)
            } else {
                const res = await userInfoRequest()
                setMyInfo(res.message)
            }
        })()
    }, [router.pathname, userInfoData])

    const showDrawer = () => {
        setVisible(true)
    }

    const onClose = () => {
        setVisible(false)
    }

    const handleSignOut = () => {
        Cookies.remove('accessToken')
        navigation.navigateTo.signin()
        // set('accessToken', data.message.token, {
        //     expires: new Date(Date.now() + 36000 * 1000),
        // })
    }

    const CardInfo = () => {
        return (
            <WrapCardInfo>
                <StyledAvatar size='large' style={{ backgroundColor: '#51459E', verticalAlign: 'middle', marginBottom: '16px' }}>
                    {stringAvatar(myInfo?.name)}
                </StyledAvatar>
                {myInfo && (
                    <WrapDetailInfo>
                        <p style={{ padding: 0, margin: 0 }}>{myInfo?.name.toUpperCase()}</p>
                        <p style={{ padding: 0, margin: 0 }}>{myInfo?.phone}</p>
                        <p style={{ padding: 0, margin: 0 }}>{myInfo?.uuid}</p>
                    </WrapDetailInfo>
                )}
                <Divider style={{ backgroundColor: '#FFFFFF66' }} type='horizontal' />
            </WrapCardInfo>
        )
    }

    const FLAGHIDDENINFO = false
    const MenuPath = (props: { hideUserInfo?: boolean }) => {
        const { hideUserInfo = false } = props
        return (
            <>
                {FLAGHIDDENINFO && !hideUserInfo && (
                    <WrapMenuCardInfo>
                        <CardInfo />
                    </WrapMenuCardInfo>
                )}

                <StyledTitleMenu>PROCESS MENAGEMENT</StyledTitleMenu>
                <StyledMenu
                    defaultSelectedKeys={[defaultKey]}
                    items={itemsMenu}
                    mode='inline'
                    onSelect={(values) => {
                        router.push(values.key)
                    }}
                    style={{ height: '100%', borderRight: 0 }}
                    theme='dark'
                />
                {/* itemsMenu_CUSTOMER */}
                <StyledTitleMenu>CUSTOMER MENAGEMENT</StyledTitleMenu>
                <StyledMenu
                    defaultSelectedKeys={[defaultKey]}
                    items={itemsMenu_CUSTOMER}
                    mode='inline'
                    onSelect={(values) => {
                        router.push(values.key)
                    }}
                    style={{ height: '100%', borderRight: 0 }}
                    theme='dark'
                />
                <StyledTitleMenu>ACCOUNT MENAGEMENT</StyledTitleMenu>
                <StyledMenu
                    defaultSelectedKeys={[defaultKey]}
                    items={itemsMenu_ACCOUNT}
                    mode='inline'
                    onSelect={(values) => {
                        router.push(values.key)
                    }}
                    style={{ height: '100%', borderRight: 0 }}
                    theme='dark'
                />
                <StyledTitleMenu>PRODUCT MENAGEMENT</StyledTitleMenu>
                <StyledMenu
                    defaultSelectedKeys={[defaultKey]}
                    items={itemsMenu_PRODUCT}
                    mode='inline'
                    onSelect={(values) => {
                        router.push(values.key)
                    }}
                    style={{ height: '100%', borderRight: 0 }}
                    theme='dark'
                />
                <StyledTitleMenu>STOCK MENAGEMENT</StyledTitleMenu>
                <StyledMenu
                    defaultSelectedKeys={[defaultKey]}
                    items={itemsMenu_STOCK}
                    mode='inline'
                    onSelect={(values) => {
                        router.push(values.key)
                    }}
                    style={{ height: '100%', borderRight: 0 }}
                    theme='dark'
                />
                <StyledTitleMenu>USER MENAGEMENT</StyledTitleMenu>
                <StyledMenu
                    defaultSelectedKeys={[defaultKey]}
                    items={itemsMenu_USER}
                    mode='inline'
                    onSelect={(values) => {
                        router.push(values.key)
                    }}
                    style={{ height: '100%', borderRight: 0 }}
                    theme='dark'
                />
            </>
        )
    }

    return (
        <StyledLayOut>
            <WrapHeader>
                <HeaderLogo
                    onClick={() => {
                        navigation.navigateTo.home()
                    }}
                >
                    {/* <DeploymentUnitOutlined
                        style={{ fontWeight: '700', fontSize: '18px', color: '#f0b90b', marginRight: '8px' }}
                    />
                     */}
                    <NextImage alt='RUNGROJ' height={60} src='https://jaw.sgp1.digitaloceanspaces.com/Logo-RFS.jpg' width={100} />
                    {/* <div className='logo'>{process.env.NEXT_PUBLIC_NAME_PLATFORM}</div> */}
                    <HeadingContainer>
                        <Heading>
                            <PageHeading>
                                RUNGROJ <NEXTHighlight>ERP</NEXTHighlight>
                            </PageHeading>
                        </Heading>
                    </HeadingContainer>
                </HeaderLogo>
                {/* <StyledSearch placeholder='ค้นหาเอกสารที่ต้องการ' suffix={<SearchOutlined />} /> */}
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: () => setCollapsed(!collapsed),
                })}
                <StyledMenuIcon
                    className='menu-icon'
                    onClick={showDrawer}
                    style={{ fontSize: '16px', color: '#FFFFFF', cursor: 'pointer' }}
                />
            </WrapHeader>
            <WrapperDrawer
                key={placement}
                onClose={onClose}
                placement={placement}
                style={{ background: 'white' }}
                title={
                    <HeaderLogo>
                        <DeploymentUnitOutlined
                            style={{ fontWeight: '700', fontSize: '18px', color: '#f0b90b', marginRight: '8px' }}
                        />
                        <div className='logo'>{process.env.NEXT_PUBLIC_NAME_PLATFORM}</div>
                    </HeaderLogo>
                }
                visible={visible}
            >
                <MenuPath />
            </WrapperDrawer>

            <Layout>
                {!hideSidebar && (
                    <WrapSider
                        breakpoint='lg'
                        collapsed={collapsed}
                        collapsedWidth='0'
                        collapsible
                        style={{ padding: '10px 10px', height: '100%' }}
                        trigger={null}
                        width={295}
                    >
                        <MenuPath />

                        <br />
                        <div style={{ padding: '20px' }}>
                            <StyledButtonGradient onClick={handleSignOut} size='large'>
                                SIGNOUT
                            </StyledButtonGradient>
                        </div>
                    </WrapSider>
                )}

                <StyledContent
                    isFullscreen={isFullscreen}
                    style={{
                        padding: 24,
                        margin: 0,
                    }}
                >
                    {children}
                </StyledContent>
            </Layout>
            <StyledFooter>Rungroj Fish Sauce Co., Ltd. ©2023 Created by Blue Square</StyledFooter>
        </StyledLayOut>
    )
}

export default AppLayout

const StyledButtonGradient = styled(Button)`
    width: 100%;
    background: linear-gradient(107.85deg, #df2222 0%, #00b2ff 139.5%);
    color: #fff;
    border: none;
    transition: background-color 0.3s;
    &&:hover {
        background: linear-gradient(107.85deg, #ff0000 0%, #00b2ff 139.5%);
        color: #fff !important;
        border: none;
    }
`

const NEXTHighlight = styled.span`
    background: linear-gradient(107.85deg, #51459e 0%, #00b2ff 139.5%);
    font-size: 24px !important;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`

const Heading = styled.div`
    padding-left: 32px;
`

const PageHeading = styled.div`
    font-weight: 550;
    font-size: 24px;
    line-height: 0.75;
    line-height: 55px;
`

const HeadingContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
`

const StyledAvatar = styled(Avatar)`
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`

// TODO:
// const MenuWrapper = styled.div<{ $active: boolean }>`
//     height: 48px;
//     margin: 8px auto;
//     display: flex;
//     align-items: center;
//     border-left: 4px solid white;
//     cursor: pointer;
//     ${({ $active }) =>
//         $active &&
//         css`
//             border-left: 4px solid #47d344;
//             background: #e7f7ef;
//             margin: 8px -18px;
//             padding: 18px;
//         `}
// `

// const StyledLogOut = styled(Button)`
//     width: 100%;
//     border-radius: 8px;
//     color: white;
//     background: #f5222d;
//     border-color: transparent;
//     &:hover {
//         color: white;
//         border-color: #f53841;
//         background: #f53841;
//         box-shadow: 0 1px 10px #f5222d;
//     }
// `
const StyledMenuIcon = styled(MenuOutlined)`
    cursor: pointer;
    @media only screen and (min-width: 769px) {
        display: none;
    }
`
const WrapperDrawer = styled(Drawer)`
    .ant-drawer-header {
        // background: rgb(35, 37, 43);
    }
    .ant-drawer-title {
        color: #ffffff !important;
    }
    .ant-drawer-header-title .ant-drawer-close .anticon {
        color: #ffffff66 !important;
    }
    .ant-drawer-body {
        padding: 0px;
        overflow: hidden;
        // background: rgb(26, 28, 33);
        padding: 10px 20px;
    }
`

const HeaderLogo = styled.span`
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding-top: 12px;
    padding-bottom: 12px;
`
const StyledTitleMenu = styled.p`
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 0;
    padding-left: 16px;
    color: #000000;
`
const StyledMenu = styled(Menu)`
    background: transparent !important;

    // &&.ant-layout-sider .ant-layout-sider-dark{
    //     background: red !important;
    // }

    &&.ant-menu-dark.ant-menu-inline .ant-menu-item {
        border-radius: 0px 20px 20px 0px !important;
        margin-left: 0;
    }

    &&.ant-menu-dark.ant-menu-inline .ant-menu-item span {
        padding-left: 16px;
    }

    &&.ant-menu-dark.ant-menu-inline .ant-menu-item {
        color: #00000096;
    }
    &&.ant-menu-dark.ant-menu-inline .ant-menu-item.ant-menu-item-selected {
        color: white !important;
        background: linear-gradient(107.85deg, #51459e 0%, #00b2ff 139.5%);
    }
`
const StyledLayOut = styled(Layout)`
    min-height: 100vh;
    overflow: hidden;
    &&.ant-layout .ant-layout-sider {
        height: 100%;
        background: white !important;
        /* background: linear-gradient(180deg, #57696a 0%, #252a2f 119.79%) !important; */
    }
`
const StyledContent = styled(Content)<{ isFullscreen?: boolean }>`
    width: 100%;
    ${({ isFullscreen }) =>
        isFullscreen &&
        css`
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
        `}
    height: auto;
    background: #f7f8f9;
    min-height: 100vh;
    color: black;
    border-left: 1px solid #00000011;
`
const WrapHeader = styled(Header)`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    color: #000000;
    font-size: 24px;
    font-weight: 700;
    height: 75px;
    padding: 0 30px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2) !important;
    span {
        font-size: 16px;
    }
    @media only screen and (max-width: 769px) {
        justify-content: space-between;
    }
`
const StyledFooter = styled(Footer)`
    width: 100%;
    text-align: center;
    background: rgb(35, 37, 43);
    color: #ffffff;
    font-size: 12px;
`

const WrapMenuCardInfo = styled.div`
    margin-top: 24px;
    width: 100%;
`

const WrapDetailInfo = styled.div`
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #000000;
`

const WrapCardInfo = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    column-gap: 12px;
    background: transparent;
    border-radius: 8px;
    text-align: center;
`

const WrapSider = styled(Sider)`
    padding: 24px 0px 0px 0px !important;
    height: 100%;
    width: 260px;
    min-height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* color: white; */
    /* background: linear-gradient(180deg, #57696a 0%, #252a2f 119.79%) !important; */
    @media only screen and (max-width: 769px) {
        display: none;
    }
    background: #ffffff;
`
