import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { ZodError } from 'zod';
import { categorySchema } from '@/lib/validations';
import slugify from 'slugify';

// PUT /api/admin/categories/[id]
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
        const validated = categorySchema.parse(body);

        const updateData = {
            ...validated,
            slug: slugify(validated.name, { lower: true, strict: true }),
        };

        const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({ category });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
        }
        console.error('Category PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/admin/categories/[id]
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

        // Check if any products reference this category
        const productCount = await Product.countDocuments({ categoryId: id });
        if (productCount > 0) {
            return NextResponse.json(
                { error: `Cannot delete: ${productCount} products are in this category` },
                { status: 400 }
            );
        }

        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Category deleted' });
    } catch (error) {
        console.error('Category DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
