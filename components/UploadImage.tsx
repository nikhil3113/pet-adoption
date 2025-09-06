"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Button } from "./ui/button";
import { Upload, X } from "lucide-react";
import { useState } from "react";

interface UploadImageProps {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
}

function getCloudinaryPublicId(url: string): string {
  try {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return "";
    let publicIdWithVersionAndExt = url.substring(uploadIndex + 8);
    publicIdWithVersionAndExt = publicIdWithVersionAndExt.replace(
      /^v\d+\//,
      ""
    );
    publicIdWithVersionAndExt = publicIdWithVersionAndExt.split(/[?#]/)[0];
    const extIndex = publicIdWithVersionAndExt.lastIndexOf(".");
    return extIndex !== -1
      ? publicIdWithVersionAndExt.slice(0, extIndex)
      : publicIdWithVersionAndExt;
  } catch (error) {
    console.error("Error extracting Cloudinary public ID:", error);
    return "";
  }
}

export default function UploadImage({
  value,
  onChange,
  onRemove,
}: UploadImageProps) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    if (!value) return;
    setRemoving(true);
    const publicId = getCloudinaryPublicId(value);
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });
      onChange("");
      onRemove && onRemove();
    } catch (err) {
      console.error("Error removing image:", err);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors bg-slate-50/50">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={(result) => {
          if (result.info && typeof result.info !== "string") {
            const uploadedUrl = result.info.secure_url;
            onChange(uploadedUrl);
          }
        }}
        options={{
          singleUploadAutoClose: true,
          multiple: false,
          maxFiles: 1,
        }}
      >
        {({ open }) => (
          <div className="space-y-4">
            {value ? (
              <div className="space-y-4">
                <div className="relative">
                  <Image
                    src={value}
                    alt="Uploaded preview"
                    className="w-full h-48 object-cover rounded-lg border"
                    width={400}
                    height={200}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    className="absolute top-3 right-3 rounded-full w-8 h-8 p-0 shadow-lg"
                    onClick={handleRemove}
                    disabled={removing}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="gap-2">
                  <Button
                    type="button"
                    onClick={() => open()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change Image
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full flex items-center justify-center"
                    onClick={handleRemove}
                    disabled={removing}
                  >
                    <X className="w-4 h-4 mr-2" />
                    {removing ? "Removing..." : "Remove"}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <Button
                  type="button"
                  onClick={() => open()}
                  variant="outline"
                  className="mb-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Pet Image
                </Button>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
}
