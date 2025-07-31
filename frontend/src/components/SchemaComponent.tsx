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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-4 border rounded mb-4 hover:bg-primary/10">
          <h2 className="text-xl font-semibold">{schema.name}</h2>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-full">
        <SchemaForm type={type} action="update" id={schema.id} />
      </DialogContent>
    </Dialog>
  );
}
