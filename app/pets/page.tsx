import { getPets } from "@/lib/actions/pets";
import { prisma } from "@/lib/prisma";
import { PetsList } from "@/components/pet/PetsList";

export default async function PetsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const categories = await prisma.categories.findMany({
    orderBy: { name: "asc" },
  });

  const params = await searchParams;
  const page = parseInt((params.page as string) || "1", 10);
  const limit = parseInt((params.limit as string) || "10", 10);

  const filters = {
    categoryId: params.categoryId as string,
    state: params.state as string,
    city: params.city as string,
    page,
    limit,
  };

  const { pets, total, totalPages } = await getPets(filters);

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
        total={total}
        totalPages={totalPages}
        currentPage={page}
        limit={limit}
      />
    </div>
  );
}
