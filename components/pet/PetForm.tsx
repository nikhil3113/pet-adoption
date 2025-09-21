"use client";

import FormField from "@/components/FormField";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Form } from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import UploadImage from "../UploadImage";
import { useState } from "react";

interface PetFormData {
  name: string;
  age: number;
  gender: "male" | "female";
  vaccinated: boolean;
  categoryId: string;
  status: "available" | "found" | "missing" | "adopted";
  additionalInfo?: string;
  state: string;
  city: string;
  imageUrl: string;
}

interface PetFormProps {
  onSubmit: (data: PetFormData) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: (field: string, value: any) => void;
  imageUrl: string;
  form: UseFormReturn<PetFormData>;
  isUpdate: boolean;
  categories: { id: string; name: string }[];
}

export default function PetForm({
  onSubmit,
  setValue,
  imageUrl,
  form,
  isUpdate = false,
  categories,
}: PetFormProps) {
  const [imageValidation, setImageValidation] = useState<{
    isValid: boolean;
    detectedAnimal: string;
    confidence: string;
    reason: string;
    loading: boolean;
    error?: string;
  } | null>(null);

  async function validateImageClient(imageUrl: string, categoryName: string) {
    const res = await fetch("/api/pet/validate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, categoryName }),
    });
    if (!res.ok) throw new Error("Image validation failed");
    return res.json();
  }

  const selectedCategory = categories.find(
    (cat) => cat.id === form.watch("categoryId")
  )?.name;

  async function handleImageChange(url: string) {
    setValue("imageUrl", url);
    setImageValidation({
      isValid: false,
      detectedAnimal: "",
      confidence: "",
      reason: "",
      loading: true,
    });
    if (url && selectedCategory) {
      try {
        const result = await validateImageClient(url, selectedCategory);
        setImageValidation({ ...result, loading: false });
      } catch {
        setImageValidation({
          isValid: false,
          detectedAnimal: "",
          confidence: "",
          reason: "Validation failed",
          loading: false,
          error: "Validation failed",
        });
      }
    } else {
      setImageValidation(null);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-sky-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-2xl border-0 ring-1 ring-slate-200/60 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-slate-800 tracking-tight">
              {isUpdate ? "Update" : "Add"} a Pet
            </CardTitle>
            <CardDescription className="text-slate-500 text-base mt-1">
              Add details and a photo to help this pet find a home.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-semibold text-slate-700 mb-2">
                    Pet Details
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        name="name"
                        control={form.control}
                        label="Name"
                        placeholder="Bella"
                      />
                      <FormField
                        name="age"
                        control={form.control}
                        label="Age (years)"
                        type="number"
                        placeholder="2"
                      />
                      <FormField
                        name="gender"
                        control={form.control}
                        label="Gender"
                        type="select"
                        options={[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                        ]}
                        placeholder="Select gender"
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <FormField
                        name="vaccinated"
                        control={form.control}
                        label="Vaccinated"
                        type="checkbox"
                      />
                      <FormField
                        name="categoryId"
                        control={form.control}
                        label="Category"
                        type="select"
                        options={categories.map((cat) => ({
                          value: cat.id,
                          label:
                            cat.name.toUpperCase().charAt(0) +
                            cat.name.slice(1),
                        }))}
                        placeholder="Select category"
                      />
                      <FormField
                        name="status"
                        control={form.control}
                        label="Status"
                        type="select"
                        options={[
                          { value: "available", label: "Available" },
                          { value: "missing", label: "Missing" },
                        ]}
                        placeholder="Select status"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-700 mb-2">
                    Location
                  </h2>

                  <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField
                      name="state"
                      control={form.control}
                      label="State"
                      placeholder="State"
                    />
                    <FormField
                      name="city"
                      control={form.control}
                      label="City"
                      placeholder="City"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-700 mb-2">
                    Photo
                  </h2>
                  <UploadImage
                    value={imageUrl}
                    onChange={handleImageChange}
                    onRemove={() => {
                      setValue("imageUrl", "");
                      setImageValidation(null);
                    }}
                  />
                  {imageValidation?.loading && (
                    <div className="text-sm text-slate-500 mt-2">
                      Validating image...
                    </div>
                  )}
                  {imageValidation && !imageValidation.loading && (
                    <div
                      className={`mt-2 text-sm rounded px-3 py-2 ${
                        imageValidation.isValid
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {imageValidation.isValid ? (
                        <>
                          ✅ Image matches category (
                          {imageValidation.detectedAnimal}, confidence:{" "}
                          {imageValidation.confidence})
                        </>
                      ) : (
                        <>
                          ⚠️ Image may not match category.
                          <br />
                          Detected:{" "}
                          {imageValidation.detectedAnimal || "Unknown"}
                          <br />
                          Reason: {imageValidation.reason}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-700 mb-2">
                    Additional Info
                  </h2>
                  <FormField
                    name="additionalInfo"
                    control={form.control}
                    label="Notes"
                    type="textarea"
                    placeholder="Behavior, breed, medical notes..."
                  />
                </div>
                <div className="flex-1 flex items-end justify-end pt-2">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white px-8 py-2 rounded-lg shadow-lg font-semibold text-lg transition"
                    disabled={!!imageValidation && !imageValidation.isValid}
                  >
                    {isUpdate ? "Update Pet" : "Add Pet"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
