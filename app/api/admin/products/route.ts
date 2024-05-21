import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'

export const GET = auth(async (req: any) => {
    if (!req.auth || !req.auth.user?.isAdmin) {
        return Response.json(
            { message: 'unauthorized' },
            {
                status: 401,
            }
        )
    }
    await dbConnect()
    const products = await ProductModel.find()
    return Response.json(products)
}) as any

export const POST = auth(async (req: any) => {
    if (!req.auth || !req.auth.user?.isAdmin) {
        return Response.json(
            { message: 'unauthorized' },
            {
                status: 401,
            }
        )
    }
    await dbConnect()
    const product = new ProductModel({
        name: '샘플 상품',
        slug: '샘플 상품-' + Math.random(),
        image: '/images/shirt1.jpg',
        price: 0,
        category: '샘플',
        brand: '샘플',
        countInStock: 0,
        description: '샘플',
        rating: 0,
        numReviews: 0,
    })
    try {
        await product.save()
        return Response.json(
            { message: '성공적으로 상품이 등록되었습니다.', product },
            {
                status: 201,
            }
        )
    } catch (err: any) {
        return Response.json(
            { message: err.message },
            {
                status: 500,
            }
        )
    }
}) as any
