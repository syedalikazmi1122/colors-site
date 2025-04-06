import { Schema, model } from 'mongoose';
import slugify from 'slugify'; 
const SvgSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        url: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, 
    }
);

SvgSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = slugify(this.name, {
            lower: true, 
            strict: true, 
        });
    }
    next();
});

const Svg = model('Svg', SvgSchema);

export default Svg;