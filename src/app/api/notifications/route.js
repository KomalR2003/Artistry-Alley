import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import NotificationModel from "@/app/models/NotificationModel";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await NotificationModel.countDocuments({ userId, isRead: false });

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, message, type, relatedId, link } = body;

    if (!userId || !message) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const notification = await NotificationModel.create({
      userId,
      message,
      type: type || "system",
      relatedId,
      link
    });

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
