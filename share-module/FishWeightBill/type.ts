export const MODULE_NAME = '@FishWeightBill'

export interface ICustomerList {
    idcustomer_bill: number
    name: string
    type_bill: number
    date_create: string
}
export interface IDtoFishWeight {
    idreceipt: number
    no: string
    weigh_in: number
    weigh_out: number
    weigh_net: number
    price_per_weigh: number
    amount_price: number
    time_in: string
    time_out: string
    vehicle_register: string
    customer_name: string
    product_name: string
    store_name: string
    description: string
    date_create: string
    order_connect: any
    date_action?: string
    stock?: number
}
export interface IListFishWeight {
    data: IDtoFishWeight[]
    total: number
}

export interface IListFishWeightLog {
    idlog_fishweight: number
    amount: number
    receipt_target: number
    order_target: number
    puddle: number
    date_create: string
    idreceipt: number
    no: string
    weigh_net: number
    price_per_weigh: number
    amount_price: number
    customer_name: string
    product_name: string
    store_name: string
    stock: number
}

export interface ILogSaltBillDto {
    idlog_salt_receipt: number
    amount: number
    receipt_target: number
    order_target: number
    puddle: number
    date_create: string
    idsalt_receipt: number
    no: string
    product_name: string
    weigh_net: number
    stock: number
}

export interface ISolidSaltBillDto {
    idsolid_salt_receipt: number
    no: string
    product_name: string
    weigh_net: number
    price_per_weigh: number
    price_net: number
    customer: string
    stock: number
    date_create: string
}
export interface IListSolidSaltBill {
    data: ISolidSaltBillDto[]
    total: number
}
