import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { ZodError } from 'zod';
import Product from '@/models/Product';
import { productUpdateSchema } from '@/lib/validations';
import slugify from 'slugify';

// GET /api/admin/products/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { id } = await params;
        const product = await Product.findById(id).populate('categoryId', 'name').lean();
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ product });
    } catch (error) {
        console.error('Product GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/admin/products/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const validated = productUpdateSchema.parse(body);

        const updateData: Record<string, unknown> = { ...validated };
        if (validated.name) {
            updateData.slug = slugify(validated.name, { lower: true, strict: true });
        }

        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
        }
        console.error('Product PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/admin/products/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { id } = await params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Product DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
