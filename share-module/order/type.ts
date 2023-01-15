export const MODULE_NAME = '@OrderModules'

export interface IOrderDto {
    idorders: number
    uuid_order: string
    status: number
    order_name: string
    amount: number
    unit_per_price: number
    price: number
    puddle_owner: number
    user_create: number
    date_create: string
}
