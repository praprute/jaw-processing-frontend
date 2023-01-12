export const MODULE_NAME = '@buildingModule'

export interface IAllBuildingDto {
  idbuilding: number
  name: string
  limit_pool: string
  date_create: string
}

export interface IAllBuildingAllBuildingDto {
  idbuilding: number
  name: string
  limit_pool: string
  date_create: string
  allPuddle: number
}

export interface IPuddleBoxDto {
  idpuddle: number
  uuid_puddle: string
  building_id: number
  status: number
  lasted_order?: number
  update_time: string
  date_create: string
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
}

export interface IResAllPuddleDto {
  success: string
  message: IAllPuddleDto[]
}

export interface ICountingPuddle {
  puddle: number
}

export interface IResAllBuilding {
  success: string
  message: IAllBuildingDto[]
}

export interface IResPuddleBoxDto {
  success: string
  message: IPuddleBoxDto[]
}
