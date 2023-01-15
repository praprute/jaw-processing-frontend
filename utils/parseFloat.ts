export const parseFloat2Decimals = (str: string) => {
    const num = parseFloat(str)

    return Math.round(num * 100) / 100
}
