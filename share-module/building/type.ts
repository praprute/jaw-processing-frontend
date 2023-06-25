export const MODULE_NAME = '@buildingModule'

export interface IAllBuildingAndPuddleDto {
    idbuilding: number
    name: string
    limit_pool: string
    date_create: string
    allPuddle: number
}

export interface IDetailPuddle {
    idpuddle: number
    uuid_puddle: string
    building_id: number
    status: number
    lasted_order?: any
    update_time: string
    description?: any
    date_create: string
    date_action?: string
    serial?: string
    working_status_title?: string
    topSalt?: number
    start_date?: string
}

export interface IAllPuddleDto {
    idpuddle: number
    uuid_puddle: string
    building_id: number
    status: number
    lasted_order?: number
    update_time: string
    date_create: string
    description?: string
    serial?: string
    color?: string
    working_status_title?: string
    topSalt?: number
    start_date?: string
}

export interface IResAllPuddleDto {
    success: string
    message: IAllPuddleDto[]
}
