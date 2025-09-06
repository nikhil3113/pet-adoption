import { CheckCircle2, Syringe } from "lucide-react";

export default function PetMeta({
  age,
  gender,
  vaccinated,
  location,
  category,
  status,
}: {
  age: number;
  gender: "male" | "female";
  vaccinated: boolean;
  location: { city: string; state: string };
  category: string;
  status: "available" | "found" | "missing" | "adopted";
}) {
  const items = [
    { label: "Age", value: `${age} year${age === 1 ? "" : "s"}` },
    { label: "Gender", value: gender === "male" ? "Male" : "Female" },
    {
      label: "Vaccinated",
      value: vaccinated ? "Yes" : "No",
      icon: <Syringe className="w-4 h-4" />,
    },
    { label: "Category", value: category },
    { label: "Status", value: status },
    { label: "Location", value: `${location.city}, ${location.state}` },
  ];

  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((it) => (
        <div
          key={it.label}
          className={
            it.label === "Location"
              ? "col-span-1 sm:col-span-2 rounded-lg border border-slate-200 p-3 bg-white/60"
              : "rounded-lg border border-slate-200 p-3 bg-white/60"
          }
        >
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            {it.label}
          </dt>
          <dd className="mt-1 text-slate-800 font-medium flex items-center gap-2">
            {it.icon ? (
              it.icon
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            )}
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}