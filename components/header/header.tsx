import Link from 'next/link'
import React from 'react'

const Header = () => {
    return (
        <div>
            <nav>
                <div className="navbar justify-between bg-base-300">
                    <Link href="/" className="btn btn-ghost text-lg">
                        아시아전기조명
                    </Link>
                    <ul className="flex">
                        <li>
                            <Link
                                href="/cart"
                                className="btn btn-ghost rounded-btn"
                            >
                                장바구니
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/signin"
                                className="btn btn-ghost rounded-btn"
                            >
                                로그인
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Header
