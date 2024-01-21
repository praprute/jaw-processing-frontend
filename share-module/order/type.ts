export const MODULE_NAME = '@OrderModules'

export interface IDeleteGetInPayload {
    id_sub_order: number
    idtarget_puddle: number
}

export interface ISubmitGetIn {
    order_id: number
    type_process: number
    amount_items: number
    amount_price: number
    remaining_items: number
    remaining_price: number
    idtarget_puddle: number
    lasted_subId: number
    volume: number
    remaining_volume: number
    action_puddle: number
    action_serial_puddle: number
    date_action?: string
    id_puddle?: number
    round?: number
}

export interface INoticeTargetPendingDto {
    date_action: string
    idtarget_puddle: number
    id_puddle: number
    id_sub_order: number
    status: number
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
    description?: any
    user_create_sub: number
    approved: number
    volume: number
    remaining_volume: number
    source_puddle?: number
    source_serial_puddle?: number
    item_transfer?: number
    type_process?: number
}

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
    remaining_volume: number
    action_puddle: number
    serial_puddle: number
    process?: number
    date_action?: string
    round?: number
}
export interface IPayloadTransferSaltWater {
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
    remaining_volume: number
    action_puddle: number
    serial_puddle: number
    process?: number
    item_transfer?: number
    round?: number
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
    ph?: number
    nacl?: number
    tn?: number
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
    remaining_volume: number
    action_puddle?: number
    action_serial_puddle?: number
    type_process?: number
    idtype_process?: number
    process_name?: string
    date_action?: string
    round?: number
}
