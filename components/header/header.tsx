import Link from 'next/link'
import React from 'react'
import Menu from './Menu'

const Header = () => {
    return (
        <div>
            <nav>
                <div className="navbar justify-between bg-base-300">
                    <div>
                        <label
                            htmlFor="my-drawer"
                            className="btn btn-square btn-ghost"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block w-5 h-5 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                        <Link href="/" className="btn btn-ghost text-lg">
                            아시아전기조명
                        </Link>
                    </div>
                    <Menu />
                </div>
            </nav>
        </div>
    )
}

export default Header
