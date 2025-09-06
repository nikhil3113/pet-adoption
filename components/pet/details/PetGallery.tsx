import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function PetGallery({
  imageUrl,
  name,
}: {
  imageUrl: string;
  name: string;
}) {
  return (
    <Card className="shadow-xl border-0 overflow-hidden ring-1 ring-slate-200/60">
      <CardContent className="p-0">
        <div className="relative w-full h-[420px] bg-slate-100">
          <Image
            src={imageUrl}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}