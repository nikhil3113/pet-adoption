"use server";
import { prisma } from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { revalidatePath } from "next/cache";

type GetPetsParams = {
  categoryId?: string;
  state?: string;
  city?: string;
};

export async function getPets({ categoryId, state, city }: GetPetsParams = {}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (state) {
    where.state = { contains: state, mode: "insensitive" };
  }
  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }

  return prisma.pet.findMany({
    where,
    include: {
      category: true,
      owner: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updatePet(id: string, data: any) {
  try {
    const session = await getServerSession(authOptions as AuthOptions);
    if (!session || !session.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!pet) {
      return { success: false, message: "Pet not found" };
    }

    const isOwner = pet.ownerId === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return {
        success: false,
        message: "You don't have permission to update this pet",
      };
    }

    const normalizedData = {
      ...data,
      status: data.status.toUpperCase(),
    };

    await prisma.pet.update({
      where: { id },
      data: normalizedData,
    });

    revalidatePath(`/pets/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating pet:", error);
    return { success: false, message: "Failed to update pet" };
  }
}

export async function getPetById(id: string) {
  try {
    const session = await getServerSession(authOptions as AuthOptions);
    if (!session || !session.user?.id) {
      throw new Error("Unauthorized");
    }

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { category: true, owner: true },
    });

    if (!pet) {
      throw new Error("Pet not found");
    }

    const isOwner = pet.ownerId === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new Error("You don't have permission to view this pet");
    }

    return pet;
  } catch (error) {
    console.error("Error fetching pet:", error);
    throw error;
  }
}
