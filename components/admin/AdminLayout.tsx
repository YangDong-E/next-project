import { auth } from '@/lib/auth'
import Link from 'next/link'

const AdminLayout = async ({
    activeItem = 'dashboard',
    children,
}: {
    activeItem: string
    children: React.ReactNode
}) => {
    const session = await auth()
    if (!session || !session.user.isAdmin) {
        return (
            <div className="relative flex flex-grow p-4">
                <div>
                    <h1 className="text-2xl">권한이 없습니다.</h1>
                    <p>관리자 권한이 필요합니다.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative flex flex-grow">
            <div className="w-full grid md:grid-cols-5">
                <div className="bg-base-200">
                    <ul className="menu">
                        <li>
                            <Link
                                className={
                                    'dashboard' === activeItem ? 'active' : ''
                                }
                                href="/admin/dashboard"
                            >
                                대시보드
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={
                                    'orders' === activeItem ? 'active' : ''
                                }
                                href="/admin/orders"
                            >
                                주문관리
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={
                                    'products' === activeItem ? 'active' : ''
                                }
                                href="/admin/products"
                            >
                                상품관리
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={
                                    'users' === activeItem ? 'active' : ''
                                }
                                href="/admin/users"
                            >
                                고객관리
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="md:col-span-4 px-4">{children} </div>
            </div>
        </div>
    )
}

export default AdminLayout
