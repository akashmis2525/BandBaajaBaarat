import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceCategory extends Document {
  slug: string;
  name: string;
  tagline: string;
  vendorsCount: number;
  imageKey: string;
  category: 'Wedding Services' | 'Shopping' | 'Essentials' | 'Entertainment' | 'All';
  sortOrder: number;
  isActive: boolean;
}

const schema = new Schema<IServiceCategory>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    tagline: { type: String, default: '' },
    vendorsCount: { type: Number, default: 0 },
    imageKey: { type: String, required: true },
    category: {
      type: String,
      enum: ['Wedding Services', 'Shopping', 'Essentials', 'Entertainment', 'All'],
      required: true,
      index: true,
    },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const ServiceCategory = mongoose.model<IServiceCategory>('ServiceCategory', schema);
