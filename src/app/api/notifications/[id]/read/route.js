import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import NotificationModel from "@/app/models/NotificationModel";

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ success: false, message: "Notification ID is required" }, { status: 400 });
    }

    // Support for marking all as read if id === "all" (from query or body, but let's just use "all" param)
    if (id === "all") {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("userId");
      if(userId) {
        await NotificationModel.updateMany({ userId, isRead: false }, { isRead: true });
        return NextResponse.json({ success: true, message: "All notifications marked as read" });
      }
    }

    const updated = await NotificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true });
    
    if (!updated) {
       return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, notification: updated });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
