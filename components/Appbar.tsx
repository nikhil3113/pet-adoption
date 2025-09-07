import Link from "next/link";
import { PawPrint, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function Appbar() {
  const session = await getServerSession(authOptions as AuthOptions);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition">
            <PawPrint className="w-6 h-6 text-emerald-600" />
          </span>
          <span className="ml-2 text-xl font-bold text-slate-800 tracking-tight group-hover:text-emerald-700 transition">
            PetAdopt
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Link
            href="/pets"
            className="text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-md font-medium transition"
          >
            Browse Pets
          </Link>
          <Link
            href="/pets/add"
            className="text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-md font-medium transition"
          >
            Add Pet
          </Link>
          {session && (
            <Link
              href="/profile/my-pets"
              className="text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-md font-medium transition"
            >
              My Pets
            </Link>
          )}
        </div>

        {/* Auth/Profile */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <span className="hidden sm:inline text-slate-700 font-medium mr-2">
                Hi, {session.user?.name?.split(" ")[0] || "User"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                asChild
              >
                <Link href="/profile">
                  <UserCircle className="w-7 h-7 text-emerald-600" />
                </Link>
              </Button>
              <form action="/api/auth/signout" method="POST">
                <Button
                  variant="outline"
                  size="sm"
                  type="submit"
                  className="ml-2"
                >
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <Link href="/api/auth/signin">
              <Button variant="default" size="sm" className="ml-2">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
