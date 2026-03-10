import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { ZodError } from 'zod';
import { categorySchema } from '@/lib/validations';
import slugify from 'slugify';

// GET /api/admin/categories
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const categories = await Category.find().sort({ name: 1 }).lean();
        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Categories GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/admin/categories
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await request.json();
        const validated = categorySchema.parse(body);

        const slug = slugify(validated.name, { lower: true, strict: true });
        const existing = await Category.findOne({ slug });
        if (existing) {
            return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
        }

        const category = await Category.create({ ...validated, slug });
        return NextResponse.json({ category }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
        }
        console.error('Categories POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
