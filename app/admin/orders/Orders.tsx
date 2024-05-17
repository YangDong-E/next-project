'use client'
import { Order } from '@/lib/models/OrderModel'
import Link from 'next/link'
import useSWR from 'swr'

export default function Orders() {
    const { data: orders, error } = useSWR(`/api/admin/orders`)
    if (error) return 'An error has occurred.'
    if (!orders) return 'Loading...'

    return (
        <div>
            <h1 className="py-4 text-2xl">주문관리</h1>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>주문ID</th>
                            <th>주문자</th>
                            <th>날짜</th>
                            <th>가격</th>
                            <th>결제상태</th>
                            <th>배송상태</th>
                            <th>상세내용</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: Order) => (
                            <tr key={order._id}>
                                <td>..{order._id.substring(20, 24)}</td>
                                <td>{order.user?.name || '삭제된 유저'}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.totalPrice}원</td>
                                <td>
                                    {order.isPaid && order.paidAt
                                        ? `${order.paidAt.substring(0, 10)}`
                                        : '미 결제상태'}
                                </td>
                                <td>
                                    {order.isDelivered && order.deliveredAt
                                        ? `${order.deliveredAt.substring(
                                              0,
                                              10
                                          )}`
                                        : '미 배송상태'}
                                </td>
                                <td>
                                    <Link href={`/order/${order._id}`} passHref>
                                        자세히
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
