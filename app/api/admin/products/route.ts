import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { ZodError } from 'zod';
import Product from '@/models/Product';
import { productSchema } from '@/lib/validations';
import slugify from 'slugify';

// GET /api/admin/products - List all products
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';

        const query = search
            ? { name: { $regex: search, $options: 'i' } }
            : {};

        const [products, total] = await Promise.all([
            Product.find(query)
                .populate('categoryId', 'name')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Product.countDocuments(query),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Products GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/admin/products - Create product
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await request.json();
        const validated = productSchema.parse(body);

        const slug = slugify(validated.name, { lower: true, strict: true });

        // Check for duplicate slug
        const existing = await Product.findOne({ slug });
        if (existing) {
            return NextResponse.json({ error: 'A product with this name already exists' }, { status: 400 });
        }

        const product = await Product.create({ ...validated, slug });
        return NextResponse.json({ product }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
        }
        console.error('Products POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
