import { OrderItem } from './models/OrderModel'
import { Product } from './models/ProductModel'

// 소숫점 두자리 까지 표시
export const round2 = (num: number) =>
    Math.round((num + Number.EPSILON) * 100) / 100
