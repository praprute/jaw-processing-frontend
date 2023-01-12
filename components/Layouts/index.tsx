import { DeploymentUnitOutlined, MenuOutlined } from '@ant-design/icons'
import { Divider, DrawerProps } from 'antd'

import { Layout, Menu, Drawer, Avatar } from 'antd'

import { MenuProps } from 'antd/lib/menu'
import React, { ReactNode, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { IUserInfo } from '../../share-module/auth/type'
import { myToken, userInfo } from '../../share-module/auth'

export interface ILayout {
  children: ReactNode
}

const { Header, Content, Sider, Footer } = Layout

const AppLayout = (props: ILayout) => {
  const { children } = props
  const router = useRouter()
  const [defaultKey, setDefaultKey] = useState('/')
  const [myInfo, setMyInfo] = useState<IUserInfo>()
  const [visible, setVisible] = useState(false)
  const [placement, setPlacement] = useState<DrawerProps['placement']>('left')

  const menuItems = [
    { key: '/', name: 'Dashboard' },
    { key: '/signin', name: 'Signin' }
  ]

  const itemsMenu: MenuProps['items'] = menuItems.map((text, index) => {
    const key = String(index + 1)

    return {
      key: `${text.key}`,
      label: `${text.name}`
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
      const getToken = await myToken()
      const result = await userInfo(getToken as string)
      console.log(result)
      if (result.success === 'success') {
        setMyInfo(result.message[0])
        setDefaultKey('/')
      }
    })()
  }, [router.pathname])

  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

  //TODO : PERMISSION FEATURE
  // useEffect(() => {
  //   if (myInfo && router.pathname) {
  //     if (myInfo?.role === 1) {
  //       itemsMenuSeller.map((element, index) => {
  //         if (router.pathname === element.key) {
  //           return setDefaultKey(element.key)
  //         }
  //       })
  //     } else {
  //       itemsMenu.map((element, index) => {
  //         if (router.pathname === element.key) {
  //           setDefaultKey(element.key)
  //         }
  //       })
  //     }
  //   }
  // }, [myInfo, router.pathname])

  const CardInfo = () => {
    return (
      <WrapCardInfo>
        <Avatar style={{ backgroundColor: '#f0b90b', verticalAlign: 'middle', marginBottom: '16px' }} size="large">
          {stringAvatar(myInfo?.name)}
        </Avatar>
        {myInfo && (
          <WrapDetailInfo>
            <p style={{ padding: 0, margin: 0 }}>{myInfo?.name.toUpperCase()}</p>
            <p style={{ padding: 0, margin: 0 }}>{myInfo?.phone}</p>
            <p style={{ padding: 0, margin: 0 }}>{myInfo?.uuid}</p>
          </WrapDetailInfo>
        )}
        <Divider type="horizontal" style={{ backgroundColor: '#FFFFFF66' }} />
      </WrapCardInfo>
    )
  }

  const MenuPath = () => {
    return (
      <>
        <WrapMenuCardInfo>
          <CardInfo />
        </WrapMenuCardInfo>
        <StyledTitleMenu>PROCESS MENAGEMENT</StyledTitleMenu>
        <StyledMenu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[defaultKey]}
          onSelect={(values) => {
            router.push(values.key)
          }}
          style={{ height: '100%', borderRight: 0 }}
          items={itemsMenu}
        />
      </>
    )
  }

  return (
    <StyledLayOut>
      <WrapHeader>
        <HeaderLogo>
          <DeploymentUnitOutlined style={{ fontWeight: '700', fontSize: '18px', color: '#f0b90b', marginRight: '8px' }} />
          <div className="logo">{process.env.NEXT_PUBLIC_NAME_PLATFORM}</div>
        </HeaderLogo>
        <span>SIGNOUT</span>
        <StyledMenuIcon onClick={showDrawer} className="menu-icon" style={{ fontSize: '16px', color: '#FFFFFF', cursor: 'pointer' }} />
      </WrapHeader>
      <WrapperDrawer
        title={
          <HeaderLogo>
            <DeploymentUnitOutlined style={{ fontWeight: '700', fontSize: '18px', color: '#f0b90b', marginRight: '8px' }} />
            <div className="logo">{process.env.NEXT_PUBLIC_NAME_PLATFORM}</div>
          </HeaderLogo>
        }
        placement={placement}
        onClose={onClose}
        visible={visible}
        key={placement}>
        <MenuPath />
      </WrapperDrawer>

      <Layout>
        <WrapSider style={{ background: 'rgb(35, 37, 43)', padding: '10px 10px' }} width={260}>
          <MenuPath />
        </WrapSider>{' '}
        <StyledContent
          style={{
            padding: 24,
            margin: 0
          }}>
          {children}
        </StyledContent>
      </Layout>
      <StyledFooter>Rungroj Fish Sauce Co., Ltd. ©2023 Created by Blue Square</StyledFooter>
    </StyledLayOut>
  )
}

export default AppLayout

const StyledMenuIcon = styled(MenuOutlined)`
  cursor: pointer;
  @media only screen and (min-width: 769px) {
    display: none;
  }
`
const WrapperDrawer = styled(Drawer)`
  .ant-drawer-header {
    background: rgb(35, 37, 43);
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
    background: rgb(26, 28, 33);
    padding: 10px 20px;
  }
`

const HeaderLogo = styled.span`
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
`
const StyledTitleMenu = styled.p`
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 0;
  color: #ffffff;
`
const StyledMenu = styled(Menu)`
  background: transparent;
  color: black;
  &&.ant-menu-dark.ant-menu-inline .ant-menu-item {
    border-radius: 2px !important;
  }
`
const StyledLayOut = styled(Layout)`
  min-height: 100vh;
  overflow: hidden;
`
const StyledContent = styled(Content)`
  width: 100%;
  height: 100%;
  background: #ffffff;
  min-height: 100vh;
  color: black;
`
const WrapHeader = styled(Header)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(35, 37, 43);
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
  padding: 0 30px;
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
  color: #ffffff;
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
  height: 100%;
  min-height: 100vh;

  @media only screen and (max-width: 769px) {
    display: none;
  }
`
