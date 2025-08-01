import { instance } from '../axios';

export interface ContactFormData {
    fullName: string;
    email: string;
    mobileNumber: string;
    message?: string;
}

export interface ContactResponse {
    success: boolean;
    message: string;
}

export const mailerApi = {
    // Send contact form email
    sendContactEmail: async (formData: ContactFormData): Promise<ContactResponse> => {
        try {
            const response = await instance.post<ContactResponse>('/api/email/contact', formData);
            return response.data;
        } catch (error: any) {
            console.error('Error sending contact email:', error);
            
            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                return {
                    success: false,
                    message: error.response.data?.message || 'Failed to send message. Please try again.'
                };
            } else if (error.request) {
                // Network error
                return {
                    success: false,
                    message: 'Network error. Please check your connection and try again.'
                };
            } else {
                // Other error
                return {
                    success: false,
                    message: 'An unexpected error occurred. Please try again.'
                };
            }
        }
    },
};
