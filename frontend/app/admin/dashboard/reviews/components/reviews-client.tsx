'use client'
import React, { useState, useCallback } from 'react';
import { Review } from '@/lib/backend_api/review';
import { columns } from '../_components/columns';
import { DataTable } from '../_components/data-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, RefreshCw, Save } from 'lucide-react';
import { useReviewsCache } from '@/hooks/useAdminCache';

interface ReviewsClientProps {
  initialReviews: Review[];
}

export default function ReviewsClient({ initialReviews }: ReviewsClientProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    guest_id: '',
    package_id: '',
    review: '',
    rating: 5,
    status: 'pending'
  });

  const {
    data: reviews = [],
    isLoading,
    refreshData,
    updateReview,
    deleteReview,
    isUpdating,
  } = useReviewsCache(initialReviews);

  const handleEdit = useCallback((review: Review) => {
    setSelectedReview(review);
    setEditForm({
      guest_id: review.guest_id,
      package_id: review.package_id,
      review: review.review,
      rating: review.rating,
      status: review.status
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  }, []);



  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await deleteReview(id);
    }
  }, [deleteReview]);

  const handleSave = useCallback(async () => {
    if (!selectedReview) return;

    try {
      await updateReview({
        id: selectedReview._id,
        data: {
          guest_id: editForm.guest_id,
          package_id: editForm.package_id,
          review: editForm.review,
          rating: editForm.rating,
          status: editForm.status
        }
      });
      setIsDialogOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  }, [selectedReview, editForm, updateReview]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    if (selectedReview) {
      setEditForm({
        guest_id: selectedReview.guest_id,
        package_id: selectedReview.package_id,
        review: selectedReview.review,
        rating: selectedReview.rating,
        status: selectedReview.status
      });
    }
  }, [selectedReview]);

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${interactive ? 'cursor-pointer' : ''} ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        onClick={interactive ? () => setEditForm(prev => ({ ...prev, rating: i + 1 })) : undefined}
      />
    ));
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <Button
          variant="outline"
          onClick={refreshData}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Review' : 'Review Details'}
            </DialogTitle>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="guest_id">Customer</Label>
                {isEditing ? (
                  <Input
                    id="guest_id"
                    value={editForm.guest_id}
                    onChange={(e) => setEditForm(prev => ({ ...prev, guest_id: e.target.value }))}
                  />
                ) : (
                  <p className="mt-1">{selectedReview.guest_id}</p>
                )}
              </div>

              <div>
                <Label htmlFor="package_id">Package</Label>
                {isEditing ? (
                  <Input
                    id="package_id"
                    value={editForm.package_id}
                    onChange={(e) => setEditForm(prev => ({ ...prev, package_id: e.target.value }))}
                  />
                ) : (
                  <p className="mt-1">{selectedReview.package_id}</p>
                )}
              </div>

              <div>
                <Label htmlFor="rating">Rating</Label>
                {isEditing ? (
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(editForm.rating, true)}
                    <span className="ml-2 text-sm text-gray-600">
                      ({editForm.rating}/5)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(selectedReview.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      ({selectedReview.rating}/5)
                    </span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                {isEditing ? (
                  <Select
                    value={editForm.status}
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 capitalize">{selectedReview.status}</p>
                )}
              </div>

              <div>
                <Label htmlFor="review">Review</Label>
                {isEditing ? (
                  <Textarea
                    id="review"
                    value={editForm.review}
                    onChange={(e) => setEditForm(prev => ({ ...prev, review: e.target.value }))}
                    rows={4}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap mt-1">
                    {selectedReview.review}
                  </p>
                )}
              </div>

              <div>
                <Label>Date</Label>
                <p className="mt-1">{new Date(selectedReview.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isUpdating}>
                  <Save className="mr-2 h-4 w-4" />
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => setIsEditing(true)}>
                  Edit Review
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}