import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
    title: '로그인',
}

export default async function Signin() {
    return <Form />
}
