'use client'
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ValidationRule, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Product } from '@/lib/models/ProductModel'
import { formatId } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function ProductEditForm({ productId }: { productId: string }) {
    const { data, error } = useSWR(`/api/admin/products/${productId}`)
    const router = useRouter()
    const { trigger: updateProduct, isMutating: isUpdating } = useSWRMutation(
        `/api/admin/products/${productId}`,
        async (url, { arg }) => {
            const res = await fetch(`${url}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(arg),
            })
            const data = await res.json()
            if (!res.ok) return toast.error(data.message)

            toast.success('상품 정보가 수정되었습니다.')
            router.push('/admin/products')
        }
    )

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<Product>()

    useEffect(() => {
        if (!data) return
        setValue('name', data.name)
        setValue('slug', data.slug)
        setValue('price', data.price)
        setValue('image', data.image)
        setValue('category', data.category)
        setValue('brand', data.brand)
        setValue('countInStock', data.countInStock)
        setValue('description', data.description)
    }, [data, setValue])

    const formSubmit = async (formData: any) => {
        await updateProduct(formData)
    }

    if (error) return error.message
    if (!data) return 'Loading...'

    const FormInput = ({
        id,
        name,
        required,
        pattern,
    }: {
        id: keyof Product
        name: string
        required?: boolean
        pattern?: ValidationRule<RegExp>
    }) => (
        <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor={id}>
                {name}
            </label>
            <div className="md:w-4/5">
                <input
                    type="text"
                    id={id}
                    {...register(id, {
                        required: required && `${name}은(는) 필수사항입니다.`,
                        pattern,
                    })}
                    className="input input-bordered w-full max-w-md"
                />
                {errors[id]?.message && (
                    <div className="text-error">{errors[id]?.message}</div>
                )}
            </div>
        </div>
    )

    return (
        <div>
            <h1 className="text-2xl py-4">상품 정보 수정 ({data.name})</h1>
            <div>
                <form onSubmit={handleSubmit(formSubmit)}>
                    <FormInput name="이름" id="name" required />
                    <FormInput name="검색단어" id="slug" required />
                    <FormInput name="이미지" id="image" required />
                    <FormInput name="가격" id="price" required />
                    <FormInput name="카테고리" id="category" required />
                    <FormInput name="브랜드" id="brand" required />
                    <FormInput name="상세정보" id="description" required />
                    <FormInput name="수량" id="countInStock" required />

                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="btn btn-primary"
                    >
                        {isUpdating && (
                            <span className="loading loading-spinner"></span>
                        )}
                        저장
                    </button>
                    <Link className="btn ml-4 " href="/admin/products">
                        취소
                    </Link>
                </form>
            </div>
        </div>
    )
}
