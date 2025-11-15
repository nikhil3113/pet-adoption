import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  Calendar,
  PawPrint,
  Settings,
  Plus,
  Heart,
  MapPin,
  Pen,
} from "lucide-react";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions as AuthOptions);

  if (!session || !session.user?.id) {
    redirect("/auth/signin");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      createdAt: true,
    },
  });

  // Fetch user's pets count and recent pets
  const [userPets, totalPets] = await Promise.all([
    prisma.pet.findMany({
      where: { ownerId: session.user.id },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.pet.count({
      where: { ownerId: session.user.id },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
          <p className="text-slate-600">Manage your account and pet listings</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 ring-1 ring-slate-200/60">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {dbUser?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900 mt-4">
                  {dbUser?.name || "User"}
                </CardTitle>
                <p className="text-slate-500 text-sm">Pet Parent</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm">{dbUser?.email}</span>
                </div>
                {dbUser?.phoneNumber && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm">{dbUser?.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm">
                    Joined{" "}
                    {new Date(
                      dbUser?.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/profile/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-sm border-0 ring-1 ring-slate-200/60">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <PawPrint className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {totalPets}
                  </h3>
                  <p className="text-slate-500 text-sm">Pets Listed</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0 ring-1 ring-slate-200/60">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {userPets.filter((p) => p.status === "ADOPTED").length}
                  </h3>
                  <p className="text-slate-500 text-sm">Adopted</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0 ring-1 ring-slate-200/60">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {userPets.filter((p) => p.status === "AVAILABLE").length}
                  </h3>
                  <p className="text-slate-500 text-sm">Available</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="shadow-sm border-0 ring-1 ring-slate-200/60">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg h-12"
                  >
                    <Link href="/pets/add">
                      <Plus className="w-5 h-5 mr-2" />
                      Add New Pet
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-12">
                    <Link href="/profile/my-pets">
                      <PawPrint className="w-5 h-5 mr-2" />
                      Manage My Pets
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Pets */}
            <Card className="shadow-sm border-0 ring-1 ring-slate-200/60">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Pets</CardTitle>
                {totalPets > 3 && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/profile/my-pets">View All</Link>
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {userPets.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                      <PawPrint className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      No pets listed yet
                    </h3>
                    <p className="text-slate-500 mb-4">
                      Start by adding your first pet for adoption.
                    </p>
                    <Button asChild>
                      <Link href="/pets/add">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Pet
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {userPets.map((pet) => (
                      <div
                        key={pet.id}
                        className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <Link href={`/pets/${pet.id}`} className="group block">
                          <Image
                            src={pet.imageUrl}
                            alt={pet.name}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                            width={400}
                            height={128}
                          />
                          <div className="pt-3 px-3">
                            <h4 className="font-medium text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {pet.name}
                            </h4>
                            <p className="text-sm text-slate-500">
                              {pet.category.name} • {pet.age} year
                              {pet.age !== 1 ? "s" : ""} old
                            </p>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                                pet.status === "AVAILABLE"
                                  ? "bg-green-100 text-green-800"
                                  : pet.status === "ADOPTED"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {pet.status.toLowerCase()}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                                pet.isVerified
                                  ? "text-emerald-500"
                                  : "text-rose-500"
                              }`}
                            >
                              {pet.reviewStatus}
                            </span>
                          </div>
                        </Link>
                        <div className="px-3 pb-3 flex justify-end items-end">
                          <Link
                            href={`/pets/update/${pet.id}`}
                            className="mt-2 inline-block"
                          >
                            <Pen width={20} className="text-emerald-500" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
