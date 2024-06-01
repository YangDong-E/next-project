'use client'
import { Product } from '@/lib/models/ProductModel'
import { formatId } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

export default function Products() {
    const { data: products, error } = useSWR(`/api/admin/products`)

    const router = useRouter()

    const { trigger: deleteProduct } = useSWRMutation(
        `/api/admin/products`,
        async (url, { arg }: { arg: { productId: string } }) => {
            const toastId = toast.loading('삭제중...')
            const res = await fetch(`${url}/${arg.productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await res.json()
            res.ok
                ? toast.success('상품이 삭제되었습니다.', {
                      id: toastId,
                  })
                : toast.error(data.message, {
                      id: toastId,
                  })
        }
    )

    const { trigger: createProduct, isMutating: isCreating } = useSWRMutation(
        `/api/admin/products`,
        async (url) => {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await res.json()
            if (!res.ok) return toast.error(data.message)

            toast.success('상품이 성공적으로 등록되었습니다.')
            router.push(`/admin/products/${data.product._id}`)
        }
    )

    if (error) return 'An error has occurred.'
    if (!products) return 'Loading...'

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="py-4 text-2xl">상품목록</h1>
                <button
                    disabled={isCreating}
                    onClick={() => createProduct()}
                    className="btn btn-primary btn-sm"
                >
                    {isCreating && (
                        <span className="loading loading-spinner"></span>
                    )}
                    생성
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>상품ID</th>
                            <th>상품명</th>
                            <th>가격</th>
                            <th>카테고리</th>
                            <th>남은수량</th>
                            <th>평점</th>
                            <th>정보</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product: Product) => (
                            <tr key={product._id}>
                                <td>{formatId(product._id!)}</td>
                                <td>{product.name}</td>
                                <td>{product.price}원</td>
                                <td>{product.category}</td>
                                <td>{product.countInStock}</td>
                                <td>
                                    <Link
                                        href={`/admin/products/${product._id}`}
                                        type="button"
                                        className="btn btn-ghost btn-sm"
                                    >
                                        수정
                                    </Link>
                                    &nbsp;
                                    <button
                                        onClick={() =>
                                            deleteProduct({
                                                productId: product._id!,
                                            })
                                        }
                                        type="button"
                                        className="btn btn-ghost btn-sm"
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
