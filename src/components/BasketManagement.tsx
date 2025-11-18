"use client";

import { Basket } from "@/lib/types";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  useCreateBasket,
  useListBaskets,
  useUpdateBasket,
  useDeleteBasket,
} from "@/lib/api/races";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { LoadingSpinner } from "./loading-spinner";
import { ErrorState } from "./error-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface BasketManagementProps {
  raceId: string;
  isRaceBasket: boolean;
}

function CreateBasketDialog({
  raceId,
  isRaceBasket,
}: {
  raceId: string;
  isRaceBasket: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [basketNumber, setBasketNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const { mutate, isPending } = useCreateBasket(raceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mutate) return;
    mutate(
      {
        basketNumber: parseInt(basketNumber),
        capacity: parseInt(capacity),
        isRaceBasket,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setBasketNumber("");
          setCapacity("");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Basket
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create {isRaceBasket ? "Race" : "Loft"} Basket
          </DialogTitle>
          <DialogDescription>Add a new basket for this race.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="basketNumber">Basket Number</Label>
              <Input
                id="basketNumber"
                type="number"
                value={basketNumber}
                onChange={(e) => setBasketNumber(e.target.value)}
                required
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditBasketDialog({
  basket,
  raceId,
}: {
  basket: Basket;
  raceId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [basketNumber, setBasketNumber] = useState(
    basket.basketNumber.toString()
  );
  const [capacity, setCapacity] = useState(basket.capacity.toString());
  const { mutate, isPending } = useUpdateBasket(raceId, basket.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mutate) return;
    mutate(
      {
          basketNumber: parseInt(basketNumber),
          capacity: parseInt(capacity),
      },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Basket</DialogTitle>
          <DialogDescription>
            Update basket #{basket.basketNumber} details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-basketNumber">Basket Number</Label>
              <Input
                id="edit-basketNumber"
                type="number"
                value={basketNumber}
                onChange={(e) => setBasketNumber(e.target.value)}
                required
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-capacity">Capacity</Label>
              <Input
                id="edit-capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteBasketDialog({
  basket,
  raceId,
}: {
  basket: Basket;
  raceId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useDeleteBasket(raceId, basket.id);

  const handleDelete = () => {
    if (!mutate) return;
    mutate(
      {},
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Button size="icon" variant="ghost" onClick={() => setIsOpen(true)}>
        <Trash2 className="h-4 w-4" />
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Basket</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete basket #{basket.basketNumber}? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function BasketCard({ basket, raceId }: { basket: Basket; raceId: string }) {
  const itemCount = basket.isRaceBasket
    ? basket._count?.raceBasketItems || 0
    : basket._count?.loftBasketItems || 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Basket #{basket.basketNumber}</span>
          <div className="flex gap-2">
            <EditBasketDialog basket={basket} raceId={raceId} />
            <DeleteBasketDialog basket={basket} raceId={raceId} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Capacity:</span>
            <span className="font-medium">{basket.capacity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Items:</span>
            <span className="font-medium">
              {itemCount} / {basket.capacity}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span
              className={`font-medium ${
                itemCount >= basket.capacity ? "text-red-600" : "text-green-600"
              }`}
            >
              {itemCount >= basket.capacity ? "Full" : "Available"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BasketManagement({
  raceId,
  isRaceBasket,
}: BasketManagementProps) {
  const { data, error, isPending, isError } = useListBaskets(raceId);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <ErrorState message={error?.message || "Failed to load baskets"} />;
  }

  const baskets: Basket[] = data?.data || [];
  const filteredBaskets = baskets.filter(
    (basket) => basket.isRaceBasket === isRaceBasket
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {isRaceBasket ? "Race Baskets" : "Loft Baskets"}
        </h3>
        <CreateBasketDialog raceId={raceId} isRaceBasket={isRaceBasket} />
      </div>

      {filteredBaskets.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">
              No {isRaceBasket ? "race" : "loft"} baskets created yet
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredBaskets.map((basket) => (
            <BasketCard key={basket.id} basket={basket} raceId={raceId} />
          ))}
        </div>
      )}
    </div>
  );
}
