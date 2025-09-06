import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import z from "zod";

const userSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phoneNumber: z.string().min(10).max(15),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions as AuthOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return new Response("Unauthorized", { status: 401 });
    }

    const parsed = userSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const { email, password, name, phoneNumber } = parsed.data;

    if (!email || !password || !name || !phoneNumber) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: `user with email ${email} already exists` },
        { status: 409 }
      );
    }

    await prisma.user.create({
      data: {
        email,
        password,
        name,
        phoneNumber,
        role: "ADMIN",
      },
    });

    return NextResponse.json(
      { message: "Admin user created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
