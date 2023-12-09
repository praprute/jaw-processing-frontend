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
    IMPORTWATERFISH = 11,
    MIXED = 12,
}

export enum TypeProcess {
    // หมักปลาลงบ่อ 12 month สีเขียว
    FERMENT = 0,
    // ถ่ายออกไปบ่ออื่น 7 day สีส้ม
    TRANSFER = 1,
    // รับเข้า 3 month สีม่วงอ่อน
    IMPORT = 2,
    // ถ่ายกากรวม
    CLEARING = 3,
    // รับกากเข้า
    GETFISHRESIDUE = 4,
    // ถ่ายกากทิ้ง
    CLEARINGALL = 5,
    // เติมน้ำเหลือ 3 month สีม่วงอ่อน
    ADDONWATERSALT = 6,
    // เติมน้ำปลา 3 month สีม่วงอ่อน
    ADDONFISHSAUCE = 7,
    // ปล่อยน้ำเกลือ  7 day 3 สีส้ม
    TRANSFERSALTWATER = 8,
    // เติมน้ำเกลือ 3 month สีม่วงอ่อน
    IMPORTSALTWATER = 9,
    // เติมน้ำตีกาก 3 month สีม่วงอ่อน
    IMPORTHITWATER = 10,
    // เติมน้ำคาว 6 month สีม่วงอ่อน
    IMPORTWATERFISH = 11,
    // เติมน้ำคาว 6 month สีม่วงอ่อน
    MIXING = 12,

    EMPTY = 13,
}
