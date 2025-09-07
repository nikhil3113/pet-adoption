"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { getOwnersPets } from "@/lib/actions/pets";
import { PetCard } from "@/components/pet/PetCards";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight, PawPrint } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MyPetsList({ initial }: { initial: { pets: any[]; total: number; page: number; totalPages: number; limit: number } }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { pets, total, page, totalPages, limit } = initial;

  const changePage = (newPage: number) => {
    startTransition(async () => {
      const data = await getOwnersPets({ page: newPage, limit });
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(newPage));
      url.searchParams.set("limit", String(limit));
      router.push(url.toString(), { scroll: false });

      // Optimistically replace DOM without extra state by reloading route data
      // If you prefer client state, you can lift state and manage it here.
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Pets</h1>
          <p className="text-slate-500">Manage and track the pets you’ve listed.</p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/pets/add">
            <Plus className="w-4 h-4 mr-2" />
            Add New Pet
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isPending ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-xl" />)
        ) : pets.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <PawPrint className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">You haven’t added any pets yet</h3>
            <p className="text-slate-500 mb-4">Start by creating a new listing so adopters can find your pet.</p>
            <Button asChild>
              <Link href="/pets/add">
                <Plus className="w-4 h-4 mr-2" />
                Add your first pet
              </Link>
            </Button>
          </div>
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pets.map((pet: any) => <PetCard key={pet.id} pet={pet} />)
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-500">Showing page {page} of {totalPages} • {total} total</p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(page - 1)}
              disabled={page <= 1 || isPending}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(page + 1)}
              disabled={page >= totalPages || isPending}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}