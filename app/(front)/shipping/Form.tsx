'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler, ValidationRule } from 'react-hook-form'
import useCartService from '@/lib/hooks/useCartStore'
import { CheckoutSteps } from '@/components/CheckoutSteps'
import { ShippingAddress } from '@/lib/models/OrderModel'

const Form = () => {
    const router = useRouter()
    const { saveShippingAddrress, shippingAddress } = useCartService()
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ShippingAddress>({
        defaultValues: {
            fullName: '',
            address: '',
            city: '',
            postalCode: '',
            country: '',
        },
    })

    useEffect(() => {
        setValue('fullName', shippingAddress.fullName)
        setValue('address', shippingAddress.address)
        setValue('city', shippingAddress.city)
        setValue('postalCode', shippingAddress.postalCode)
        setValue('country', shippingAddress.country)
    }, [setValue, shippingAddress])

    const formSubmit: SubmitHandler<ShippingAddress> = async (form) => {
        saveShippingAddrress(form)
        router.push('/payment')
    }

    const FormInput = ({
        id,
        name,
        required,
        pattern,
    }: {
        id: keyof ShippingAddress
        name: string
        required?: boolean
        pattern?: ValidationRule<RegExp>
    }) => (
        <div className="mb-2">
            <label className="label" htmlFor={id}>
                {name}
            </label>
            <input
                type="text"
                id={id}
                {...register(id, {
                    required: required && `${name} is required`,
                    pattern,
                })}
                className="input input-bordered w-full max-w-sm"
            />
            {errors[id]?.message && (
                <div className="text-error">{errors[id]?.message}</div>
            )}
        </div>
    )

    return (
        <div>
            <CheckoutSteps current={1} />

            <div className="max-w-sm mx-auto card bg-base-300 my-4">
                <div className="card-body">
                    <h1 className="card-title">배송지 입력</h1>
                    <form onSubmit={handleSubmit(formSubmit)}>
                        <FormInput name="이름" id="fullName" required />
                        <FormInput name="주소지" id="address" required />
                        <FormInput name="도시" id="city" required />
                        <FormInput name="우편번호" id="postalCode" required />
                        <FormInput name="나라" id="country" required />
                        <div className="my-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary w-full"
                            >
                                {isSubmitting && (
                                    <span className="loading loading-spinner"></span>
                                )}
                                다음
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Form
