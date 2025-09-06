"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PetForm from "@/components/pet/PetForm";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";

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

export default function AddPets() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

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
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  async function onSubmit(values: z.infer<typeof PetSchema>) {
    try {
      const res = await fetch("/api/pet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }
      router.push("/pets");
    } catch (error) {
      console.error(error);
      alert("Failed to add pet");
    }
  }

  return (
    <PetForm
      form={form}
      imageUrl={imageUrl}
      isUpdate={false}
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
