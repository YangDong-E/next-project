'use client'

import useCartService from '@/lib/hooks/useCartStore'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Menu = () => {
    const { items, init } = useCartService()
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    const signoutHandler = () => {
        signOut({ callbackUrl: '/signin' })
        init()
    }

    const { data: session } = useSession()

    return (
        <div>
            <ul className="flex items-stretch">
                <li>
                    <Link className="btn btn-ghost rounded-btn" href="/cart">
                        장바구니
                        {mounted && items.length != 0 && (
                            <div className="badge badge-secondary">
                                {items.reduce((a, c) => a + c.qty, 0)}{' '}
                            </div>
                        )}
                    </Link>
                </li>
                {session && session.user ? (
                    <>
                        <li>
                            <div className="dropdown dropdown-bottom dropdown-end">
                                <label
                                    tabIndex={0}
                                    className="btn btn-ghost rounded-btn"
                                >
                                    {session.user.name}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                        />
                                    </svg>
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="menu dropdown-content z-[1] p-2 shadow bg-base-300 rounded-box w-52 "
                                >
                                    <li>
                                        <Link href="/order-history">
                                            주문내역
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={signoutHandler}
                                        >
                                            로그아웃
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </>
                ) : (
                    <li>
                        <button
                            className="btn btn-ghost rounded-btn"
                            type="button"
                            onClick={() => signIn()}
                        >
                            로그인
                        </button>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default Menu
