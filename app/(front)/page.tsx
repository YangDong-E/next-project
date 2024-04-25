import ProductItem from '@/components/products/ProductItem'
import data from '@/lib/data'

export default function Home() {
    return (
        <>
            <h2 className="text-2xl py-2">Latest Product</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {/* data(파일). products(불러올데이터).map(함수)로 뿌려주기 */}
                {data.products.map((product) => (
                    <ProductItem key={product.slug} product={product} />
                ))}
            </div>
        </>
    )
}
