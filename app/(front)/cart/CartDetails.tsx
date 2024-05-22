'use client'

import useCartService from '@/lib/hooks/useCartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CartDetails() {
    const router = useRouter()
    const { items, itemsPrice, decrease, increase } = useCartService()

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <></>

    return (
        <>
            <h1 className="py-4 text-2xl">장바구니</h1>

            {items.length === 0 ? (
                <div>
                    장바구니가 비었습니다.{' '}
                    <Link href="/">메인화면으로 이동</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <table className="table">
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
                                                    {item.name}
                                                </span>
                                            </Link>
                                        </td>
                                        <td>
                                            <button
                                                className="btn"
                                                type="button"
                                                onClick={() => decrease(item)}
                                            >
                                                -
                                            </button>
                                            <span className="px-2">
                                                {item.qty}
                                            </span>
                                            <button
                                                className="btn"
                                                type="button"
                                                onClick={() => increase(item)}
                                            >
                                                +
                                            </button>
                                        </td>
                                        <td>{item.qty * item.price} 원</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <div className="card bg-base-300">
                            <div className="card-body">
                                <ul>
                                    <li>
                                        <div className="pb-3 text-xl">
                                            총 가격 (
                                            {items.reduce(
                                                (a, c) => a + c.qty,
                                                0
                                            )}{' '}
                                            개) : {itemsPrice} 원
                                        </div>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() =>
                                                // router.push('/shipping')
                                                console.log(items)
                                            }
                                            className="btn btn-primary w-full"
                                        >
                                            결제하기
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
