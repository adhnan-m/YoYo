import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, trim: true, unique: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String },
        imageUrl: { type: String },
    },
    { timestamps: true }
);

CategorySchema.index({ slug: 1 });

const Category: Model<ICategory> =
    mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
