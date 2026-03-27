import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/app/lib/db';
import GalleryModel from '@/app/models/GalleryModel';
import NotificationModel from '@/app/models/NotificationModel';

export async function POST(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params; // Gallery Image ID
        const body = await request.json();
        const { userId, userName } = body;

        if (!userId) {
            return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
        }

        const galleryImage = await GalleryModel.findById(id);
        if (!galleryImage) {
            return NextResponse.json({ success: false, message: 'Image not found' }, { status: 404 });
        }

        // Toggle Like functionality gracefully supporting Mixed legacy strings and new wrapped objects
        let hasLiked = false;
        let likeIndex = -1;

        if (!galleryImage.likes) galleryImage.likes = [];

        for (let i = 0; i < galleryImage.likes.length; i++) {
            const like = galleryImage.likes[i];
            const likeUserId = (like && like.user) ? like.user.toString() : (like ? like.toString() : null);
            if (likeUserId && likeUserId === userId.toString()) {
                hasLiked = true;
                likeIndex = i;
                break;
            }
        }

        if (hasLiked) {
            // Remove like
            galleryImage.likes.splice(likeIndex, 1);
        } else {
            // Add robust like
            galleryImage.likes.push({
                user: userId,
                userName: userName || 'Anonymous User',
                createdAt: new Date()
            });

            if (galleryImage.artistId && galleryImage.artistId.toString() !== userId.toString()) {
                await NotificationModel.create({
                    userId: galleryImage.artistId,
                    message: `${userName || 'Someone'} liked your artwork "${galleryImage.title || 'Untitled'}"`,
                    type: "system",
                    relatedId: galleryImage._id,
                    link: "/artist/portfolio"
                });
            }
        }

        // Must notify Mongoose that a Mixed array was mutated
        galleryImage.markModified('likes');
        await galleryImage.save();

        return NextResponse.json({
            success: true,
            message: hasLiked ? 'Like removed' : 'Image liked',
            likes: galleryImage.likes.length,
            hasLiked: !hasLiked
        });

    } catch (error) {
        console.error('Error toggling like:', error);
        return NextResponse.json({ success: false, message: 'Error processing like', error: error.message }, { status: 500 });
    }
}
