import { create } from 'zustand'
import { round2 } from '../utils'
import { OrderItem, ShippingAddress } from '../models/OrderModel'
import { persist } from 'zustand/middleware'
import { Product } from '../models/ProductModel'

type Cart = {
    items: OrderItem[]
    // 제품 가격
    itemsPrice: number
    // 세금
    taxPrice: number
    // 배송비
    shippingPrice: number
    // 총 가격
    totalPrice: number
    // 결제 수단
    paymentMethod: string
    // 배송지
    shippingAddress: ShippingAddress
}

// 초기값
const initialState: Cart = {
    items: [],
    itemsPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    // 기본 결제 수단
    paymentMethod: 'PayPal',
    shippingAddress: {
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    },
}

// Zustand의 persist 미들웨어를 사용하여 상태를 LocalStorage와 같은 저장소에 저장하여 데이터를 유지할 수 있도록 해준다.
// 전역 상태 관리 라이브러리들은 상태를 메모리에 유지하는데 페이지가 새로고침되면 환경이 초기화디어 데이터가 사라지는 것을 방지
export const cartStore = create<Cart>()(
    persist(() => initialState, {
        name: 'cartStore',
    })
)

export default function useCartService() {
    const {
        items,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentMethod,
        shippingAddress,
    } = cartStore()
    return {
        items,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentMethod,
        shippingAddress,
        increase: (item: OrderItem) => {
            const exist = items.find((x) => x.slug === item.slug)
            const updatedCartItems = exist
                ? items.map((x) =>
                      x.slug === item.slug && x.qty < item.countInStock
                          ? { ...exist, qty: exist.qty + 1 }
                          : x
                  )
                : [
                      ...items,
                      {
                          ...item,
                          qty: 1,
                      },
                  ]
            const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
                calcPrice(updatedCartItems)
            cartStore.setState({
                items: updatedCartItems,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            })
        },
        decrease: (item: OrderItem) => {
            const exist = items.find((x) => x.slug === item.slug)
            if (!exist) return
            const updatedCartItems =
                exist.qty === 1
                    ? items.filter((x: OrderItem) => x.slug !== item.slug)
                    : items.map((x) =>
                          x.slug === item.slug
                              ? { ...exist, qty: exist.qty - 1 }
                              : x
                      )
            const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
                calcPrice(updatedCartItems)
            cartStore.setState({
                items: updatedCartItems,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            })
        },
        saveShippingAddrress: (shippingAddress: ShippingAddress) => {
            cartStore.setState({
                shippingAddress,
            })
        },
        savePaymentMethod: (paymentMethod: string) => {
            cartStore.setState({
                paymentMethod,
            })
        },
        clear: () => {
            cartStore.setState({
                items: [],
            })
        },
        init: () => cartStore.setState(initialState),
    }
}

const calcPrice = (items: OrderItem[]) => {
    const itemsPrice = round2(
            items.reduce((acc, item) => acc + item.price * item.qty, 0)
        ),
        shippingPrice = round2(itemsPrice > 100 ? 0 : 100),
        taxPrice = round2(Number(0.1 * itemsPrice)),
        totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
    return { itemsPrice, shippingPrice, taxPrice, totalPrice }
}
