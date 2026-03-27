import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import UserModel from "@/app/models/userModel";

export async function GET(request) {
    try {
        await dbConnect();
        
        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role");
        const excludeId = searchParams.get("excludeId");

        let query = {};
        if (role) {
            query.role = role;
        }
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const users = await UserModel.find(query).select('_id username role profilePicture email').sort({ username: 1 });

        return NextResponse.json({
            success: true,
            users
        });

    } catch (error) {
        console.error("Error fetching users roster:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
