'use client'

import { Order } from '@/lib/models/OrderModel'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function MyOrders() {
    const router = useRouter()
    const { data: orders, error } = useSWR(`/api/orders/mine`)

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <></>

    if (error) return '오류가 발생했습니다.'
    if (!orders) return 'Loading...'

    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>주문ID</th>
                        <th>날짜</th>
                        <th>총 금액</th>
                        <th>결제상태</th>
                        <th>배송상태</th>
                        <th>상세페이지</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order: Order) => (
                        <tr key={order._id}>
                            <td>{order._id.substring(20, 24)}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>{order.totalPrice}원</td>
                            <td>
                                {order.isPaid && order.paidAt
                                    ? `${order.paidAt.substring(0, 10)}`
                                    : '미결제 상태'}
                            </td>
                            <td>
                                {order.isDelivered && order.deliveredAt
                                    ? `${order.deliveredAt.substring(0, 10)}`
                                    : '미배송 상태'}
                            </td>
                            <td>
                                <Link href={`/order/${order._id}`} passHref>
                                    상세
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
