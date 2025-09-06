"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mail, User, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function PetOwnerCard({
  owner,
}: {
  owner: { id: string; name: string; email: string; phoneNumber: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();

  return (
    <Card className="border-0 ring-1 ring-slate-200/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Owner</CardTitle>
        <CardDescription>Contact the owner for more details</CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-800 font-medium">
              {owner.name || "Owner"}
            </div>
            {status === "authenticated" ? (
              <div>
                <div className="text-sm text-slate-500">
                  {owner.email || "Not provided"}
                </div>
                <div className="text-sm text-slate-500">
                  {owner.phoneNumber || "Not provided"}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {status === "authenticated" ? (
          <div className="flex gap-2">
            {owner.email ? (
              <a
                href={`mailto:${owner.email}`}
                className="inline-flex items-center gap-2 rounded-md bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-700 transition"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            ) : null}
            {owner.phoneNumber ? (
              <a
                href={`tel:${owner.phoneNumber}`}
                className="inline-flex items-center gap-2 rounded-md bg-sky-600 text-white px-4 py-2 text-sm font-medium hover:bg-sky-700 transition"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
            ) : null}
          </div>
        ) : (
          <Link href={"/auth/signin"} className="text-sm text-slate-500">
            Login to contact the owner
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
