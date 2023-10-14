import React, { ReactElement } from 'react'
import Head from 'next/head'
import { Layout, Button, Divider, Form, Input } from 'antd'
import styled from 'styled-components'
import { DeploymentUnitOutlined } from '@ant-design/icons'
import { ToastContainer, toast } from 'react-toastify'
import { useRouter } from 'next/router'

import { IResAuth } from '../../share-module/auth/type'
import { loginTask, userInfoTask } from '../../share-module/auth/task'

const { Header, Content, Footer } = Layout

const SiginPage = () => {
    const [form] = Form.useForm()
    const router = useRouter()
    const { onRequest: loginRequest } = loginTask.useTask()
    const { onRequest: userInfoRequest } = userInfoTask.useTask()

    const handleSubmit = async () => {
        try {
            const payload = {
                userName: form.getFieldValue(['userName']),
                password: form.getFieldValue(['password']),
            }
            const result: IResAuth = await loginRequest(payload)
            await userInfoRequest()
            if (result.success === 'success') {
                toast.success(`signin success please wait...`, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
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
                    theme: 'dark',
                })
            }
        } catch (e: any) {
            console.log(e)
            toast.error(`${e[0]?.message}`, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            })
        } finally {
            form.resetFields()
        }
    }

    return (
        <>
            <Head>
                <title>Signin | Jaw Management</title>
                <meta content='Jaw Management' name='description' />
                <meta content='width=device-width, initial-scale=1' name='viewport' />
                <link href='/favicon.ico' rel='icon' />
            </Head>
            <ToastContainer />
            <StyledLayOut>
                <WrapHeader>
                    <DeploymentUnitOutlined
                        style={{ fontWeight: '700', fontSize: '18px', color: '#f0b90b', marginRight: '8px' }}
                    />
                    <div className='logo'>{process.env.NEXT_PUBLIC_NAME_PLATFORM}</div>
                </WrapHeader>
                <StyledContent>
                    <StyledBoxSignin>
                        <StyleTitle>
                            <span style={{ fontSize: '18px', color: 'rgba(255,255,255,1)' }}>SIGNIN</span>
                            <Divider style={{ backgroundColor: 'white' }} type='vertical' />
                            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}>for employee only</span>
                        </StyleTitle>
                        <br />
                        <Form autoComplete='off' form={form} layout={'vertical'} name='basic' onFinish={handleSubmit}>
                            <StyledFormItem
                                label='Phone | Email'
                                name='userName'
                                rules={[{ required: true, message: 'Please input your phone number or email!' }]}
                            >
                                <StyledInput placeholder='Your phone number or email' />
                            </StyledFormItem>
                            <StyledFormItem
                                label='Password'
                                name='password'
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <StyledInputPassword placeholder='Your Password' />
                            </StyledFormItem>
                            <br />
                            <StyledFormItem>
                                <Button htmlType='submit' size='large' type='primary'>
                                    SIGNIN
                                </Button>
                                <Button className='register_button' size='large' type='text'>
                                    <p>register</p>
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

SiginPage.getLayout = function getLayout(page: ReactElement) {
    return <>{page}</>
}

export default SiginPage
const StyledFormItem = styled(Form.Item)`
    .ant-form-item-required {
        color: white !important;
    }
    .register_button {
        margin-left: 8px;
        color: #3498db;
    }
    .register_button p {
        margin-bottom: 0px;
        text-decoration: underline;
    }
`
const StyledInput = styled(Input)`
    width: 100%;

    background: rgba(255, 255, 255, 0.05);
    color: white !important;
`

const StyledInputPassword = styled(Input.Password)`
    width: 100%;

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
    background: rgb(26, 28, 33); // rgba(255, 255, 255, 0.05);
    border-radius: 2px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    // backdrop-filter: blur(5.3px);
    -webkit-backdrop-filter: blur(5.3px);
    width: 60%;
    padding: 20px;
    max-width: 990px;
    border-radius: 12px;
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
    background: #f7f8f9; //rgb(26, 28, 33);
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
