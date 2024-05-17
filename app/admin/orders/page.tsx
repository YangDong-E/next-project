import AdminLayout from '@/components/admin/AdminLayout'
import Orders from './Orders'

export const metadata = {
    title: '관리자 주문관리',
}
const AdminOrdersPage = () => {
    return (
        <AdminLayout activeItem="orders">
            <Orders />
        </AdminLayout>
    )
}

export default AdminOrdersPage
