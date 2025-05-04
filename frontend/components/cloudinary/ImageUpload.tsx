import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';

interface ImageUploadProps {
  value: string[];
  disabled?: boolean;
  onChange: (value: string[]) => void;
}

export const ImageUpload = ({
  value,
  disabled,
  onChange
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const files = e.target.files;

      if (!files) return;

      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'first-cloudinary');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/ddhtkysyk/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...value, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const onRemove = (url: string) => {
    const filteredImages = value.filter((image) => image !== url);
    onChange(filteredImages);
  };

  return (
    <div className="mb-4 space-y-4">
      <div className="flex items-center justify-center gap-4 w-full">
        <Button
          type="button"
          variant="secondary"
          disabled={disabled || isUploading}
          onClick={() => document.getElementById('imageUpload')?.click()}
          className="bg-gradient-to-r from-gray-500 to-gray-600 p-7 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg transition-all duration-200"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          multiple
          disabled={disabled || isUploading}
          onChange={onUpload}
          className="hidden"
        />
        {isUploading && (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-sm text-muted-foreground">Uploading...</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-3 lg:grid-cols-4">
        {value.map((url) => (
          <div key={url} className="relative group aspect-video rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => onRemove(url)}
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={url}
              alt="Upload"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              fill
            />
          </div>
        ))}
      </div>
    </div>
  );
}; 