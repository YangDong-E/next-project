'use client'
import { OrderItem } from '@/lib/models/OrderModel'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'

export default function OrderDetails({
    orderId,
    paypalClientId,
}: {
    orderId: string
    paypalClientId: string
}) {
    const { data: session } = useSession()
    const { data, error } = useSWR(`/api/orders/${orderId}`)

    if (error) return error.message
    if (!data) return 'Loading...'

    const {
        paymentMethod,
        shippingAddress,
        items,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isDelivered,
        deliveredAt,
        isPaid,
        paidAt,
    } = data

    return (
        <div>
            <h1 className="text-2xl py-4">주문번호 {orderId}</h1>
            <div className="grid md:grid-cols-4 md:gap-5 my-4">
                <div className="md:col-span-3">
                    <div className="card bg-base-300">
                        <div className="card-body">
                            <h2 className="card-title">배송정보</h2>
                            <p>{shippingAddress.fullName}</p>
                            <p>
                                {shippingAddress.address},{' '}
                                {shippingAddress.city},{' '}
                                {shippingAddress.postalCode},{' '}
                                {shippingAddress.country}{' '}
                            </p>
                            {isDelivered ? (
                                <div className="text-success">
                                    배달완료 시간 {deliveredAt}
                                </div>
                            ) : (
                                <div className="text-error">미 배송</div>
                            )}
                        </div>
                    </div>
                    <div className="card bg-base-300 mt-4">
                        <div className="card-body">
                            <h2 className="card-title">결제수단</h2>
                            <p>{paymentMethod}</p>
                            {isPaid ? (
                                <div className="text-success">
                                    결제완료 {paidAt}
                                </div>
                            ) : (
                                <div className="text-error">미 결제</div>
                            )}
                        </div>
                    </div>
                    <div className="card bg-base-300 mt-4">
                        <div className="card-body">
                            <h2 className="card-title">상품목록</h2>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>상품</th>
                                        <th>개수</th>
                                        <th>가격</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item: OrderItem) => (
                                        <tr key={item.slug}>
                                            <td>
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                    className="flex items-center"
                                                >
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={50}
                                                        height={50}
                                                    ></Image>
                                                    <span className="px-2">
                                                        {item.name} (
                                                        {item.color} {item.size}
                                                        )
                                                    </span>
                                                </Link>
                                            </td>
                                            <td>{item.qty}개</td>
                                            <td>{item.price}원</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="card bg-base-300">
                        <div className="card-body">
                            <h2 className="card-title">주문요약</h2>
                            <ul>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>상품가격</div>
                                        <div>{itemsPrice}원</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>세금</div>
                                        <div>{taxPrice}원</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>배송비</div>
                                        <div>{shippingPrice}원</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>총 금액</div>
                                        <div>{totalPrice}원</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
