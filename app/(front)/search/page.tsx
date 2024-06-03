import ProductItem from '@/components/products/ProductItem'
import productServices from '@/lib/services/productService'
import Link from 'next/link'
import React from 'react'

const sortOrders = ['최신순', '낮은가격순', '높은가격순']
const prices = [
    {
        name: '1원 ~ 50원',
        value: '1-50',
    },
    {
        name: '51원 ~ 200원',
        value: '51-200',
    },
    {
        name: '201원 ~ 1000원',
        value: '201-1000',
    },
]
export async function generateMetadata({
    searchParams: { q = 'all', category = 'all', price = 'all' },
}: {
    searchParams: {
        q: string
        category: string
        price: string
        sort: string
        page: string
    }
}) {
    if ((q !== 'all' && q !== '') || category !== 'all' || price !== 'all') {
        return {
            title: `Search ${q !== 'all' ? q : ''}
          ${category !== 'all' ? ` : Category ${category}` : ''}
          ${price !== 'all' ? ` : Price ${price}` : ''}
          `,
        }
    } else {
        return {
            title: 'Search Products',
        }
    }
}

export default async function SearchPage({
    searchParams: {
        q = 'all',
        category = 'all',
        price = 'all',
        sort = '최신순',
        page = '1',
    },
}: {
    searchParams: {
        q: string
        category: string
        price: string
        sort: string
        page: string
    }
}) {
    const getFilterUrl = ({
        c,
        s,
        p,
        pg,
    }: {
        c?: string
        s?: string
        p?: string
        pg?: string
    }) => {
        const params = { q, category, price, sort, page }
        if (c) params.category = c
        if (p) params.price = p
        if (pg) params.page = pg
        if (s) params.sort = s
        return `/search?${new URLSearchParams(params).toString()}`
    }
    const categories = await productServices.getCategories()
    const { countProducts, products, pages } = await productServices.getByQuery(
        {
            category,
            q,
            price,
            page,
            sort,
        }
    )
    return (
        <div className="grid md:grid-cols-5 md:gap-5">
            <div>
                <div className="text-xl pt-3">카테고리</div>
                <div>
                    <ul>
                        <li>
                            <Link
                                className={`link link-hover ${
                                    'all' === category && 'link-primary'
                                }`}
                                href={getFilterUrl({ c: 'all' })}
                            >
                                모두
                            </Link>
                        </li>
                        {categories.map((c: string) => (
                            <li key={c}>
                                <Link
                                    className={`link link-hover ${
                                        c === category && 'link-primary'
                                    }`}
                                    href={getFilterUrl({ c })}
                                >
                                    {c}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <div className="text-xl pt-3">가격대</div>
                    <ul>
                        <li>
                            <Link
                                className={`link link-hover ${
                                    'all' === price && 'link-primary'
                                }`}
                                href={getFilterUrl({ p: 'all' })}
                            >
                                모두
                            </Link>
                        </li>
                        {prices.map((p) => (
                            <li key={p.value}>
                                <Link
                                    href={getFilterUrl({ p: p.value })}
                                    className={`link link-hover ${
                                        p.value === price && 'link-primary'
                                    }`}
                                >
                                    {p.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="md:col-span-4">
                <div className="flex items-center justify-between  py-4">
                    <div className="flex items-center">
                        {products.length === 0 ? '없음' : countProducts}개
                        {q !== 'all' && q !== '' && ' : ' + q}
                        {category !== 'all' && ' : ' + category}
                        {price !== 'all' && ' : Price ' + price}
                        &nbsp;
                        {(q !== 'all' && q !== '') ||
                        category !== 'all' ||
                        price !== 'all' ? (
                            <Link
                                className="btn btn-sm btn-ghost"
                                href="/search"
                            >
                                초기화
                            </Link>
                        ) : null}
                    </div>
                    <div className="grid grid-cols-3 justify-items-end ">
                        {/* <span
                            // style={{
                            //     borderRight:
                            //         'solid 1px var(--fallback-bc,oklch(var(--bc)/0.5)',
                            //     paddingRight: '20px',
                            //     fontSize: '20px',
                            // }}
                            className="border-r border-solid border-zinc-700 pr-3"
                        >
                            분류
                        </span> */}
                        {sortOrders.map((s) => (
                            <Link
                                key={s}
                                className={`mx-2 link link-hover ${
                                    sort == s ? 'link-primary' : ''
                                } 
                                `}
                                href={getFilterUrl({ s })}
                            >
                                {s}
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3  ">
                        {products.map((product) => (
                            <ProductItem key={product.slug} product={product} />
                        ))}
                    </div>
                    <div className="join">
                        {products.length > 0 &&
                            Array.from(Array(pages).keys()).map((p) => (
                                <Link
                                    key={p}
                                    className={`join-item btn ${
                                        Number(page) === p + 1
                                            ? 'btn-active'
                                            : ''
                                    } `}
                                    href={getFilterUrl({ pg: `${p + 1}` })}
                                >
                                    {p + 1}
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
