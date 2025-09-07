import { Card, CardContent } from "@/components/ui/card";
import ZoomImage from "./ZoomImage";

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
        <ZoomImage src={imageUrl} alt={name} zoom={1.5} lensSize={180} />
      </CardContent>
    </Card>
  );
}