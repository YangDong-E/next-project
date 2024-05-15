import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'

export const GET = async (req: any) => {
    await dbConnect()
    // distinct를 사용하여 특정 부분만 가져옴
    const categories = await ProductModel.find().distinct('category')
    return Response.json(categories)
}
