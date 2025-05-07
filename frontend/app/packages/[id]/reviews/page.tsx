'use client'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { reviewApi } from '@/lib/backend_api/review';
import { packageApi } from '@/lib/backend_api/package';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from 'lucide-react';

export default function AddReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [packageData, setPackageData] = useState<any>(null);
  const [formData, setFormData] = useState({
    guest_id: '',
    rating: '',
    review: '',
  });

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const data = await packageApi.getPackageById(params.id as string);
        setPackageData(data);
      } catch (error) {
        toast.error('Error fetching package details');
        console.error(error);
      }
    };

    fetchPackage();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const reviewData = {
      ...formData,
      package_id: params.id as string,
      rating: parseInt(formData.rating),
      status: 'pending',
    };

    try {
      await reviewApi.createReview(reviewData);
      toast.success('Review submitted successfully');
      router.push(`/packages/${params.id}`);
    } catch (error) {
      toast.error('Error submitting review');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!packageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-40">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center border-b pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Write a Review for {packageData.title}
              </CardTitle>
              <p className="text-gray-500 mt-2">
                Share your experience with this travel package
              </p>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <Input
                    value={formData.guest_id}
                    onChange={(e) => setFormData({ ...formData, guest_id: e.target.value })}
                    required
                    className="w-full"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          onClick={() => setFormData({ ...formData, rating: (i + 1).toString() })}
                          className={`w-5 h-5 cursor-pointer ${
                            i < parseInt(formData.rating || '0')
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formData.rating ? `${formData.rating}/5` : 'Select rating'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Your Review
                  </label>
                  <Textarea
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    required
                    rows={4}
                    className="w-full resize-none"
                    placeholder="Share your experience with this travel package..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.back()}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="px-6 bg-primary hover:bg-primary/90"
                    onClick={() => {
                      if (!isLoading) {
                        toast.success('Your review has been submitted successfully');
                        router.back();
                      }
                    }}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </div>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 