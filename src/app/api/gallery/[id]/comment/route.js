import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/app/lib/db';
import GalleryModel from '@/app/models/GalleryModel';
import NotificationModel from '@/app/models/NotificationModel';

import { checkContentToxicity } from '@/app/lib/moderation';

export async function POST(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params; // Gallery Image ID
        const body = await request.json();
        const { userId, userName, text } = body;

        if (!userId || !userName || !text) {
            return NextResponse.json({ success: false, message: 'User ID, Username, and text are required' }, { status: 400 });
        }

        const galleryImage = await GalleryModel.findById(id);
        if (!galleryImage) {
            return NextResponse.json({ success: false, message: 'Image not found' }, { status: 404 });
        }

        // Moderation Check using OpenAI
        const moderationResult = await checkContentToxicity(text);
        const status = moderationResult.status;

        const newComment = {
            user: userId,
            userName: userName,
            text: text,
            status: status,
            createdAt: new Date()
        };

        galleryImage.comments.push(newComment);
        await galleryImage.save();

        if (status !== 'hidden' && galleryImage.artistId && galleryImage.artistId.toString() !== userId.toString()) {
            await NotificationModel.create({
                userId: galleryImage.artistId,
                message: `${userName || 'Someone'} commented on your artwork "${galleryImage.title || 'Untitled'}": "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`,
                type: 'system',
                relatedId: galleryImage._id,
                link: '/artist/portfolio'
            });
        }

        // We always return the comment, let the frontend decide whether to show it based on status
        return NextResponse.json({
            success: true,
            message: status === 'hidden' ? 'Comment submitted for review' : 'Comment added',
            comment: newComment,
            status: status
        });

    } catch (error) {
        console.error('Error adding comment:', error);
        return NextResponse.json({ success: false, message: 'Error adding comment', error: error.message }, { status: 500 });
    }
}
