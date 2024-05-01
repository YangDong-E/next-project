// 소숫점 두자리 까지 표시
export const round2 = (num: number) =>
    Math.round((num + Number.EPSILON) * 100) / 100

export function convertDocToObj(doc: any) {
    doc._id = doc._id.toString()
    return doc
}
