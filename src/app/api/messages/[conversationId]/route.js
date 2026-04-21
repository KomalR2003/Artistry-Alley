import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import MessageModel from "@/app/models/MessageModel";
import ConversationModel from "@/app/models/ConversationModel";
import UserModel from "@/app/models/userModel";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { conversationId } = resolvedParams;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId"); // Who is requesting

    if (!conversationId) {
      return NextResponse.json({ success: false, message: "Conversation ID is required" }, { status: 400 });
    }

    // Mark unread messages sent TO this user as read
    if (userId) {
      await MessageModel.updateMany(
        { conversationId, receiverId: userId, isRead: false },
        { isRead: true }
      );
    }

    // Fetch messages AFTER marking read
    const messages = await MessageModel.find({ conversationId }).sort({ createdAt: 1 })
    .populate({
      path: "senderId",
      select: "username profilePicture role _id",
      model: UserModel
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
