'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useCartService from '@/lib/hooks/useCartStore'
import { CheckoutSteps } from '@/components/CheckoutSteps'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import useSWRMutation from 'swr/mutation'

const Form = () => {
    const router = useRouter()
    const {
        paymentMethod,
        shippingAddress,
        items,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        clear,
    } = useCartService()

    const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
        `/api/orders/mine`,
        async (url) => {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethod,
                    shippingAddress,
                    items,
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    totalPrice,
                }),
            })
            const data = await res.json()

            if (res.ok) {
                clear()
                toast.success('주문이 완료되었습니다.')
                return router.push(`/order/${data.order._id}`)
            } else {
                toast.error(data.message)
            }
        }
    )

    useEffect(() => {
        if (!paymentMethod) {
            return router.push('/payment')
        }
        if (items.length === 0) {
            return router.push('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentMethod, router])

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <></>

    return (
        <div>
            <CheckoutSteps current={4} />

            <div className="grid md:grid-cols-4 md:gap-5 my-4">
                <div className="overflow-x-auto md:col-span-3">
                    <div className="card bg-base-300">
                        <div className="card-body">
                            <h2 className="card-title">배송지</h2>
                            <p>{shippingAddress.fullName}</p>
                            <p>
                                {shippingAddress.address},{' '}
                                {shippingAddress.city},{' '}
                                {shippingAddress.postalCode},{' '}
                                {shippingAddress.country}{' '}
                            </p>
                            <div>
                                <Link className="btn" href="/shipping">
                                    수정
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-base-300 mt-4">
                        <div className="card-body">
                            <h2 className="card-title">결제수단</h2>
                            <p>{paymentMethod}</p>
                            <div>
                                <Link className="btn" href="/payment">
                                    수정
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-base-300 mt-4">
                        <div className="card-body">
                            <h2 className="card-title">상품목록</h2>
                            <table className="table ">
                                <thead>
                                    <tr>
                                        <th>상품</th>
                                        <th>개수</th>
                                        <th>가격</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
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
                                                        {item.name}({item.color}{' '}
                                                        {item.size})
                                                    </span>
                                                </Link>
                                            </td>
                                            <td>
                                                <span>{item.qty}</span>
                                            </td>
                                            <td>{item.price}원</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div>
                                <Link className="btn" href="/cart">
                                    수정
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="card bg-base-300">
                        <div className="card-body">
                            <h2 className="card-title">주문 정보</h2>
                            <ul className="space-y-3">
                                <li>
                                    <div className=" flex justify-between">
                                        <div>상품가격</div>
                                        <div>{itemsPrice}원</div>
                                    </div>
                                </li>
                                <li>
                                    <div className=" flex justify-between">
                                        <div>세금</div>
                                        <div>{taxPrice}원</div>
                                    </div>
                                </li>
                                <li>
                                    <div className=" flex justify-between">
                                        <div>배송비</div>
                                        <div>{shippingPrice}원</div>
                                    </div>
                                </li>
                                <li>
                                    <div className=" flex justify-between">
                                        <div>총 가격</div>
                                        <div>{totalPrice}원</div>
                                    </div>
                                </li>

                                <li>
                                    <button
                                        onClick={() => placeOrder()}
                                        disabled={isPlacing}
                                        className="btn btn-primary w-full"
                                    >
                                        {isPlacing && (
                                            <span className="loading loading-spinner"></span>
                                        )}
                                        주문하기
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Form
