import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import z from "zod";

const petSchema = z.object({
  name: z.string().min(1).max(100),
  age: z.number().min(0).max(100),
  gender: z.enum(["male", "female"]),
  vaccinated: z.boolean(),
  additionalInfo: z.string().max(500).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  status: z.enum(["missing", "adopted", "found", "available"]),
  categoryId: z.string().min(1).max(100),
  imageUrl: z.string(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions as AuthOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const ownerId = session.user.id;
    if (!ownerId) {
      return NextResponse.json(
        { message: "User ID not found in session" },
        { status: 401 }
      );
    }
    const parsed = petSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const {
      name,
      age,
      additionalInfo,
      city,
      state,
      gender,
      status,
      vaccinated,
      categoryId,
      imageUrl,
    } = parsed.data;

    const petData = await prisma.pet.create({
      data: {
        name,
        age,
        additionalInfo,
        city,
        state,
        gender,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: status.toUpperCase() as any,
        vaccinated,
        categoryId,
        ownerId: ownerId,
        imageUrl,
      },
    });

    return NextResponse.json({ petData }, { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
 }
}

