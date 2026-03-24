import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import GalleryModel from '@/app/models/GalleryModel';

export async function GET(request) {
    try {
        await dbConnect();
        const galleries = await GalleryModel.find({});
        const allComments = [];

        for (const gallery of galleries) {
            if (gallery.comments && gallery.comments.length > 0) {
                gallery.comments.forEach(c => {
                    allComments.push({
                        title: gallery.title,
                        text: c.text,
                        status: c.status
                    });
                });
            }
        }
        return NextResponse.json({ success: true, allComments });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
