// Helper function to validate and format image URL
export const getValidImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) return '/Landing.jpg';

    try {
        new URL(imageUrl);
        return imageUrl;
    } catch {
        if (imageUrl.startsWith('/')) {
            return imageUrl;
        }
        return `/uploads/${imageUrl}`;
    }
};