import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import GalleryModel from "@/app/models/GalleryModel";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await dbConnect();

        // Fetch all gallery items with artist details
        const artworks = await GalleryModel.find({})
            .populate('artistId', 'name username email profilePicture role')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: artworks
        });
    } catch (error) {
        console.error("Admin Gallery GET error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch gallery artworks" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const artworkId = searchParams.get('id');

        if (!artworkId) {
            return NextResponse.json({ success: false, message: "Artwork ID is required" }, { status: 400 });
        }

        const deletedArtwork = await GalleryModel.findByIdAndDelete(artworkId);

        if (!deletedArtwork) {
            return NextResponse.json({ success: false, message: "Artwork not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Artwork removed successfully"
        });
    } catch (error) {
        console.error("Admin Gallery DELETE error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to remove artwork" },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { id, title, category } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Artwork ID is required" },
                { status: 400 }
            );
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (category !== undefined) updateData.category = category;

        const updatedArtwork = await GalleryModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedArtwork) {
            return NextResponse.json(
                { success: false, message: "Artwork not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Artwork updated successfully",
            data: updatedArtwork
        });

    } catch (error) {
        console.error("Admin Gallery PUT error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update artwork details" },
            { status: 500 }
        );
    }
}
