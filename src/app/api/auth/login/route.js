import { NextResponse } from "next/server";
import UserModel from "@/app/models/userModel";
import dbConnect from "@/app/lib/db";
import { sendLoginNotificationEmail } from "@/app/lib/emailService";

export async function POST(request) {
    await dbConnect();

    const { email, password } = await request.json();

    const user = await UserModel.findOne({ email });
    if (!user) {
        return NextResponse.json(
            { message: "Invalid email or password" },
            { status: 400 }
        );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return NextResponse.json(
            { message: "Invalid email or password" },
            { status: 400 }
        );
    }

    // Send login notification email asynchronously (don't wait for it)
    sendLoginNotificationEmail(user.email, user.username)
        .then(() => console.log('Login notification email sent successfully'))
        .catch(err => console.error('Failed to send login notification email:', err));

    const res = NextResponse.json(
        {
            success: true,
            message: "Login successful",
            userId: user._id.toString(),
            username: user.username,
            role: user.role,
            redirect:
                user.role === "admin"
                    ? "/admin"
                    : user.role === "artist"
                        ? "/artist"
                        : "/dashboard",
        });

    res.cookies.set({
        name: "token",
        value: `loggedin-${user._id}`,
        httpOnly: true,
        path: "/",
        maxAge: 60, // 2 minutes
    });

    res.cookies.set({
        name: "role",
        value: user.role,
        path: "/",
        maxAge: 60, // 2 minutes
    });

    return res;
}
