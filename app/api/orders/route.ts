import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import OrderModel, { OrderItem } from '@/lib/models/OrderModel'
import { round2 } from '@/lib/utils'
import { auth } from '@/lib/auth'

const calcPrices = (orderItems: OrderItem[]) => {
    // Calculate the items price
    const itemsPrice = round2(
        orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
    // Calculate the shipping price
    const shippingPrice = round2(itemsPrice > 100 ? 0 : 10)
    // Calculate the tax price
    const taxPrice = round2(Number((0.15 * itemsPrice).toFixed(2)))
    // Calculate the total price
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
    return { itemsPrice, shippingPrice, taxPrice, totalPrice }
}

export const POST = auth(async (req: any) => {
    if (!req.auth) {
        return Response.json(
            { message: 'unauthorized' },
            {
                status: 401,
            }
        )
    }

    const { user } = req.auth
    try {
        const payload = await req.json()
        await dbConnect()

        // CountInStock 찾기? <- POST로 보낼때 ProductModel의 CountInStock 와 OrderModel의 qty를 빼서 ProductModel의 CountInStock를 업데이트
        // 이 부분에서 ProductModel.CountInStock 와 OrderModel.qty 불러와야함
        // 현재 ProductMdel.CountInStock는 불러왔지만 OrderModel.qty는 불러오지 못함

        const dbProductCount = await ProductModel.find(
            {
                _id: { $in: payload.items.map((x: { _id: string }) => x._id) },
            },
            'countInStock'
        )

        const dbProductQty = await OrderModel.find(
            {
                _id: { $in: payload.items.map((x: { _id: string }) => x._id) },
            },
            'qty'
        )

        const dbProductPrices = await ProductModel.find(
            {
                _id: { $in: payload.items.map((x: { _id: string }) => x._id) },
            },
            'price'
        )
        const dbOrderItems = payload.items.map((x: { _id: string }) => ({
            ...x,
            product: x._id,
            price: dbProductPrices.find((x) => x._id === x._id).price,
            countInStock: dbProductCount.find((x) => x._id === x._id)
                .countInStock,
            _id: undefined,
        }))
        const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
            calcPrices(dbOrderItems)
        const newOrder = new OrderModel({
            items: dbOrderItems,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            shippingAddress: payload.shippingAddress,
            paymentMethod: payload.paymentMethod,
            user: user._id,
        })

        const createdOrder = await newOrder.save()
        return Response.json(
            { message: 'Order has been created', order: createdOrder },
            {
                status: 201,
            }
        )
    } catch (err: any) {
        return Response.json(
            { message: err.message },
            {
                status: 500,
            }
        )
    }
})
