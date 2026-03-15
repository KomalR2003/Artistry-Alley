import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import UserModel from "@/app/models/userModel";

export async function GET(request) {
    try {
        await dbConnect();
        const users = await UserModel.find({}, '-password').sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error("Admin Users GET error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const deletedUser = await UserModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Admin Users DELETE error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete user" },
            { status: 500 }
        );
    }
}
