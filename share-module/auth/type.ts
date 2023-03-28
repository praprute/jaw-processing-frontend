export const MODULE_NAME = '@AuthModules'

interface IAuthDetail {
    idusers: number
    uuid: string
    phone: string
    role: number
    token: string
}

export interface IUserInfo {
    idusers: number
    uuid: string
    role: number
    phone: string
    name: string
    password: string
    date_create: string
    accessToken: string
}

export interface IResAuth {
    success: string
    message: IAuthDetail
}

export interface IResUserInfo {
    success: string
    message: IUserInfo
}
