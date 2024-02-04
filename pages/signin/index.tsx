import React, { ReactElement } from 'react'
import { Button, Form, Input } from 'antd'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import NextImage from 'next/image'

import { IResAuth } from '../../share-module/auth/type'
import { loginTask, userInfoTask } from '../../share-module/auth/task'
import { NoticeError, NoticeSuccess } from '../../utils/noticeStatus'

// const { Header, Content, Footer } = Layout

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
                NoticeSuccess(`signin success please wait...`)

                router.push('/')
            } else if (result.success === 'error') {
                NoticeError(`${result.message}`)
            }
        } catch (e: any) {
            console.log(e)
            NoticeError(`${e[0]?.message}`)
        } finally {
            form.resetFields()
        }
    }

    return (
        <>
            <Root>
                <SigninSection>
                    <BitkubLogoWrapper>
                        <NextImage
                            alt='RUNGROJ'
                            height={60}
                            src='https://jaw.sgp1.digitaloceanspaces.com/Logo-RFS.jpg'
                            width={100}
                        />
                    </BitkubLogoWrapper>
                    <LoginArticle>
                        <HeadingContainer>
                            <GreenBoxWrapper>
                                <ObjectFitCoverImg alt='Bitkub NFT Logo' src='/images/green-rectangle.svg' />
                            </GreenBoxWrapper>
                            <Heading>
                                <PageHeading>
                                    RUNGROJ <NEXTHighlight>ERP</NEXTHighlight>
                                </PageHeading>
                                <AdminToolsHeading>Product Processing Tools</AdminToolsHeading>
                            </Heading>
                        </HeadingContainer>
                        <ToolDescription>
                            RUNGROJ ERP admin tools software is used to manage the fish sauce product process.
                        </ToolDescription>
                        {/* <LoginButton icon={<GoogleLogo />} onClick={loginRedirect}>
                            Continue with Google
                        </LoginButton> */}
                        <Form autoComplete='off' form={form} layout={'vertical'} name='basic' onFinish={handleSubmit}>
                            <StyledFormItem
                                label='Phone | Email'
                                name='userName'
                                rules={[{ required: true, message: 'Please input your phone number or email!' }]}
                            >
                                <StyledInput placeholder='Your phone number or email' size='large' />
                            </StyledFormItem>
                            <StyledFormItem
                                label='Password'
                                name='password'
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <StyledInputPassword placeholder='Your Password' size='large' />
                            </StyledFormItem>
                            <br />
                            <StyledFormItem>
                                <StyledButtonGradient block className='signInButton' htmlType='submit' size='large'>
                                    SIGNIN
                                </StyledButtonGradient>
                                {/* <Button className='register_button' size='large' type='text'>
                                    <p>register</p>
                                </Button> */}
                            </StyledFormItem>
                        </Form>
                    </LoginArticle>
                </SigninSection>
                <BannerSection>
                    <BannerWrapper>
                        <ObjectFitCoverImg alt='Bitkub NFT' src='/images/bitkub/bitkub-nft-cover.jpg' />
                    </BannerWrapper>
                </BannerSection>
            </Root>
        </>
    )
}

SiginPage.getLayout = function getLayout(page: ReactElement) {
    return <>{page}</>
}

export default SiginPage

const Root = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: row;
    /* flex-direction: column; */
    /* ${(themeProps) => themeProps.theme.breakpoints.lg.up} {
        flex-direction: row;
    } */
`
const BannerSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    /* order: 1; */
    /* color: #fff; */
    /* ${(themeProps) => themeProps.theme.breakpoints.lg.up} {
        order: 2;
        border-top-left-radius: 60px;
        flex-basis: 50%;
        max-width: 50%;
    } */
    order: 2;
    border-top-left-radius: 60px;
    flex-basis: 50%;
    max-width: 50%;
`

const BannerWrapper = styled.div`
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50px 0px 0px 50px;
    /* ${(themeProps) => themeProps.theme.breakpoints.lg.up} {
        border-radius: 50px 0px 0px 50px;
    } */
`

