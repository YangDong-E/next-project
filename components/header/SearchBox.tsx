'use client'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'

export const SearchBox = () => {
    const searchParams = useSearchParams()
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category') || '전체'

    const { data: categories, error } = useSWR('/api/products/categories')

    if (error) return error.message
    if (!categories) return 'Loading...'

    return (
        <form action="/search" method="GET">
            <div className="join">
                <select
                    name="category"
                    defaultValue={category}
                    className="join-item select select-bordered "
                >
                    <option value="all">전체</option>
                    {categories.map((c: string) => (
                        <option key={c}>{c}</option>
                    ))}
                </select>
                <input
                    className="join-item input input-bordered  w-96"
                    placeholder="검색"
                    defaultValue={q}
                    name="q"
                />
                <button
                    className="join-item btn"
                    style={{
                        border: 'solid 1px var(--fallback-bc,oklch(var(--bc)/0.2))',
                    }}
                >
                    검색
                </button>
            </div>
        </form>
    )
}
