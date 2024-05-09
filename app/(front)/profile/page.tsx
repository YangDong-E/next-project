import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
    title: '프로필',
}

export default async function Profile() {
    return <Form />
}
