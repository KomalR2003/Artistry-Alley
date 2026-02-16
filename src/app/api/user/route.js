import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import UserModel from "@/app/models/userModel";

// GET - Get current user information
export async function GET(request) {
    try {
        await dbConnect();

        // Get userId from query parameter (or you can use cookies/session)
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User ID is required"
                },
                { status: 400 }
            );
        }

        // Fetch user data from database
        const user = await UserModel.findById(userId).select('username email role');

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch user data",
                error: error.message
            },
            { status: 500 }
        );
    }
}
