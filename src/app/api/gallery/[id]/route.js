import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import GalleryModel from "@/app/models/GalleryModel";

// GET - Get single gallery image by ID
export async function GET(request, { params }) {
    try {
        await dbConnect();

        const { id } = params;
        const image = await GalleryModel.findById(id).populate('artistId', 'username email');

        if (!image) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Gallery image not found"
                },
                { status: 404 }
            );
        }

        // Increment views
        image.views += 1;
        await image.save();

        return NextResponse.json({
            success: true,
            image
        });

    } catch (error) {
        console.error("Error fetching gallery image:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch gallery image",
                error: error.message
            },
            { status: 500 }
        );
    }
}

// PUT - Update gallery image
export async function PUT(request, { params }) {
    try {
        await dbConnect();

        const { id } = params;
        const body = await request.json();

        const updatedImage = await GalleryModel.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updatedImage) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Gallery image not found"
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Gallery image updated successfully",
            image: updatedImage
        });

    } catch (error) {
        console.error("Error updating gallery image:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update gallery image",
                error: error.message
            },
            { status: 500 }
        );
    }
}

// DELETE - Delete/archive gallery image
export async function DELETE(request, { params }) {
    try {
        await dbConnect();

        const { id } = params;
        const { searchParams } = new URL(request.url);
        const soft = searchParams.get("soft") === "true";

        if (soft) {
            // Soft delete - just change status to archived
            const updatedImage = await GalleryModel.findByIdAndUpdate(
                id,
                { status: "archived" },
                { new: true }
            );

            if (!updatedImage) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Gallery image not found"
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Gallery image archived successfully",
                image: updatedImage
            });
        } else {
            // Hard delete
            const deletedImage = await GalleryModel.findByIdAndDelete(id);

            if (!deletedImage) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Gallery image not found"
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Gallery image deleted successfully"
            });
        }

    } catch (error) {
        console.error("Error deleting gallery image:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete gallery image",
                error: error.message
            },
            { status: 500 }
        );
    }
}
