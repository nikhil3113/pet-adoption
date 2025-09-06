"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Filter, Check } from "lucide-react";

export function PetFilter({
  categories,
  onFilter,
  initial,
}: {
  categories: { id: string; name: string }[];
  onFilter: (filters: {
    categoryId?: string;
    state?: string;
    city?: string;
  }) => void;
  initial?: { categoryId?: string; state?: string; city?: string };
}) {
  const [categoryId, setCategoryId] = useState(initial?.categoryId || "all");
  const [state, setState] = useState(initial?.state || "");
  const [city, setCity] = useState(initial?.city || "");
  const [open, setOpen] = useState(false);

  function applyFilters() {
    onFilter({
      categoryId: categoryId === "all" ? undefined : categoryId,
      state: state || undefined,
      city: city || undefined,
    });
    setOpen(false);
  }

  function clearFilters() {
    setCategoryId("all");
    setState("");
    setCity("");
    onFilter({});
  }

  return (
    <div>
      <Button
        type="button"
        variant="ghost"
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 border border-slate-200 mb-2"
        onClick={() => setOpen(true)}
      >
        <Filter className="w-5 h-5 text-emerald-600" />
        <span className="hidden md:inline text-sm font-medium text-slate-700">
          Filters
        </span>
      </Button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-2">
              <span>Filter Pets</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Narrow down results by category, state or city.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              applyFilters();
            }}
            className="mt-4 flex flex-col gap-4"
          >
            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Pet type
              </label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name.toUpperCase().charAt(0) + cat.name.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Search by State
              </label>
              <Input
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Search by City
              </label>
              <Input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <DialogFooter className="mt-2 flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={clearFilters}
                className="text-sm text-slate-600"
              >
                Clear all
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Apply
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
