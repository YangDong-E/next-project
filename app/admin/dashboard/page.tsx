import AdminLayout from '@/components/admin/AdminLayout'
import Dashboard from './Dashboard'

export const metadata = {
    title: '관리자 대시보드',
}
const DashbaordPage = () => {
    return (
        <AdminLayout activeItem="dashboard">
            <Dashboard />
        </AdminLayout>
    )
}

export default DashbaordPage
