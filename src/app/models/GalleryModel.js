import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
    {
        // Basic Information
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },

        // Category/Organization
        category: {
            type: String,
            trim: true,
            default: "Uncategorized",
        },
        album: {
            type: String,
            trim: true,
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

        // Metadata
        tags: [{
            type: String,
            trim: true,
        }],

        // Engagement
        likes: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },

        // Display Options
        featured: {
            type: Boolean,
            default: false,
        },

        // Status
        status: {
            type: String,
            enum: ["active", "archived"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
GallerySchema.index({ artistId: 1 });
GallerySchema.index({ category: 1 });
GallerySchema.index({ status: 1 });
GallerySchema.index({ tags: 1 });
GallerySchema.index({ featured: 1 });

const GalleryModel = mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);

export default GalleryModel;
