'use client'
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, RefreshCw } from 'lucide-react';
import { Package } from '@/lib/backend_api/package';
import { columns } from '../_components/columns';
import { DataTable } from '../_components/data-table';
import { ImageUpload } from '@/components/cloudinary/ImageUpload';
import { usePackagesCache } from '@/hooks/useAdminCache';

interface PackagesClientProps {
    initialPackages: Package[];
}

export default function PackagesClient({ initialPackages }: PackagesClientProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

    const {
        data: packages = [],
        isLoading,
        refreshData,
        createPackage,
        updatePackage,
        deletePackage,
        isCreating,
        isUpdating,
    } = usePackagesCache(initialPackages);

    const handleEdit = useCallback((pkg: Package) => {
        setSelectedPackage(pkg);
        setIsDialogOpen(true);
    }, []);

    const handleDelete = useCallback(async (id: string) => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            await deletePackage(id);
        }
    }, [deletePackage]);

    const handleAdd = useCallback(() => {
        setSelectedPackage(null);
        setIsDialogOpen(true);
    }, []);

    const handleSuccess = useCallback(() => {
        setIsDialogOpen(false);
        setSelectedPackage(null);
    }, []);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Packages</h1>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={refreshData}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button onClick={handleAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Package
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={packages}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <PackageDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                selectedPackage={selectedPackage}
                onSuccess={handleSuccess}
                createPackage={createPackage}
                updatePackage={updatePackage}
                isCreating={isCreating}
                isUpdating={isUpdating}
            />
        </div>
    );
}

interface PackageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedPackage: Package | null;
    onSuccess: () => void;
    createPackage: (data: any) => Promise<Package>;
    updatePackage: (params: { id: string; data: any }) => Promise<Package>;
    isCreating: boolean;
    isUpdating: boolean;
}

function PackageDialog({
    open,
    onOpenChange,
    selectedPackage,
    onSuccess,
    createPackage,
    updatePackage,
    isCreating,
    isUpdating
}: PackageDialogProps) {
    const [formData, setFormData] = useState({
        title: '',
        about_tour: '',
        duration_hours: '',
        location: '',
        images: [] as string[],
        inclusions: [] as string[],
        highlights: [] as string[],
        activities: [] as string[],
        itinerary: [] as Array<{ time: string; activity: string }>,
    });

    React.useEffect(() => {
        if (selectedPackage) {
            setFormData({
                title: selectedPackage.title || '',
                about_tour: selectedPackage.about_tour || '',
                duration_hours: selectedPackage.duration_hours?.toString() || '',
                location: selectedPackage.location || '',
                images: selectedPackage.images || [],
                inclusions: selectedPackage.inclusions || [],
                highlights: selectedPackage.highlights || [],
                activities: selectedPackage.activities || [],
                itinerary: selectedPackage.itinerary || [],
            });
        } else {
            setFormData({
                title: '',
                about_tour: '',
                duration_hours: '',
                location: '',
                images: [],
                inclusions: [],
                highlights: [],
                activities: [],
                itinerary: [],
            });
        }
    }, [selectedPackage, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const packageData = {
                ...formData,
                duration_hours: parseInt(formData.duration_hours),
            };

            if (selectedPackage) {
                await updatePackage({ id: selectedPackage._id, data: packageData });
            } else {
                await createPackage(packageData);
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving package:', error);
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {selectedPackage ? 'Edit Package' : 'Add New Package'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">About Tour</label>
                        <Textarea
                            value={formData.about_tour}
                            onChange={(e) => setFormData({ ...formData, about_tour: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Duration (hours)</label>
                            <Input
                                type="number"
                                value={formData.duration_hours}
                                onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Images</label>
                        <ImageUpload
                            value={formData.images}
                            onChange={(images) => setFormData({ ...formData, images })}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    {selectedPackage ? 'Updating...' : 'Creating...'}
                                </div>
                            ) : (
                                selectedPackage ? 'Update Package' : 'Create Package'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}