import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";

function statusVariant(status: string) {
  switch (status) {
    case "available":
      return "bg-emerald-100 text-emerald-700";
    case "found":
      return "bg-sky-100 text-sky-700";
    case "missing":
      return "bg-amber-100 text-amber-700";
    case "adopted":
      return "bg-slate-200 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function PetHeader({
  name,
  category,
  status,
  location,
  createdAt,
}: {
  name: string;
  category: string;
  status: "available" | "found" | "missing" | "adopted";
  location: { city: string; state: string };
  createdAt?: string;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div>
        <div className="flex items-center gap-3">
          <Link href={"/pets"} className="text-slate-500 hover:text-slate-700">
            <ArrowLeft />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            {name}
          </h1>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          <Badge className={statusVariant(status)}>{status}</Badge>
          <span className="text-slate-500">•</span>
          <Badge variant="outline" className="border-slate-300 text-slate-700">
            {category}
          </Badge>
          <span className="text-slate-500">•</span>
          <span className="inline-flex items-center gap-1 text-slate-600">
            <MapPin className="w-4 h-4" />
            {location.city}, {location.state}
          </span>
        </div>
      </div>
      {createdAt ? (
        <div className="text-sm text-slate-500 inline-flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          Listed on {new Date(createdAt).toLocaleDateString()}
        </div>
      ) : null}
    </div>
  );
}
