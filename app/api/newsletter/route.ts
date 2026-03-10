import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import { ZodError } from 'zod';
import { subscriberSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const { email } = subscriberSchema.parse(body);

        const existing = await Subscriber.findOne({ email: email.toLowerCase() });
        if (existing) {
            return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 });
        }

        await Subscriber.create({ email: email.toLowerCase() });
        return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }
        console.error('Newsletter error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
