import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Package } from "../../types/package.types";

export const columns: ColumnDef<Package>[] = [
  {
    accessorKey: "images",
    header: "Images",
    cell: ({ row }) => {
      const images = row.original.images;
      return images.length > 0 ? (
        <img src={images[0]} alt="Package Image" width={40} height={40} className="rounded-md" />
      ) : null;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "duration_hours",
    header: "Duration (Hours)",
  },
  {
    accessorKey: "highlights",
    header: "Highlights",
    cell: ({ row }) => {
      const highlights = row.original.highlights;
      return (
        <ul className="list-disc list-inside">
          {highlights.slice(0, 2).map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
          {highlights.length > 2 && <li>...</li>}
        </ul>
      );
    },
  },
  {
    accessorKey: "activities",
    header: "Activities",
    cell: ({ row }) => {
      const activities = row.original.activities;
      return (
        <ul className="list-disc list-inside">
          {activities.slice(0, 2).map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
          {activities.length > 2 && <li>...</li>}
        </ul>
      );
    },
  },
  {
    accessorKey: "inclusions",
    header: "Inclusions",
    cell: ({ row }) => {
      const inclusions = row.original.inclusions;
      return (
        <ul className="list-disc list-inside">
          {inclusions.slice(0, 2).map((inclusions, index) => (
            <li key={index}>{inclusions}</li>
          ))}
          {inclusions.length > 2 && <li>...</li>}
        </ul>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const pkg = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const meta = table.options.meta as { openEdit: (pkg: Package) => void };
              meta.openEdit(pkg);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              const meta = table.options.meta as { onDelete: (id: string) => void };
              meta.onDelete(pkg._id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
]; 