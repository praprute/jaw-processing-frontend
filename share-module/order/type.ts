export const MODULE_NAME = '@OrderModules'

export interface IPayloadTransferFishSauce {
    order_id: number
    type_process: number
    amount_items: number
    amount_unit_per_price: number
    amount_price: number
    remaining_items: number
    remaining_unit_per_price: number
    remaining_price: number
    approved: number
    volume: number
    id_puddle: number
}

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
export interface IOrderDetailDto {
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
    idsub_orders: number
    idOrders: number
    type: number
    fish: number
    salt: number
    laber: number
    other: number
    fish_sauce: number
    fish_price: number
    salt_price: number
    laber_price: number
    amount_items: number
    amount_unit_per_price: number
    amount_price: number
    remaining_items: number
    remaining_unit_per_price: number
    remaining_price: number
    description: string
    user_create_sub: number
    approved: number
    volume: number
}
