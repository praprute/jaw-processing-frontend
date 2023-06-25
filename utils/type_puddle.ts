//@typescript-eslint/naming-convention
export enum TypeOrderPuddle {
    FREE = 0,
    FERMENT = 1,
    CIRCULAR = 2,
    MIXING = 3,
    CLARIFIER = 4,
    FILTER = 5,
    BREAK = 6,
    STOCK = 7,
    REPELLENT = 8,
    HITMARK = 9,
    FAIL = 10,
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
    GETFISHRESIDUE = 4,
    // ถ่ายกากทิ้ง
    CLEARINGALL = 5,
    // เติมน้ำเหลือ
    ADDONWATERSALT = 6,
    // เติมน้ำปลา
    ADDONFISHSAUCE = 7,
    // ปล่อยน้ำเกลือ
    TRANSFERSALTWATER = 8,
    // ปล่อยน้ำเกลือ
    IMPORTSALTWATER = 9,
}
