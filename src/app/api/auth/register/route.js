import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import UserModel from "@/app/models/userModel";
import { sendWelcomeEmail } from "@/app/lib/emailService";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "POST to this endpoint to register users.",
  });
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    if (!body?.email || !body?.password || !body?.username || !body?.dob) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 }
      );
    }

    if (body.role === "artist" && (!body.experience || !body.specialization)) {
      return NextResponse.json(
        {
          success: false,
          error: "Experience and specialization required for artists",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.create({
      username: body.username,
      email: body.email,
      password: body.password,
      mobile: body.mobile,
      dob: body.dob,
      role: body.role,
      experience: body.experience,
      specialization: body.specialization,
      portfolio: body.portfolio,
      bio: body.bio,
      agree: body.agree,
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    // Send welcome email asynchronously (don't wait for it)
    sendWelcomeEmail(body.email, body.username, body.role || 'user')
      .then(() => console.log('Welcome email sent successfully'))
      .catch(err => console.error('Failed to send welcome email:', err));

    return NextResponse.json(
      { success: true, message: "User registered", data: safeUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error?.name === "ValidationError" && error?.errors) {
      const messages = Object.values(error.errors)
        .map(e => e?.message)
        .filter(Boolean)
        .join(", ");

      return NextResponse.json(
        { success: false, error: messages },
        { status: 400 }
      );
    }

    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error?.message || "Registration failed" },
      { status: 500 }
    );
  }
}
