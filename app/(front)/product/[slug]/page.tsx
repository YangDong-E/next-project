import AddToCart from '@/components/products/AddToCart'
import { convertDocToObj } from '@/lib/utils'
import data from '@/lib/data'
import productService from '@/lib/services/productService'
import Image from 'next/image'
import Link from 'next/link'

export async function generateMetadata({
    params,
}: {
    params: { slug: string }
}) {
    const product = await productService.getBySlug(params.slug)
    if (!product) {
        return { title: 'Product not found' }
    }
    return {
        title: product.name,
        description: product.description,
    }
}

export default async function ProductDetails({
    params,
}: {
    params: { slug: string }
}) {
    // data 파일에서 products안에서 find로 products.slug와 params.slug가 맞는 것을 찾는다.
    const product = await productService.getBySlug(params.slug)
    if (!product) {
        return <div>제품이 없습니다.</div>
    }
    return (
        <>
            <div
                className="my-2 btn"
                style={{
                    border: 'solid 1px var(--fallback-bc,oklch(var(--bc)/0.2))',
                }}
            >
                <Link href="/"> 메인으로</Link>
            </div>
            <div className="grid md:grid-cols-4 md:gab-3">
                <div className="md:col-span-2 mr-5">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={640}
                        height={640}
                        sizes="100vw"
                        style={{
                            width: '100%',
                            height: 'auto',
                        }}
                    />
                </div>
                <div>
                    <ul className="space-y-4 mr-5">
                        <li>
                            <h1 className="text-xl">{product.name}</h1>
                        </li>
                        <li>{product.brand}</li>
                        <li>
                            <div className="divider"></div>
                        </li>
                        <li>
                            상세 내용:{' '}
                            <p className="mt-2">{product.description}</p>
                        </li>
                    </ul>
                </div>
                <div>
                    <div className="card bg-base-300 shadow-xl mt-3 md:mt-0">
                        <div className="card-body">
                            <div className="mb-2 flex justify-between">
                                <div>가격</div>
                                <div>{product.price} 원</div>
                            </div>
                            <div className="mb-2 flex justify-between">
                                <div>재고상태</div>
                                <div>
                                    {product.countInStock > 0
                                        ? '재고 있음'
                                        : '재고 없음'}
                                </div>
                            </div>
                            {product.countInStock !== 0 && (
                                <div className="card-actions justify-center">
                                    <AddToCart
                                        item={{
                                            ...convertDocToObj(product),
                                            qty: 0,
                                            color: '',
                                            size: '',
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
