'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type Inputs = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

const Form = () => {
    const { data: session } = useSession()

    const params = useSearchParams()
    const router = useRouter()
    let callbackUrl = params.get('callbackUrl') || '/'
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })
    useEffect(() => {
        if (session && session.user) {
            router.push(callbackUrl)
        }
    }, [callbackUrl, params, router, session])

    const formSubmit: SubmitHandler<Inputs> = async (form) => {
        const { name, email, password } = form

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            })
            if (res.ok) {
                return router.push(
                    `/signin?callbackUrl=${callbackUrl}&success=Account has been created`
                )
            } else {
                const data = await res.json()
                throw new Error(data.message)
            }
        } catch (err: any) {
            const error =
                err.message && err.message.indexOf('E11000') === 0
                    ? '이메일이 중복됩니다'
                    : err.message
            toast.error(error || 'error')
        }
    }
    return (
        <div className="max-w-sm  mx-auto card bg-base-300 my-4">
            <div className="card-body">
                <h1 className="card-title">회원가입</h1>
                <form onSubmit={handleSubmit(formSubmit)}>
                    <div className="my-2">
                        <label className="label" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            {...register('name', {
                                required: '이름은 필수입니다',
                            })}
                            className="input input-bordered w-full max-w-sm"
                        />
                        {errors.name?.message && (
                            <div className="text-error">
                                {errors.name.message}
                            </div>
                        )}
                    </div>
                    <div className="my-2">
                        <label className="label" htmlFor="email">
                            이메일
                        </label>
                        <input
                            type="text"
                            id="email"
                            {...register('email', {
                                required: '이메일은 필수입니다',
                                pattern: {
                                    value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                                    message: 'Email is invalid',
                                },
                            })}
                            className="input input-bordered w-full max-w-sm"
                        />
                        {errors.email?.message && (
                            <div className="text-error">
                                {' '}
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
                    <div className="my-2">
                        <label className="label" htmlFor="confirmPassword">
                            비밀번호 확인
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register('confirmPassword', {
                                required: '비밀번호 확인은 필수입니다',
                                validate: (value) => {
                                    const { password } = getValues()
                                    return (
                                        password === value ||
                                        '비밀번호와 일치하지 않습니다'
                                    )
                                },
                            })}
                            className="input input-bordered w-full max-w-sm"
                        />
                        {errors.confirmPassword?.message && (
                            <div className="text-error">
                                {errors.confirmPassword.message}
                            </div>
                        )}
                    </div>
                    <div className="my-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full"
                        >
                            {isSubmitting && (
                                <span className="loading loading-spinner"></span>
                            )}
                            회원가입
                        </button>
                    </div>
                </form>

                <div className="divider"> </div>
                <div>
                    계정이 있나요?{' '}
                    <Link
                        className="link"
                        href={`/signin?callbackUrl=${callbackUrl}`}
                    >
                        로그인
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Form
