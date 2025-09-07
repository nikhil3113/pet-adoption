"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function ZoomImage({
  src,
  alt,
  zoom = 2,
  lensSize = 160,
}: {
  src: string;
  alt: string;
  zoom?: number;
  lensSize?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) setDims({ w: rect.width, h: rect.height });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const updatePosition = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
    setPos({ x, y });
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full h-[420px] bg-slate-100 overflow-hidden cursor-pointer"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onMouseMove={(e) => updatePosition(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          setHovering(true);
          const t = e.touches[0];
          updatePosition(t.clientX, t.clientY);
        }}
        onTouchMove={(e) => {
          const t = e.touches[0];
          updatePosition(t.clientX, t.clientY);
        }}
        onTouchEnd={() => setHovering(false)}
        onClick={() => setOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover select-none"
          draggable={false}
        />

        {hovering ? (
          <div
            className="pointer-events-none absolute rounded-full border-2 border-white shadow-lg"
            style={{
              width: lensSize,
              height: lensSize,
              left: pos.x - lensSize / 2,
              top: pos.y - lensSize / 2,
              backgroundImage: `url(${src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${dims.w * zoom}px ${dims.h * zoom}px`,
              backgroundPosition: `${-(pos.x * zoom - lensSize / 2)}px ${-(
                pos.y * zoom -
                lensSize / 2
              )}px`,
            }}
          />
        ) : null}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-full h-full max-h-screen p-0">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <div className="relative w-full h-full min-h-[400px]">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
