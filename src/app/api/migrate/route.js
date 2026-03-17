import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/app/lib/db';
import GalleryModel from '@/app/models/GalleryModel';

export async function GET() {
    try {
        await dbConnect();

        // Reset all views manually by Administrator
        await GalleryModel.updateMany({}, { $set: { views: 0, viewedBy: [] } });

        return NextResponse.json({ success: true, message: "Migration complete" });
    } catch (e) {
        return NextResponse.json({ success: false, error: e.message });
    }
}
