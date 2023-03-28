export enum TypeOrderPuddle {
    FREE = 0,
    FERMENT = 1,
    CIRCULAR = 2,
    MIXING = 3,
    CLARIFIER = 4,
    FILTER = 5,
    BREAK = 6,
    STOCK = 7,
}

export enum TypeProcess {
    // หมักปลาลงบ่อ
    FERMENT = 0,
    // ถ่ายออกไปบ่ออื่น
    TRANSFER = 1,
    // รับเข้า
    IMPORT = 2,
    // ถ่ายกากรวม
    CLEARING = 3,
    // รับกากเข้า
    GET_FISH_RESIDUE = 4,
    // ถ่ายกากทิ้ง
    CLEARING_ALL = 5,
}
