import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/app/lib/db';
import GalleryModel from '@/app/models/GalleryModel';

export async function POST(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params; // Gallery Image ID

        if (!id) {
            return NextResponse.json({ success: false, message: 'Image ID is required' }, { status: 400 });
        }

        let body = {};
        try {
            // It's possible the request has no body
            body = await request.json();
        } catch (e) { }

        const { userId } = body;

        const galleryImage = await GalleryModel.findById(id);

        if (!galleryImage) {
            return NextResponse.json({ success: false, message: 'Image not found' }, { status: 404 });
        }

        let isUniqueView = false;

        if (userId) {
            // Track authenticated unique views
            if (!galleryImage.viewedBy) galleryImage.viewedBy = [];

            if (!galleryImage.viewedBy.includes(userId)) {
                galleryImage.viewedBy.push(userId);
                galleryImage.views += 1;
                isUniqueView = true;
            }
        } else {
            // Anonymous view, always increment
            galleryImage.views += 1;
            isUniqueView = true;
        }

        if (isUniqueView) {
            await galleryImage.save();
        }

        return NextResponse.json({
            success: true,
            views: galleryImage.views,
            unique: isUniqueView
        });

    } catch (error) {
        console.error('Error incrementing view count:', error);
        return NextResponse.json({ success: false, message: 'Error updating views', error: error.message }, { status: 500 });
    }
}
