import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import GalleryModel from '@/app/models/GalleryModel';

// Fetch all hidden comments
export async function GET(request) {
    try {
        await dbConnect();
        const galleries = await GalleryModel.find({ 'comments.status': 'hidden' });
        
        let hiddenComments = [];
        galleries.forEach(gallery => {
            gallery.comments.forEach(comment => {
                if (comment.status === 'hidden') {
                    hiddenComments.push({
                        galleryId: gallery._id,
                        galleryTitle: gallery.title,
                        galleryImage: gallery.imageUrl,
                        commentId: comment._id,
                        user: comment.user,
                        userName: comment.userName,
                        text: comment.text,
                        createdAt: comment.createdAt
                    });
                }
            });
        });

        // Sort by newest
        hiddenComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return NextResponse.json({ success: true, comments: hiddenComments });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Approve or Delete Comment
export async function PUT(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { galleryId, commentId, action } = body; // action: 'approve' or 'delete'

        if (!galleryId || !commentId || !action) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const gallery = await GalleryModel.findById(galleryId);
        if (!gallery) {
            return NextResponse.json({ success: false, message: 'Gallery item not found' }, { status: 404 });
        }

        const commentIndex = gallery.comments.findIndex(c => c._id.toString() === commentId);
        
        if (commentIndex === -1) {
            return NextResponse.json({ success: false, message: 'Comment not found' }, { status: 404 });
        }

        if (action === 'approve') {
            gallery.comments[commentIndex].status = 'approved';
        } else if (action === 'delete') {
            gallery.comments.splice(commentIndex, 1);
        } else {
            return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
        }

        await gallery.save();
        return NextResponse.json({ success: true, message: `Comment ${action}d successfully` });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
