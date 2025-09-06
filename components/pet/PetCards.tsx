"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  PawPrint,
  Badge as BadgeIcon,
  ChevronRight,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PetCard({ pet }: { pet: any }) {
  const statusStyles = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "found":
        return "bg-sky-100 text-sky-700 border-sky-200";
      case "missing":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "adopted":
        return "bg-slate-200 text-slate-700 border-slate-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <Link href={`/pets/${pet.id}`} className="block">
      <Card className="group overflow-hidden rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:ring-1 hover:ring-emerald-200 transition">
        <CardHeader className="p-0 relative">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={pet.imageUrl}
              alt={pet.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute top-3 left-3 flex gap-2">
              <span
                className={`px-2.5 py-1 text-xs font-medium rounded-full border ${statusStyles(
                  pet.status
                )}`}
              >
                {pet.status}
              </span>
              {pet.category?.name ? (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full border bg-white/90 text-slate-700 border-slate-200 backdrop-blur">
                  {pet.category.name}
                </span>
              ) : null}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold text-slate-900">
              {pet.name}
            </CardTitle>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <BadgeIcon className="w-3.5 h-3.5" />
              <span className="capitalize">{pet.gender}</span>
            </span>
          </div>

          <div className="mt-1 text-slate-600 text-sm flex items-center gap-2">
            <PawPrint className="w-4 h-4 text-emerald-600" />
            <span>
              {pet.age} yr{pet.age === 1 ? "" : "s"}
            </span>
            <span className="text-slate-400">•</span>
            <span className="capitalize">{pet.category?.name}</span>
          </div>

          <div className="mt-2 text-slate-600 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span className="truncate">
              {pet.city}, {pet.state}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {pet.owner?.name ? `Owner: ${pet.owner.name}` : "\u00A0"}
            </div>
            <div className="inline-flex items-center text-emerald-700 text-sm font-medium group-hover:translate-x-0.5 transition-transform">
              View details
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
