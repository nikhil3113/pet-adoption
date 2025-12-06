import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PetCard } from "@/components/pet/PetCards";
import {
  PawPrint,
  ShieldCheck,
  HeartHandshake,
  MapPin,
  Sparkles,
  Send,
} from "lucide-react";

export default async function Home() {
  const latest = await prisma.pet.findMany({
    where: { isVerified: true },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  const categories = await prisma.categories.findMany({
    orderBy: { name: "asc" },
    take: 6,
  });

  const petsForCards = latest.map((p) => ({
    id: p.id,
    name: p.name,
    age: p.age,
    gender: p.gender === "male" || p.gender === "female" ? p.gender : "male",
    imageUrl: p.imageUrl,
    city: p.city,
    state: p.state,
    status: (typeof (p.status as unknown as string) === "string"
      ? (p.status as unknown as string).toLowerCase()
      : "available") as "available" | "found" | "missing" | "adopted",
    category: { name: p.category?.name ?? "Pet" },
    owner: { name: p.owner?.name ?? "" },
  }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-white to-sky-50" />
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 ring-1 ring-slate-200 px-3 py-1 text-sm text-slate-600">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Trusted, community‑driven pet adoption
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Find your new best friend
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Browse pets near you and give them a loving home. List your pet
              for adoption and reach caring adopters.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/pets"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-white font-medium shadow hover:bg-emerald-700 transition"
              >
                Browse pets
              </Link>
              <Link
                href="/pets/add"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-5 py-3 text-slate-700 font-medium hover:bg-white shadow-sm transition"
              >
                List a pet
              </Link>
            </div>
            <div className="mt-6 text-sm text-slate-500">
              Safe, transparent, and easy to use.
            </div>
          </div>
        </div>
      </section>

      {/* Browse by type */}
      <section className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Browse by type
          </h2>
          {categories.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  prefetch={true}
                  href={`/pets?categoryId=${encodeURIComponent(c.id)}`}
                  className="group rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow transition p-4 flex items-center justify-center text-slate-700 font-medium"
                >
                  <PawPrint className="w-4 h-4 text-emerald-600 mr-2" />
                  <span className="capitalize group-hover:text-emerald-700">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-slate-500">
              No categories available right now.
            </div>
          )}
        </div>
      </section>

      {/* Why adopt with us */}
      <section className="bg-gradient-to-b from-white to-emerald-50/40">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Why adopt with us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <h3 className="mt-3 font-semibold text-slate-900">
                Safe & verified
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Listings are reviewed and owners can be contacted securely.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <MapPin className="w-6 h-6 text-emerald-600" />
              <h3 className="mt-3 font-semibold text-slate-900">
                Local discovery
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Find pets in your city and nearby areas with intuitive filters.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <HeartHandshake className="w-6 h-6 text-emerald-600" />
              <h3 className="mt-3 font-semibold text-slate-900">
                Community first
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Built for responsible adoption with transparent information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest pets */}
      <section className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Latest arrivals
            </h2>
            <Link
              prefetch={true}
              href="/pets"
              className="text-emerald-700 hover:text-emerald-800 font-medium"
            >
              View all →
            </Link>
          </div>

          {petsForCards.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              No pets yet. Be the first to{" "}
              <Link
                href="/pets/add"
                prefetch={true}
                className="text-emerald-700 font-medium"
              >
                add a pet
              </Link>
              .
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {petsForCards.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            How it works
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <li className="rounded-2xl border border-slate-200 p-6">
              <span className="text-xs font-semibold text-emerald-700">
                Step 1
              </span>
              <h3 className="mt-2 font-semibold text-slate-900">Browse pets</h3>
              <p className="mt-1 text-sm text-slate-600">
                Use filters to find pets by type, city, and more.
              </p>
            </li>
            <li className="rounded-2xl border border-slate-200 p-6">
              <span className="text-xs font-semibold text-emerald-700">
                Step 2
              </span>
              <h3 className="mt-2 font-semibold text-slate-900">
                Connect with owner
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Message owners to learn more and plan a visit.
              </p>
            </li>
            <li className="rounded-2xl border border-slate-200 p-6">
              <span className="text-xs font-semibold text-emerald-700">
                Step 3
              </span>
              <h3 className="mt-2 font-semibold text-slate-900">
                Adopt responsibly
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Complete adoption with care and provide a loving home.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-600 to-sky-600" />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-white text-2xl font-bold">
                Ready to make a difference?
              </h3>
              <p className="text-emerald-50/90">
                List a pet for adoption or explore pets near you now.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/pets/add"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-emerald-700 shadow hover:bg-emerald-50"
              >
                <Send className="w-4 h-4" />
                List a pet
              </Link>
              <Link
                href="/pets"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white shadow hover:bg-emerald-800"
              >
                Browse pets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ (SSR-friendly with native details/summary) */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            <details className="group rounded-xl border border-slate-200 p-4">
              <summary className="cursor-pointer list-none font-medium text-slate-800">
                Is adopting a pet free?
              </summary>
              <p className="mt-2 text-sm text-slate-600">
                Adoption is community-driven. Some owners may request a small
                fee to cover care or vaccination costs.
              </p>
            </details>
            <details className="group rounded-xl border border-slate-200 p-4">
              <summary className="cursor-pointer list-none font-medium text-slate-800">
                How do I contact a pet owner?
              </summary>
              <p className="mt-2 text-sm text-slate-600">
                Open a pet’s page and, if signed in, use the provided email or
                phone to get in touch.
              </p>
            </details>
            <details className="group rounded-xl border border-slate-200 p-4">
              <summary className="cursor-pointer list-none font-medium text-slate-800">
                Can I list my pet for adoption?
              </summary>
              <p className="mt-2 text-sm text-slate-600">
                Yes. Create an account and list your pet with photos and
                details. We recommend including vaccination info.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
