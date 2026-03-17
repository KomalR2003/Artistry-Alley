import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/app/lib/db';
import GalleryModel from '@/app/models/GalleryModel';

// Simple bad-words filter list (for demonstration/moderation)
const BAD_WORDS = ['spam', 'scam', 'fake', 'stupid', 'idiot', 'ugly', 'hate', 'trash', 'crap'];

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

        // Moderation Check
        const lowerCaseText = text.toLowerCase();
        const containsBadWords = BAD_WORDS.some(word => lowerCaseText.includes(word));
        const status = containsBadWords ? 'hidden' : 'approved';

        const newComment = {
            user: userId,
            userName: userName,
            text: text,
            status: status,
            createdAt: new Date()
        };

        galleryImage.comments.push(newComment);
        await galleryImage.save();

        // Optional: Do not return the comment to the frontend entirely if it's hidden to immediately reflect it in UI
        return NextResponse.json({
            success: true,
            message: 'Comment added',
            comment: status === 'approved' ? newComment : null,
            status: status
        });

    } catch (error) {
        console.error('Error adding comment:', error);
        return NextResponse.json({ success: false, message: 'Error adding comment', error: error.message }, { status: 500 });
    }
}