const SigninSection = styled.div`
    position: relative;
    background: #fff;
    display: flex;
    flex-direction: column;
    /* order: 2;
    flex: 1; */
    flex: 1;
    padding: 16px;
    /* ${(themeProps) => themeProps.theme.breakpoints.lg.up} {
        order: 1;
        flex-basis: 50%;
        max-width: 50%;
    } */

    order: 1;
    flex-basis: 50%;
    max-width: 50%;
`

const BitkubLogoWrapper = styled.div`
    width: 100%;
`

const LoginArticle = styled.div`
    margin: auto;
    max-width: 456px;
`

const HeadingContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
`
const GreenBoxWrapper = styled.div`
    padding-top: 5px;
    overflow: hidden;
`

const ObjectFitCoverImg = styled.img`
    height: 100%;
    width: 100%;
    object-fit: cover;
`

const Heading = styled.div`
    padding-left: 10px;
`

const PageHeading = styled.div`
    font-weight: 550;
    font-size: 64px;
    line-height: 0.75;
    margin-bottom: 8px;
    line-height: 55px;
`

const NEXTHighlight = styled.span`
    background: linear-gradient(107.85deg, #51459e 0%, #00b2ff 139.5%);
    /* background: linear-gradient(107.85deg, #47d344 0%, #00b2ff 139.5%); */

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`

const StyledButtonGradient = styled(Button)`
    background: linear-gradient(107.85deg, #51459e 0%, #00b2ff 139.5%);
    color: #fff;
    border: none;
    transition: background-color 0.3s;
    &&:hover {
        background: linear-gradient(107.85deg, #43378f 0%, #00b2ff 139.5%);
        color: #fff !important;
        border: none;
    }
`

const AdminToolsHeading = styled.div`
    font-weight: 500;
    font-size: 24px;
    line-height: 0.75;
`

const ToolDescription = styled.div`
    color: #919191;
    margin-top: 32px;
    margin-bottom: 32px;
`

// const LoginButton = styled(Button)`
//     width: 100%;
//     height: auto;
//     padding: 20px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     gap: 16px;
//     border: solid 2px transparent;
//     background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
//         linear-gradient(107.85deg, #47d344 0%, #00b2ff 139.5%);
//     background-origin: border-box;
//     background-clip: content-box, border-box;
//     box-shadow: 2px 1000px 1px #fff inset;
//     border-radius: 10px;
// `

const StyledFormItem = styled(Form.Item)`
    /* .ant-form-item-required {
        color: white !important;
    }
    .register_button {
        margin-left: 8px;
        color: #3498db;
    }
    .register_button p {
        margin-bottom: 0px;
        text-decoration: underline;
    } */
`
const StyledInput = styled(Input)`
    width: 100%;

    /* background: rgba(255, 255, 255, 0.05); */
    /* color: white !important; */
`

const StyledInputPassword = styled(Input.Password)`
    width: 100%;

    /* background: rgba(255, 255, 255, 0.05); */
    &&.ant-input-affix-wrapper > .ant-input:not(textarea) {
        background: transparent;
        /* color: white !important; */
    }
`
// const StyleTitle = styled.div`
//     display: flex;
//     justify-content: flex-start;
//     align-items: center;
// `
// const StyledBoxSignin = styled.div`
//     /* From https://css.glass */
//     background: rgb(26, 28, 33); // rgba(255, 255, 255, 0.05);
//     border-radius: 2px;
//     box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
//     // backdrop-filter: blur(5.3px);
//     -webkit-backdrop-filter: blur(5.3px);
//     width: 60%;
//     padding: 20px;
//     max-width: 990px;
//     border-radius: 12px;
//     @media (max-width: 414px) {
//         width: 90%;
//     }
// `
// const StyledLayOut = styled(Layout)`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     min-height: 100vh;
// `
// const StyledContent = styled(Content)`
//     width: 100%;
//     height: 100%;
//     background: #f7f8f9; //rgb(26, 28, 33);
//     display: flex;
//     justify-content: center;
//     align-items: center;
// `
// const WrapHeader = styled(Header)`
//     width: 100%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background-color: rgb(35, 37, 43);
//     color: #ffffff;
//     font-size: 18px;
//     font-weight: 500;
// `
// const StyledFooter = styled(Footer)`
//     width: 100%;
//     text-align: center;
//     background: rgb(35, 37, 43);
//     color: #ffffff;
//     font-size: 12px;
// `
