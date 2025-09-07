import { getOwnersPets } from "@/lib/actions/pets";
import { authOptions } from "@/lib/auth";
import { AuthOptions, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { MyPetsList } from "@/components/pet/MyPetList";

export default async function MyPets({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session || !session.user?.id) {
    redirect("/auth/signin");
  }

  const params = (await searchParams) ?? {};
  const page = parseInt((params.page as string) || "1", 10);
  const limit = parseInt((params.limit as string) || "9", 10);

  const data = await getOwnersPets({ page, limit });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <MyPetsList initial={data} />
    </div>
  );
}
