import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Subscriber from '@/models/Subscriber';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        const [totalProducts, totalCategories, totalSubscribers, clicksResult] = await Promise.all([
            Product.countDocuments(),
            Category.countDocuments(),
            Subscriber.countDocuments(),
            Product.aggregate([{ $group: { _id: null, totalClicks: { $sum: '$clicks' } } }]),
        ]);

        const totalClicks = clicksResult[0]?.totalClicks || 0;

        const recentProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name price clicks createdAt')
            .lean();

        return NextResponse.json({
            stats: { totalProducts, totalCategories, totalSubscribers, totalClicks },
            recentProducts,
        });
    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
