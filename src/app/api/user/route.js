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
        const user = await UserModel.findById(userId).select('username email role profilePicture mobile dob experience specialization bio');

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
                role: user.role,
                profilePicture: user.profilePicture,
                mobile: user.mobile,
                dob: user.dob,
                experience: user.experience,
                specialization: user.specialization,
                bio: user.bio
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

// PUT - Update user information
export async function PUT(request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { userId, profilePicture, username, mobile, bio, specialization, experience, email, role, dob } = body;

        if (!userId) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Build update object dynamically to only update provided fields
        const updateData = {};
        if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
        if (username !== undefined) updateData.username = username;
        if (mobile !== undefined) updateData.mobile = mobile;
        if (bio !== undefined) updateData.bio = bio;
        if (specialization !== undefined) updateData.specialization = specialization;
        if (experience !== undefined) updateData.experience = experience;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;
        if (dob !== undefined) updateData.dob = dob;

        const user = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ success: false, message: "Failed to update user", error: error.message }, { status: 500 });
    }
}
