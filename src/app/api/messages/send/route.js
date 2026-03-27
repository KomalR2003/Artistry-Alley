import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import MessageModel from "@/app/models/MessageModel";
import ConversationModel from "@/app/models/ConversationModel";
import NotificationModel from "@/app/models/NotificationModel";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { senderId, receiverId, content } = body;

    if (!senderId || !receiverId || !content) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Handle string IDs to Objects manually if needed, but Mongoose typically handles it
    // Check if conversation exists
    let conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [senderId, receiverId],
        lastMessage: content,
        lastMessageAt: new Date()
      });
    } else {
      conversation.lastMessage = content;
      conversation.lastMessageAt = new Date();
      await conversation.save();
    }

    // Create Message
    const message = await MessageModel.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      content,
      isRead: false
    });

    // Create Notification for the receiver
    await NotificationModel.create({
      userId: receiverId,
      message: `New message: "${content.substring(0, 40)}${content.length > 40 ? '...' : ''}"`, 
      type: "message",
      relatedId: conversation._id,
      link: "/messages"
    });

    return NextResponse.json({ success: true, message, conversation });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
