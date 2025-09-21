import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function validatePetImage(
  imageUrl: string,
  expectedCategory: string
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
        Analyze this image and determine if it shows a ${expectedCategory}. 
        
        Please respond with ONLY a JSON object in this exact format:
        {
        "isValid": true/false,
        "detectedAnimal": "the animal you see in the image",
        "confidence": "high/medium/low",
        "reason": "brief explanation"
        }
        
        Rules:
        - If the image clearly shows a ${expectedCategory}, set isValid to true
        - If the image shows a different animal, set isValid to false
        - If you can't clearly identify an animal, set isValid to false
        - Be strict about matching the expected category
        `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: await imageToBase64(imageUrl),
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = result.response.text();

    const validation = JSON.parse(
      response.replace(/```json\n?/g, "").replace(/```/g, "")
    );

    return {
      isValid: validation.isValid,
      detectedAnimal: validation.detectedAnimal,
      confidence: validation.confidence,
      reason: validation.reason,
    };
  } catch (error) {
    console.log(error);
    return {
      isValid: true,
      detectedAnimal: "unknown",
      confidence: "low",
      reason: "Validation Service Unavailable",
    };
  }
}

async function imageToBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}
