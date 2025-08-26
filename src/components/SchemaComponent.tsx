import { useState } from "react";
import { FeeSchema, PrizeSchema } from "@/lib/types";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import SchemaForm from "./SchemaForm";

export default function SchemaComponent({
  schema,
  type,
}: {
  schema: FeeSchema | PrizeSchema;
  type: "fee" | "prize";
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="p-4 border rounded mb-4 hover:bg-primary/10 cursor-pointer">
          <h2 className="text-xl font-semibold">{schema.name}</h2>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-full">
        <SchemaForm 
          type={type} 
          action="update" 
          id={schema.id} 
          onClose={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
