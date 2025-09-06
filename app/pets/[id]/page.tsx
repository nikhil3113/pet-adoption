import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PetDetails from "@/components/pet/details/PetDetails";

async function getPetById(id: string) {
  try {
    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { category: true, owner: true },
    });
    return pet;
  } catch (error) {
    console.error("Error fetching pet by ID:", error);
    return null;
  }
}

export default async function PetByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pet = await getPetById(id);
  if (!pet) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-sky-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <PetDetails
          pet={{
            id: pet.id,
            name: pet.name,
            age: pet.age,
            gender:
              pet.gender === "male" || pet.gender === "female"
                ? pet.gender
                : "male",
            vaccinated: pet.vaccinated,
            additionalInfo: pet.additionalInfo ?? "",
            city: pet.city,
            state: pet.state,
            status: (["available", "found", "missing", "adopted"] as const)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .includes(pet.status?.toLowerCase?.() as any)
              ? (pet.status?.toLowerCase() as
                  | "available"
                  | "found"
                  | "missing"
                  | "adopted")
              : "available",
            imageUrl: pet.imageUrl,
            category: {
              id: pet.category?.id ?? "",
              name: pet.category?.name ?? "Uncategorized",
            },
            owner: {
              id: pet.owner?.id ?? "",
              name: pet.owner?.name ?? "Owner",
              email: pet.owner?.email ?? "",
              phoneNumber: pet.owner?.phoneNumber ?? "",
            },
            createdAt: pet.createdAt?.toISOString?.() ?? "",
          }}
        />
      </div>
    </div>
  );
}
