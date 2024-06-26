import { cache } from 'react'
import dbConnect from '@/lib/dbConnect'
import ProductModel, { Product } from '@/lib/models/ProductModel'

export const revalidate = 3600

const getLatest = cache(async () => {
    await dbConnect()
    const products = await ProductModel.find({})
        .sort({ _id: -1 })
        .limit(6)
        .lean()
    return products as Product[]
})

const getFeatured = cache(async () => {
    await dbConnect()
    const products = await ProductModel.find({ isFeatured: true })
        .limit(3)
        .lean()
    return products as Product[]
})

const getBySlug = cache(async (slug: string) => {
    await dbConnect()
    const product = await ProductModel.findOne({ slug }).lean()
    return product as Product
})

const PAGE_SIZE = 6
const getByQuery = cache(
    async ({
        q,
        category,
        sort,
        price,
        page = '1',
    }: {
        q: string
        category: string
        price: string
        sort: string
        page: string
    }) => {
        await dbConnect()

        const queryFilter =
            q && q !== 'all'
                ? {
                      name: {
                          $regex: q,
                          $options: 'i',
                      },
                  }
                : {}
        const categoryFilter =
            category && category !== 'all' ? { category } : {}
        // 10-50
        const priceFilter =
            price && price !== 'all'
                ? {
                      price: {
                          $gte: Number(price.split('-')[0]),
                          $lte: Number(price.split('-')[1]),
                      },
                  }
                : {}
        const order: Record<string, 1 | -1> =
            sort === '낮은가격순'
                ? { price: 1 }
                : sort === '높은가격순'
                ? { price: -1 }
                : { _id: -1 }

        const categories = await ProductModel.find().distinct('category')
        const products = await ProductModel.find(
            {
                ...queryFilter,
                ...categoryFilter,
                ...priceFilter,
            },
            '-reviews'
        )
            .sort(order)
            .skip(PAGE_SIZE * (Number(page) - 1))
            .limit(PAGE_SIZE)
            .lean()

        const countProducts = await ProductModel.countDocuments({
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
        })

        return {
            products: products as Product[],
            countProducts,
            page,
            pages: Math.ceil(countProducts / PAGE_SIZE),
            categories,
        }
    }
)

const getCategories = cache(async () => {
    await dbConnect()
    const categories = await ProductModel.find().distinct('category')
    return categories
})

const productService = {
    getBySlug,
    getFeatured,
    getLatest,
    getByQuery,
    getCategories,
}

export default productService
