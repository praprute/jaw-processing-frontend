import Head from 'next/head'
import { Layout, Button, Divider, Form, Input } from 'antd'
import styled from 'styled-components'
import { DeploymentUnitOutlined } from '@ant-design/icons'
import { loginTask } from '../../share-module/auth'
import { ToastContainer, toast } from 'react-toastify'
import { IResAuth } from '../../share-module/auth/type'
import { useRouter } from 'next/router'

const { Header, Content, Footer } = Layout

const SiginPage = () => {
  const [form] = Form.useForm()
  const router = useRouter()
  const handleSubmit = async () => {
    try {
      const payload = {
        phone: form.getFieldValue(['phone']),
        password: form.getFieldValue(['password'])
      }
      const result: IResAuth = await loginTask(payload)
      console.log('result : ', result)
      if (result.success === 'success') {
        toast.success(`signin success please wait...`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark'
        })
        router.push('/')
      } else if (result.success === 'error') {
        toast.error(`${result.message}`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark'
        })
      }
    } catch (e: any) {
      console.log(e)
    }
  }

  return (
    <>
      <Head>
        <title>Signin | Jaw Management</title>
        <meta name="description" content="Jaw Management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer />
      <StyledLayOut>
        <WrapHeader>
          <DeploymentUnitOutlined style={{ fontWeight: '700', fontSize: '18px', color: '#f0b90b', marginRight: '8px' }} />
          <div className="logo">{process.env.NEXT_PUBLIC_NAME_PLATFORM}</div>
        </WrapHeader>
        <StyledContent>
          <StyledBoxSignin>
            <StyleTitle>
              <span style={{ fontSize: '18px', color: 'rgba(255,255,255,1)' }}>SIGNIN</span>
              <Divider type="vertical" style={{ backgroundColor: 'white' }} />
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}>for employee only</span>
            </StyleTitle>
            <br />
            <Form form={form} onFinish={handleSubmit} layout={'vertical'} name="basic" autoComplete="off">
              <StyledFormItem label="PHONE" name="phone" rules={[{ required: true, message: 'Please input your phone number!' }]}>
                <StyledInput placeholder="Your Phone number" />
              </StyledFormItem>
              <StyledFormItem label="PASSWORD" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                <StyledInputPassword placeholder="Your Password" />
              </StyledFormItem>
              <br />
              <StyledFormItem>
                <Button type="primary" size="large" htmlType="submit">
                  SIGNIN
                </Button>
              </StyledFormItem>
            </Form>
          </StyledBoxSignin>
        </StyledContent>
        <StyledFooter>Rungroj Fish Sauce Co., Ltd. ©2023 Created by Blue Square</StyledFooter>
      </StyledLayOut>
    </>
  )
}

export default SiginPage
const StyledFormItem = styled(Form.Item)`
  .ant-form-item-required {
    color: white !important;
  }
`
const StyledInput = styled(Input)`
  width: 100%;
  // border-color: #f0b90b;
  background: rgba(255, 255, 255, 0.05);
  color: white !important;
`

const StyledInputPassword = styled(Input.Password)`
  width: 100%;
  // border-color: #f0b90b;
  background: rgba(255, 255, 255, 0.05);
  &&.ant-input-affix-wrapper > .ant-input:not(textarea) {
    background: transparent;
    color: white !important;
  }
`
const StyleTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
const StyledBoxSignin = styled.div`
  /* From https://css.glass */
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.3px);
  -webkit-backdrop-filter: blur(5.3px);
  width: 60%;
  padding: 20px;

  @media (max-width: 414px) {
    width: 90%;
  }
`
const StyledLayOut = styled(Layout)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`
const StyledContent = styled(Content)`
  width: 100%;
  height: 100%;
  background: rgb(26, 28, 33);
  display: flex;
  justify-content: center;
  align-items: center;
`
const WrapHeader = styled(Header)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(35, 37, 43);
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
`
const StyledFooter = styled(Footer)`
  width: 100%;
  text-align: center;
  background: rgb(35, 37, 43);
  color: #ffffff;
  font-size: 12px;
`
