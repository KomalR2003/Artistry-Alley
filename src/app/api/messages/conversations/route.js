import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import ConversationModel from "@/app/models/ConversationModel";
import UserModel from "@/app/models/userModel";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    // Find all conversations where the user is a participant
    const conversations = await ConversationModel.find({
      participants: { $in: [userId] }
    })
    .populate({
      path: "participants",
      select: "username profilePicture role _id",
      model: UserModel
    })
    .sort({ lastMessageAt: -1 });

    return NextResponse.json({ success: true, conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
