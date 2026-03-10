import { z } from 'zod';

// Product validation
export const productSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    description: z.string().min(1, 'Description is required').max(5000),
    categoryId: z.string().min(1, 'Category is required'),
    price: z.number().min(0, 'Price must be positive'),
    originalPrice: z.number().min(0).optional(),
    imageUrl: z.string().url('Invalid image URL'),
    affiliateUrl: z.string().url('Invalid affiliate URL'),
    featured: z.boolean().optional().default(false),
    rating: z.number().min(0).max(5).optional(),
});

export const productUpdateSchema = productSchema.partial();

// Category validation
export const categorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().max(500).optional(),
    imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

// Subscriber validation
export const subscriberSchema = z.object({
    email: z.string().email('Invalid email address'),
});

// Login validation
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type SubscriberInput = z.infer<typeof subscriberSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
