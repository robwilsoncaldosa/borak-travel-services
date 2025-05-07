'use client'
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Review } from '../types/review.types';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';
import { reviewApi } from '@/lib/backend_api/review';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from 'lucide-react';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchReviews = async () => {
        try {
            const reviews = await reviewApi.getAllReviews();
            setReviews(reviews);
        } catch (error) {
            toast.error('Error fetching reviews');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            await reviewApi.deleteReview(id);
            toast.success('Review deleted successfully');
            fetchReviews();
        } catch (error) {
            toast.error('Error deleting review');
            console.error(error);
        }
    };

    const handleEdit = (review: Review) => {
        setSelectedReview(review);
        setIsDialogOpen(true);
    };

    const handleStatusUpdate = async (status: 'accepted' | 'rejected') => {
        if (!selectedReview) return;

        try {
            await reviewApi.updateReview(selectedReview._id, {
                ...selectedReview,
                status,
            });
            toast.success(`Review ${status} successfully`);
            setIsDialogOpen(false);
            fetchReviews();
        } catch (error) {
            toast.error('Error updating review status');
            console.error(error);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Travel Reviews</h1>
            </div>

            <DataTable 
                columns={columns}
                data={reviews}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Review Details</DialogTitle>
                    </DialogHeader>
                    
                    {selectedReview && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium mb-2">Guest Name</h3>
                                <p className="text-gray-600">{selectedReview.guest_id}</p>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Rating</h3>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${
                                                i < selectedReview.rating
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                    <span className="text-sm text-gray-500 ml-2">
                                        {selectedReview.rating}/5
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Review</h3>
                                <Textarea
                                    value={selectedReview.review}
                                    readOnly
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Current Status</h3>
                                <p className={`font-medium ${
                                    selectedReview.status === 'accepted' 
                                        ? 'text-green-600' 
                                        : selectedReview.status === 'rejected'
                                        ? 'text-red-600'
                                        : 'text-yellow-600'
                                }`}>
                                    {selectedReview.status.charAt(0).toUpperCase() + selectedReview.status.slice(1)}
                                </p>
                            </div>

                            <DialogFooter className="gap-2">
                                {selectedReview.status === 'pending' && (
                                    <>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleStatusUpdate('rejected')}
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate('accepted')}
                                        >
                                            Display
                                        </Button>
                                    </>
                                )}
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
