import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    categoryId: mongoose.Types.ObjectId;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    affiliateUrl: string;
    featured: boolean;
    clicks: number;
    rating?: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, required: true },
        categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        price: { type: Number, required: true, min: 0 },
        originalPrice: { type: Number, min: 0 },
        imageUrl: { type: String, required: true },
        affiliateUrl: { type: String, required: true },
        featured: { type: Boolean, default: false },
        clicks: { type: Number, default: 0 },
        rating: { type: Number, min: 0, max: 5 },
    },
    { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ featured: 1 });

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
