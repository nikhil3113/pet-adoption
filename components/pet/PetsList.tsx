"use client";

import { useState, useTransition } from "react";
import { PetFilter } from "@/components/pet/PetFilter";
import { PetCard } from "@/components/pet/PetCards";
import { getPets } from "@/lib/actions/pets";
import { Search } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function PetsList({
  categories,
  initialPets,
  initialFilters,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialPets: any[];
  initialFilters: { categoryId?: string; state?: string; city?: string };
}) {
  const [pets, setPets] = useState(initialPets);
  const [filters, setFilters] = useState(initialFilters);
  const [isPending, startTransition] = useTransition();

  const handleFilter = (newFilters: typeof filters) => {
    setFilters(newFilters);
    startTransition(async () => {
      const pets = await getPets(newFilters);
      setPets(pets);
    });
  };

  return (
    <div>
      <div className="flex justify-end items-center">
        <PetFilter
          categories={categories}
          onFilter={handleFilter}
          initial={filters}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {isPending ? (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-80 w-full rounded-xl mb-6" />
            ))}
          </>
        ) : pets.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No pets found
            </h3>
            <p className="text-slate-500 text-center max-w-md">
              Try adjusting your filters or check back later for new listings.
            </p>
            <button
              onClick={() => handleFilter({})}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pets.map((pet: any) => <PetCard key={pet.id} pet={pet} />)
        )}
      </div>
    </div>
  );
}
