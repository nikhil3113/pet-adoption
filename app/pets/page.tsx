import { getPets } from "@/lib/actions/pets";
import { prisma } from "@/lib/prisma";
import { PetsList } from "@/components/pet/PetsList";

export default async function PetsPage({
  searchParams,
}: {
  searchParams?: Record<string, string>;
}) {
  const categories = await prisma.categories.findMany({
    orderBy: { name: "asc" },
  });
  const filters = {
    categoryId: searchParams?.categoryId,
    state: searchParams?.state,
    city: searchParams?.city,
  };
  const pets = await getPets(filters);

  return (
    <div className="mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Adoptable Pets</h1>
      <p className="text-slate-500 mb-6">
        Browse and filter pets looking for a loving home.
      </p>
      <PetsList
        categories={categories}
        initialPets={pets}
        initialFilters={filters}
      />
    </div>
  );
}
