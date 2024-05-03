import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
    title: '주문하기',
}

export default async function PlaceOrderPage() {
    return <Form />
}
