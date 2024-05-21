import AdminLayout from '@/components/admin/AdminLayout'
import Products from './Products'

export const metadata = {
    title: '관리자 상품관리',
}
const AdminProductsPage = () => {
    return (
        <AdminLayout activeItem="products">
            <Products />
        </AdminLayout>
    )
}

export default AdminProductsPage
