import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await params;
        const product = await Product.findOneAndUpdate(
            { slug },
            { $inc: { clicks: 1 } },
            { new: true }
        );

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ clicks: product.clicks });
    } catch (error) {
        console.error('Click tracking error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
