import { Schema, model } from 'mongoose';
import slugify from 'slugify'; 

const TranslationSchema = new Schema({
    en: { type: String, required: false },
    es: { type: String },
    fr: { type: String },
    de: { type: String }
}, { _id: false });

const SvgSchema = new Schema(
    {
        productID: {
            type: Number,
            required: true
        },
        title: {
            type: TranslationSchema,
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
            type: TranslationSchema,
            required: true,
        },
        typeoffile: {
            type: String,
            enum: ['svg','tiff', 'png', 'jpg'],
            default: 'svg',
        },
        ismeasureable: {
            type: Boolean,
            default: false,
        },
        slug: {
            type: String,
            required: true,
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
        isbanner: {
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
        material: {
            type: [TranslationSchema],
            default: [],
        },
        materialDescription: {
            type: TranslationSchema,
            default: { en: '' },
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

// Pre-save middleware to ensure slug is generated
SvgSchema.pre('save', function(next) {
    if (this.isModified('title.en')) {
        this.slug = slugify(this.title.en, { lower: true });
    }
    next();
});

const Svg = model('Svg', SvgSchema);

export default Svg;