import { message } from 'antd'

export const NoticeSuccess = (msg: string) => {
    message.success(`${msg}`, 5)
}

export const NoticeError = (msg: string) => {
    message.error(`${msg}`, 5)
}
