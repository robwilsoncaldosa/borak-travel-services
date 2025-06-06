import { useState, forwardRef, useImperativeHandle } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

interface ChatImageUploadProps {
  onImageUpload: (urls: string[]) => void;
  disabled?: boolean;
}

export interface ChatImageUploadRef {
  clearPreviews: () => void;
}

export const ChatImageUpload = forwardRef<ChatImageUploadRef, ChatImageUploadProps>(({
  onImageUpload,
  disabled
}, ref) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useImperativeHandle(ref, () => ({
    clearPreviews: () => {
      setPreviewUrls([]);
      onImageUpload([]);
    }
  }));

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
      const newUrls = [...previewUrls, ...uploadedUrls];
      setPreviewUrls(newUrls);
      onImageUpload(newUrls);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const onRemove = (index: number) => {
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newUrls);
    onImageUpload(newUrls);
  };

  return (
    <div className="relative">
      {previewUrls.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 rounded-lg shadow-lg border border-gray-200">
          <div className="grid grid-cols-4 gap-x-[50px] gap-y-[10px] ps-3 p-2">
            {previewUrls.map((url, index) => (
              <div key={url} className="relative w-[40px] h-[40px] rounded-md overflow-hidden group">
                <Image
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  className="object-cover"
                  sizes="(max-width: 90vw) 90vw, 80vw"
                  fill
                />
                <button
                  onClick={() => onRemove(index)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        type="button"
        disabled={disabled || isUploading}
        onClick={() => document.getElementById('chatImageUpload')?.click()}
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
      >
        {isUploading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent" />
        ) : (
          <ImageIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
      <input
        id="chatImageUpload"
        type="file"
        accept="image/*"
        multiple
        disabled={disabled || isUploading}
        onChange={onUpload}
        className="hidden"
      />
    </div>
  );
}); 