import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import GalleryModel from '@/app/models/GalleryModel';
import vader from 'vader-sentiment';

export async function GET(request) {
    try {
        await dbConnect();
        const galleries = await GalleryModel.find({});
        let updatedCount = 0;

        for (const gallery of galleries) {
            let modified = false;
            // Handle Mongoose Mixed array properly
            const comments = gallery.comments || [];
            if (comments.length > 0) {
                comments.forEach(c => {
                    if (c && c.text && c.status === 'approved') {
                        const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(c.text);
                        if (intensity.compound < 0) {
                            c.status = 'hidden';
                            modified = true;
                        }
                    }
                });
            }
            if (modified) {
                gallery.comments = comments; // re-assign just in case
                gallery.markModified('comments');
                await gallery.save();
                updatedCount++;
            }
        }
        return NextResponse.json({ success: true, message: `Successfully updated ${updatedCount} galleries with negative comments.` });
    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
