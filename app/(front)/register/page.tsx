import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
    title: '회원가입',
}

export default async function Register() {
    return <Form />
}
