import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

// GET /api/admin/subscribers
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ subscribers });
    } catch (error) {
        console.error('Subscribers GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/admin/subscribers
export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { id } = await request.json();
        const subscriber = await Subscriber.findByIdAndDelete(id);
        if (!subscriber) {
            return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Subscriber deleted' });
    } catch (error) {
        console.error('Subscriber DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
