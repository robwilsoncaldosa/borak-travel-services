'use client'
import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { toast } from 'sonner';
import { Review } from '../types/review.types';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';
import { reviewApi } from '@/lib/backend_api/review';
=======
import { Button } from "@/components/ui/button";
>>>>>>> 06aca87b9193a0e04246468a493100e83db99073
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
<<<<<<< HEAD
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
=======
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Package } from '../types/package.types';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';
import { packageApi } from '@/lib/backend_api/package';
import { ImageUpload } from '@/components/cloudinary/ImageUpload';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const fetchPackages = async () => {
    try {
      const packages = await packageApi.getAllPackages();
      setPackages(packages);
    } catch (error) {
      toast.error('Error fetching packages');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      await packageApi.deletePackage(id);
      toast.success('Package deleted successfully');
      fetchPackages();
    } catch (error) {
      toast.error('Error deleting package');
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Travel Packages</h1>
        <Button onClick={() => {
          setSelectedPackage(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Package
        </Button>
      </div>

      <DataTable 
        columns={columns}
        data={packages}
        onEdit={(pkg) => {
          setSelectedPackage(pkg);
          setIsDialogOpen(true);
        }}
        onDelete={handleDelete}
      />

      <PackageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedPackage={selectedPackage}
        onSuccess={() => {
          setIsDialogOpen(false);
          fetchPackages();
        }}
      />
    </div>
  );
}

interface PackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPackage: Package | null;
  onSuccess: () => void;
}

function PackageDialog({ open, onOpenChange, selectedPackage, onSuccess }: PackageDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    duration_hours: '',
    about_tour: '',
    highlights: '',
    activities: '',
    inclusions: '',
    images: [] as string[],
  });

  useEffect(() => {
    if (selectedPackage) {
      setFormData({
        title: selectedPackage.title,
        location: selectedPackage.location,
        duration_hours: selectedPackage.duration_hours.toString(),
        about_tour: selectedPackage.about_tour,
        highlights: selectedPackage.highlights.join('\n'),
        activities: selectedPackage.activities.join('\n'),
        inclusions: selectedPackage.inclusions.join('\n'),
        images: selectedPackage.images,
      });
    } else {
      setFormData({
        title: '',
        location: '',
        duration_hours: '',
        about_tour: '',
        highlights: '',
        activities: '',
        inclusions: '',
        images: [],
      });
    }
  }, [selectedPackage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const packageData = {
      ...formData,
      duration_hours: parseInt(formData.duration_hours),
      highlights: formData.highlights.split('\n').filter(item => item.trim()),
      activities: formData.activities.split('\n').filter(item => item.trim()),
      inclusions: formData.inclusions.split('\n').filter(item => item.trim()),
      images: formData.images,
    };

    try {
      if (selectedPackage) {
        await packageApi.updatePackage(selectedPackage._id, packageData);
        toast.success('Package updated successfully');
      } else {
        await packageApi.createPackage(packageData);
        toast.success('Package created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error('Error saving package');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedPackage ? 'Edit Package' : 'Create New Package'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid  gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Duration (Hours)</label>
            <Input
              type="number"
              value={formData.duration_hours}
              onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">About Tour</label>
            <Textarea
              value={formData.about_tour}
              onChange={(e) => setFormData({ ...formData, about_tour: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Highlights (one per line)</label>
            <Textarea
              value={formData.highlights}
              onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Activities (one per line)</label>
            <Textarea
              value={formData.activities}
              onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Inclusions (one per line)</label>
            <Textarea
              value={formData.inclusions}
              onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <ImageUpload
              value={formData.images}
              onChange={(urls) => setFormData({ ...formData, images: urls })}
              disabled={false}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedPackage ? 'Update Package' : 'Create Package'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
>>>>>>> 06aca87b9193a0e04246468a493100e83db99073
}
