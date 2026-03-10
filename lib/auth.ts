import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { checkRateLimit } from '@/lib/rate-limit';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                // Rate limiting
                const rateLimitResult = checkRateLimit(credentials.email);
                if (!rateLimitResult.success) {
                    throw new Error('Too many login attempts. Please try again later.');
                }

                await dbConnect();
                const admin = await Admin.findOne({ email: credentials.email.toLowerCase() });

                if (!admin) {
                    throw new Error('Invalid email or password');
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, admin.password);
                if (!isPasswordValid) {
                    throw new Error('Invalid email or password');
                }

                return {
                    id: admin._id.toString(),
                    email: admin.email,
                    role: admin.role,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { role?: string }).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as { id?: string }).id = token.id as string;
                (session.user as { role?: string }).role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/admin/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
