import PetHeader from "./PetHeader";
import PetGallery from "./PetGallery";
import PetMeta from "./PetMeta";
import PetOwnerCard from "./PetOwnerCard";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

type PetDetailsProps = {
  pet: {
    id: string;
    name: string;
    age: number;
    gender: "male" | "female";
    vaccinated: boolean;
    additionalInfo?: string;
    city: string;
    state: string;
    status: "available" | "found" | "missing" | "adopted";
    imageUrl: string;
    category: { id: string; name: string };
    owner: { id: string; name: string; email: string; phoneNumber: string };
    createdAt?: string;
  };
};

export default function PetDetails({ pet }: PetDetailsProps) {
  return (
    <div className="space-y-8">
      <PetHeader
        name={pet.name}
        category={pet.category.name}
        status={pet.status}
        location={{ city: pet.city, state: pet.state }}
        createdAt={pet.createdAt}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PetGallery imageUrl={pet.imageUrl} name={pet.name} />
        </div>

        <div className="space-y-6">
          <Card className=" border-0 ring-1 ring-slate-200/60">
            <CardContent className="p-6">
              <PetMeta
                age={pet.age}
                gender={pet.gender}
                vaccinated={pet.vaccinated}
                location={{ city: pet.city, state: pet.state }}
                category={pet.category.name}
                status={pet.status}
              />
              {pet.additionalInfo ? (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-base font-semibold text-slate-700 mb-2">
                      About {pet.name}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {pet.additionalInfo}
                    </p>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>

          <PetOwnerCard owner={pet.owner} />
        </div>
      </div>
    </div>
  );
}
