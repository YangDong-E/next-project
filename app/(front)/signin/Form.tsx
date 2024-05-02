'use client'
import { signIn, useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

type Inputs = {
    email: string
    password: string
}

const Form = () => {
    const { data: session } = useSession()

    const params = useSearchParams()
    let callbackUrl = params.get('callbackUrl') || '/'
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
            email: '',
            password: '',
        },
    })

    useEffect(() => {
        if (session && session.user) {
            router.push(callbackUrl)
        }
    }, [callbackUrl, params, router, session])

    const formSubmit: SubmitHandler<Inputs> = async (form) => {
        const { email, password } = form
        signIn('credentials', {
            email,
            password,
        })
    }
    return (
        <div className="max-w-sm  mx-auto card bg-base-300 my-4">
            <div className="card-body">
                <h1 className="card-title">로그인</h1>
                {params.get('error') && (
                    <div className="alert text-error">
                        {params.get('error') === 'CredentialsSignin'
                            ? '이메일 또는 비밀번호가 틀렸습니다.'
                            : params.get('error')}
                    </div>
                )}
                {params.get('success') && (
                    <div className="alert text-success">
                        {params.get('success')}
                    </div>
                )}
                <form onSubmit={handleSubmit(formSubmit)}>
                    <div className="my-2">
                        <label className="label" htmlFor="email">
                            이메일
                        </label>
                        <input
                            type="text"
                            id="email"
                            {...register('email', {
                                required: '이메일이 잘못되었습니다',
                                pattern: {
                                    value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                                    message: '이메일이 잘못되었습니다',
                                },
                            })}
                            className="input input-bordered w-full max-w-sm"
                        />
                        {errors.email?.message && (
                            <div className="text-error">
                                {errors.email.message}
                            </div>
                        )}
                    </div>
                    <div className="my-2">
                        <label className="label" htmlFor="password">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register('password', {
                                required: '비밀번호는 필수입니다',
                            })}
                            className="input input-bordered w-full max-w-sm"
                        />
                        {errors.password?.message && (
                            <div className="text-error">
                                {errors.password.message}
                            </div>
                        )}
                    </div>
                    <div className="my-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full"
                        >
                            {isSubmitting && (
                                <span className="loading loading-spinner"></span>
                            )}
                            로그인
                        </button>
                    </div>
                </form>
                <div>
                    계정이 필요한가요?{' '}
                    <Link
                        className="link"
                        href={`/register?callbackUrl=${callbackUrl}`}
                    >
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default Form
