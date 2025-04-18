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
        typeoffile: {
            type: String,
            enum: ['svg','tiff', 'png', 'jpg'],
            default: 'svg',
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        url: {
            type: [String],
            required: true,
          default: [],
        },
      
        isfeatured: {
            type: Boolean,
            default: false,
        },
        editablecolors: {
            type: [String],
            default: [],
        },
        isvisible: {
            type: Boolean,
            default: true,
        },
        isbanner:
        {
            type: Boolean,
            default: false,
        },
        instagram_link: {
            type: String,
            default: null,
        },
        featureOnInstagram: {
            type: Boolean,
            default: false,
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
        this.slug = slugify(this.title, {
            lower: true, 
            strict: true, 
        });
    }
    next();
});

const Svg = model('Svg', SvgSchema);

export default Svg;