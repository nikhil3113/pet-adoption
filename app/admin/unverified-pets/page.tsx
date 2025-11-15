import { prisma } from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

// Server action to verify pets
async function verifyPet(petId: string, isVerified: boolean) {
  "use server";

  const session = await getServerSession(authOptions as AuthOptions);

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.pet.update({
    where: { id: petId },
    data: { isVerified, reviewStatus: isVerified ? "APPROVED" : "REJECTED" },
  });

  revalidatePath("/admin/unverified-pets");
}

export default async function AdminReviewPage() {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const unverifiedPets = await prisma.pet.findMany({
    where: { isVerified: false },
    include: { category: true, owner: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Pet Listings Review</h1>
      <p className="text-slate-600 mb-8">
        Review and verify pet listings. {unverifiedPets.length} pending review.
      </p>

      {unverifiedPets.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            All caught up!
          </h3>
          <p className="text-slate-500">No pets pending verification.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {unverifiedPets.map((pet) => (
            <div
              key={pet.id}
              className="border border-slate-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex gap-6">
                <Image
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-32 h-32 object-cover rounded-lg"
                  width={128}
                  height={128}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {pet.name}
                      </h3>
                      <p className="text-slate-600">
                        {pet.age} year{pet.age !== 1 ? "s" : ""} old •{" "}
                        {pet.gender} • {pet.category.name}
                      </p>
                      <p className="text-slate-600">
                        📍 {pet.city}, {pet.state}
                      </p>
                      <p className="text-slate-600">
                        👤 Owner: {pet.owner.name} ({pet.owner.email})
                      </p>
                      <p className="text-sm text-slate-500 mt-2">
                        Added: {new Date(pet.createdAt).toLocaleDateString()}
                      </p>
                      {pet.additionalInfo && (
                        <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded">
                          {pet.additionalInfo}
                        </p>
                      )}
                    </div>

                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        pet.reviewStatus === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : pet.reviewStatus === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {pet.reviewStatus === "REJECTED"
                        ? "❌ Rejected"
                        : pet.reviewStatus === "APPROVED"
                        ? "✅ Approved"
                        : "⏳ Pending Review"}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <form action={verifyPet.bind(null, pet.id, true)}>
                      <Button
                        type="submit"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </form>

                    <form action={verifyPet.bind(null, pet.id, false)}>
                      <Button type="submit" variant="destructive" size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
