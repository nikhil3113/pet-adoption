import { validatePetImage } from "@/lib/gemini";

export async function POST(req: Request) {
  const { imageUrl, categoryName } = await req.json();
  if (!imageUrl || !categoryName) {
    return new Response(JSON.stringify({ error: "Missing data" }), {
      status: 400,
    });
  }
  const result = await validatePetImage(imageUrl, categoryName);
  return new Response(JSON.stringify(result), { status: 200 });
}
