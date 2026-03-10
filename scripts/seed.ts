import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Import models
import Product from '../models/Product';
import Category from '../models/Category';
import Admin from '../models/Admin';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            Product.deleteMany({}),
            Category.deleteMany({}),
            Admin.deleteMany({}),
        ]);
        console.log('🗑️  Cleared existing data');

        // Seed Categories
        const categories = await Category.insertMany([
            {
                name: 'Electronics',
                slug: 'electronics',
                description: 'Latest gadgets, smartphones, laptops, and tech accessories',
                imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
            },
            {
                name: 'Home & Kitchen',
                slug: 'home-kitchen',
                description: 'Everything for your home — furniture, appliances, and decor',
                imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
            },
            {
                name: 'Fashion',
                slug: 'fashion',
                description: 'Trending clothing, shoes, and accessories',
                imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
            },
            {
                name: 'Books',
                slug: 'books',
                description: 'Bestsellers, educational, and fiction books',
                imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
            },
            {
                name: 'Sports & Outdoors',
                slug: 'sports-outdoors',
                description: 'Fitness equipment, outdoor gear, and sportswear',
                imageUrl: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=400',
            },
        ]);
        console.log(`📁 Created ${categories.length} categories`);

        // Seed Products
        const products = await Product.insertMany([
            {
                name: 'Sony WH-1000XM5 Wireless Headphones',
                slug: 'sony-wh-1000xm5-wireless-headphones',
                description: 'Industry-leading noise cancellation with Auto NC Optimizer, crystal clear hands-free calling, and up to 30 hours of battery life.',
                categoryId: categories[0]._id,
                price: 348.00,
                originalPrice: 399.99,
                imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
                affiliateUrl: 'https://www.amazon.com/dp/B09XS7JWHH?tag=yourtag-20',
                featured: true,
                clicks: 245,
                rating: 4.8,
            },
            {
                name: 'Apple MacBook Air M2',
                slug: 'apple-macbook-air-m2',
                description: 'Supercharged by the M2 chip, redesigned with a 13.6-inch Liquid Retina display. Incredibly thin, fanless design.',
                categoryId: categories[0]._id,
                price: 1099.00,
                originalPrice: 1199.00,
                imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
                affiliateUrl: 'https://www.amazon.com/dp/B0B3C2R8MP?tag=yourtag-20',
                featured: true,
                clicks: 532,
                rating: 4.9,
            },
            {
                name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
                slug: 'instant-pot-duo-7-in-1',
                description: '7 appliances in 1: pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, and warmer.',
                categoryId: categories[1]._id,
                price: 79.95,
                originalPrice: 99.99,
                imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600',
                affiliateUrl: 'https://www.amazon.com/dp/B00FLYWNYQ?tag=yourtag-20',
                featured: true,
                clicks: 189,
                rating: 4.7,
            },
            {
                name: 'Nike Air Max 270 Running Shoes',
                slug: 'nike-air-max-270-running-shoes',
                description: 'The Nike Air Max 270 delivers visible cushioning under every step with its large window and fresh colorways.',
                categoryId: categories[2]._id,
                price: 129.99,
                originalPrice: 150.00,
                imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
                affiliateUrl: 'https://www.amazon.com/dp/B07D9JGT5Z?tag=yourtag-20',
                featured: false,
                clicks: 98,
                rating: 4.5,
            },
            {
                name: 'Atomic Habits by James Clear',
                slug: 'atomic-habits-james-clear',
                description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. #1 New York Times bestseller.',
                categoryId: categories[3]._id,
                price: 11.98,
                originalPrice: 16.99,
                imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
                affiliateUrl: 'https://www.amazon.com/dp/0735211299?tag=yourtag-20',
                featured: true,
                clicks: 420,
                rating: 4.9,
            },
            {
                name: 'Fitbit Charge 5 Advanced Fitness Tracker',
                slug: 'fitbit-charge-5-fitness-tracker',
                description: 'Advanced health & fitness tracker with built-in GPS, stress management tools, sleep tracking, and 24/7 heart rate.',
                categoryId: categories[4]._id,
                price: 119.95,
                originalPrice: 149.95,
                imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600',
                affiliateUrl: 'https://www.amazon.com/dp/B09BXHCQPG?tag=yourtag-20',
                featured: false,
                clicks: 156,
                rating: 4.4,
            },
            {
                name: 'Dyson V15 Detect Cordless Vacuum',
                slug: 'dyson-v15-detect-cordless-vacuum',
                description: 'Reveals microscopic dust with a precisely-angled laser. Powerful suction and intelligent real-time reports.',
                categoryId: categories[1]._id,
                price: 599.99,
                originalPrice: 749.99,
                imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600',
                affiliateUrl: 'https://www.amazon.com/dp/B0971RG81G?tag=yourtag-20',
                featured: true,
                clicks: 312,
                rating: 4.7,
            },
            {
                name: 'Samsung 65" QLED 4K Smart TV',
                slug: 'samsung-65-qled-4k-smart-tv',
                description: 'Quantum Dot technology delivers over a billion shades of brilliant color. 100% Color Volume with Quantum Dots.',
                categoryId: categories[0]._id,
                price: 797.99,
                originalPrice: 997.99,
                imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600',
                affiliateUrl: 'https://www.amazon.com/dp/B09J4LDB6X?tag=yourtag-20',
                featured: false,
                clicks: 267,
                rating: 4.6,
            },
        ]);
        console.log(`📦 Created ${products.length} products`);

        // Seed Admin
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 12);
        const admin = await Admin.create({
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
            password: hashedPassword,
            role: 'superadmin',
        });
        console.log(`👤 Created admin: ${admin.email}`);

        console.log('\n🎉 Seed complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();
