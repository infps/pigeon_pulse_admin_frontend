"use client";

import { RaceItem, Basket } from "@/lib/types";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { useListBaskets, useUpdateRaceItemBasket } from "@/lib/api/races";
import { LoadingSpinner } from "./loading-spinner";
import { ErrorState } from "./error-state";

interface EditRaceItemBasketDialogProps {
  raceItem: RaceItem;
  raceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EditRaceItemBasketDialog({
  raceItem,
  raceId,
  isOpen,
  onClose,
}: EditRaceItemBasketDialogProps) {
  const [loftBasketId, setLoftBasketId] = useState<string>(
    raceItem.distBasket?.idBasket.toString() || "none"
  );
  const [raceBasketId, setRaceBasketId] = useState<string>(
    raceItem.raceBasket?.idBasket.toString() || "none"
  );
  const [basketedBird, setBasketedBird] = useState(Boolean(raceItem.isDistBasketted));

  const { data, error, isPending: isLoadingBaskets } = useListBaskets(parseInt(raceId));
  const { mutate, isPending } = useUpdateRaceItemBasket(parseInt(raceId), raceItem.idRaceItem);

  const baskets: Basket[] = data?.data || [];
  const loftBaskets = baskets.filter((b) => !b.isRaceBasket);
  const raceBaskets = baskets.filter((b) => b.isRaceBasket);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mutate) return;

    mutate(
      {
        loftBasketId: loftBasketId === "none" ? null : parseInt(loftBasketId),
        raceBasketId: raceBasketId === "none" ? null : parseInt(raceBasketId),
        loftBasketed: basketedBird ? 1 : 0,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (isLoadingBaskets) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <ErrorState message={error?.message || "Failed to load baskets"} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Basket Assignment</DialogTitle>
          <DialogDescription>
            Assign {raceItem.inventoryItem?.bird?.birdName || "Bird"} to baskets
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Loft Basket */}
            <div className="grid gap-2">
              <Label htmlFor="loft-basket">Loft Basket</Label>
              <Select value={loftBasketId} onValueChange={setLoftBasketId}>
                <SelectTrigger id="loft-basket" className="w-full">
                  <SelectValue placeholder="Select loft basket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {loftBaskets.map((basket) => {
                    const itemCount = basket._count?.distBasketItems || 0;
                    const capacity = basket.capacity || 0;
                    const isFull = itemCount >= capacity;
                    const basketIdStr = basket.idBasket.toString();
                    return (
                      <SelectItem
                        key={basket.idBasket}
                        value={basketIdStr}
                        disabled={isFull && basketIdStr !== loftBasketId}
                      >
                        Basket #{basket.basketNo} ({itemCount}/
                        {capacity})
                        {isFull && basketIdStr !== loftBasketId ? " - Full" : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Basketed Bird Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="basketed-bird"
                checked={basketedBird}
                onCheckedChange={(checked) =>
                  setBasketedBird(checked as boolean)
                }
              />
              <Label
                htmlFor="basketed-bird"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Basketed bird
              </Label>
            </div>

            {/* Race Basket */}
            <div className="grid gap-2">
              <Label htmlFor="race-basket">Race Basket</Label>
              <Select value={raceBasketId} onValueChange={setRaceBasketId}>
                <SelectTrigger id="race-basket" className="w-full">
                  <SelectValue placeholder="Select race basket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {raceBaskets.map((basket) => {
                    const itemCount = basket._count?.raceBasketItems || 0;
                    const capacity = basket.capacity || 0;
                    const isFull = itemCount >= capacity;
                    const basketIdStr = basket.idBasket.toString();
                    return (
                      <SelectItem
                        key={basket.idBasket}
                        value={basketIdStr}
                        disabled={isFull && basketIdStr !== raceBasketId}
                      >
                        Basket #{basket.basketNo} ({itemCount}/
                        {capacity})
                        {isFull && basketIdStr !== raceBasketId ? " - Full" : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel (Esc)
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save (Enter)"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
