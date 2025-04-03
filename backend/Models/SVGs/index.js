import { Schema, model } from 'mongoose';
import slugify from 'slugify'; 
const SvgSchema = new Schema(
    {
        name: {
            type: String,
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

// Middleware to generate slug before saving
SvgSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = slugify(this.name, {
            lower: true, // Convert to lowercase
            strict: true, // Remove special characters
        });
    }
    next();
});

const Svg = model('Svg', SvgSchema);

export default Svg;