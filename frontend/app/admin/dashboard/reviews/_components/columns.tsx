import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Review } from "../../types/review.types";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Review>[] = [
  {
    accessorKey: "guest_id",
    header: "Guest Name",
  },
  {
    accessorKey: "package_id",
    header: "Package",
  },
  {
    accessorKey: "review",
    header: "Review",
    cell: ({ row }) => {
      const review = row.original.review;
      return (
        <div className="max-w-[300px] truncate">
          {review}
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.original.rating;
      return (
        <div className="flex items-center">
          <span className="mr-2">{rating}/5</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === 'accepted'
              ? 'default'
              : status === 'rejected'
              ? 'destructive'
              : 'secondary'
          }
          className={
            status === 'accepted'
              ? 'bg-green-500 hover:bg-green-600'
              : status === 'rejected'
              ? 'bg-red-500 hover:bg-red-600'
              : ''
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const review = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const meta = table.options.meta as { openEdit: (review: Review) => void };
              meta.openEdit(review);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              const meta = table.options.meta as { onDelete: (id: string) => void };
              meta.onDelete(review._id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
]; 