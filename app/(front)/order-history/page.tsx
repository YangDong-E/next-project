import { Metadata } from 'next'
import MyOrders from './MyOrders'

export const metadata: Metadata = {
    title: '주문내역',
}
export default function OrderHistory() {
    return (
        <>
            <h2 className="text-2xl py-2">주문내역</h2>
            <MyOrders />
        </>
    )
}
