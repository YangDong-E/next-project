import Link from 'next/link'
import React from 'react'
import Menu from './Menu'

const Header = () => {
    return (
        <div>
            <nav>
                <div className="navbar justify-between bg-base-300">
                    <Link href="/" className="btn btn-ghost text-lg">
                        아시아전기조명
                    </Link>
                    <Menu />
                </div>
            </nav>
        </div>
    )
}

export default Header
