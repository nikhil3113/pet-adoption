"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import z from "zod";
import PetForm from "@/components/pet/PetForm";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { updatePet } from "@/lib/actions/pets";

const PetSchema = z.object({
  name: z.string().min(1).max(100),
  age: z.number().min(0).max(100),
  gender: z.enum(["male", "female"]),
  vaccinated: z.boolean(),
  additionalInfo: z.string().max(500).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  status: z.enum(["missing", "adopted", "found", "available"]),
  categoryId: z.string().min(1).max(100),
  imageUrl: z.string(),
});

export default function UpdatePetPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useAuthRedirect();

  const form = useForm<z.infer<typeof PetSchema>>({
    resolver: zodResolver(PetSchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: "male",
      vaccinated: false,
      additionalInfo: "",
      city: "",
      state: "",
      status: "available",
      categoryId: "",
      imageUrl: "",
    },
  });

  const imageUrl = form.watch("imageUrl");

  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesRes = await fetch("/api/categories");
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);

        const petRes = await fetch(`/api/pet/${id}`);
        if (!petRes.ok) {
          if (petRes.status === 403) {
            setError("You don't have permission to update this pet.");
          } else {
            setError("Pet not found.");
          }
          return;
        }
        const pet = await petRes.json();

        form.reset({
          name: pet.name,
          age: pet.age,
          gender: pet.gender,
          vaccinated: pet.vaccinated,
          additionalInfo: pet.additionalInfo || "",
          city: pet.city,
          state: pet.state,
          status: pet.status.toLowerCase(),
          categoryId: pet.categoryId,
          imageUrl: pet.imageUrl,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id, form]);

  async function onSubmit(values: z.infer<typeof PetSchema>) {
    try {
      const result = await updatePet(id, values);
      if (result.success) {
        router.push(`/pets/${id}`);
      } else {
        alert(result.message || "Failed to update pet.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update pet.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-sky-50 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-sky-50 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push("/pets")}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Back to Pets
          </button>
        </div>
      </div>
    );
  }

  return (
    <PetForm
      form={form}
      imageUrl={imageUrl}
      isUpdate={true}
      onSubmit={onSubmit}
      categories={categories}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue={(field: string, value: any) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        form.setValue(field as any, value, { shouldValidate: true })
      }
    />
  );
}
