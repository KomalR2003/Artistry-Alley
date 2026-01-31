import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        // Basic Information (existing fields preserved)
        productname: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true
        },
        referenceno: {
            type: Number,
            required: true,
            unique: true,
        },

        // Product Size (modified to object structure)
        size: {
            height: {
                type: Number,
                required: true,
            },
            width: {
                type: Number,
                required: true,
            },
            unit: {
                type: String,
                default: "inches",
                enum: ["inches", "cm", "feet", "mm"]
            }
        },

        // NEW FIELDS - Pricing & Inventory
        originalPrice: {
            type: Number,
        },
        stock: {
            type: Number,
            default: 1,
        },
        inStock: {
            type: Boolean,
            default: true,
        },

        // Artist Information
        artistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        artistName: {
            type: String,
        },

        // Product Details
        medium: {
            type: String,
            trim: true,
        },
        yearCreated: {
            type: Number,
        },
        orientation: {
            type: String,
            enum: ["Portrait", "Landscape", "Square"],
        },


        // Images & Media
        images: [{
            type: String,
        }],
        thumbnail: {
            type: String,
        },

        // Sales & Marketing
        tags: [{
            type: String,
            trim: true,
        }],
        featured: {
            type: Boolean,
            default: false,
        },
        bestseller: {
            type: Boolean,
            default: false,
        },

        // Ratings & Reviews
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numReviews: {
            type: Number,
            default: 0,
        },

        // Status
        status: {
            type: String,
            enum: ["active", "draft", "soldout", "archived"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
ProductSchema.index({ artistId: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ tags: 1 });

const ProductModel = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default ProductModel;
