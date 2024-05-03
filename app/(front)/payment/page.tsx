import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
    title: '결제수단',
}

export default async function PaymentPage() {
    return <Form />
}
