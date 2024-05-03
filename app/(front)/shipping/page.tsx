import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
    title: '배송지 입력',
}

export default async function ShippingPage() {
    return <Form />
}
