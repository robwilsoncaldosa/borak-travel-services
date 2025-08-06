'use client'
import { useState } from 'react';
import { mailerApi, ContactFormData } from '../../lib/backend_api/mailerapi';
import { Button } from './button';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobileNumber: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: '' });

        // Show immediate feedback
        setSubmitStatus({
            type: 'success',
            message: 'Sending your message...'
        });

        try {
            const result = await mailerApi.sendContactEmail(formData as ContactFormData);

            if (result.success) {
                setSubmitStatus({
                    type: 'success',
                    message: result.message || 'Message sent successfully! You will receive a confirmation email shortly.'
                });
                // Reset form on success
                setFormData({
                    fullName: '',
                    email: '',
                    mobileNumber: '',
                    message: '',
                });
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: result.message || 'Failed to send message. Please try again.'
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus({
                type: 'error',
                message: 'Network error. Please check your connection and try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="w-full relative">

            <div className="relative z-10 flex flex-col justify-center items-center pb-[50px] px-[50px] md:px-[50px] lg:px-[70px] xl:px-0">

                <div className="bg-white backdrop-blur-sm rounded-lg  shadow-xl w-full max-w-5xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row ">
                        {/* Left Side - Contact Information */}


                        {/* Right Side - Contact Form */}
                        <div className="w-full p-8 pt-10">
                            {/* <h2 className="text-3xl font-bold mb-6 mt-4">Write to Us</h2> */}

                            {/* Status Messages */}
                            {submitStatus.type && (
                                <div className={`mb-4 p-3 rounded-md ${submitStatus.type === 'success'
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-red-100 text-red-700 border border-red-300'
                                    }`}>
                                    {submitStatus.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                            Full Name <span className='text-[#FF0000]'>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            placeholder='Enter your full name...'
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-2 border-2 border-gray-200 rounded-[5px] focus:border-gray-500 focus:ring-gray-500"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                                            Mobile Number <span className='text-[#FF0000]'>*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="mobileNumber"
                                            name="mobileNumber"
                                            placeholder='Enter your mobile number...'
                                            value={formData.mobileNumber}
                                            onChange={e => {
                                                // Allow only digits, max 11, must start with 0
                                                let value = e.target.value.replace(/\D/g, '');
                                                if (value.length > 0 && value[0] !== '0') value = '0' + value.slice(0, 10);
                                                if (value.length > 11) value = value.slice(0, 11);
                                                setFormData({ ...formData, mobileNumber: value });
                                            }}
                                            pattern="0\d{10}"
                                            maxLength={11}
                                            minLength={11}
                                            className="mt-1 block w-full p-2 border-2 border-gray-200 rounded-[5px] focus:border-gray-500 focus:ring-gray-500"
                                            required
                                            disabled={isSubmitting}
                                            inputMode="numeric"
                                            autoComplete="tel"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email Address <span className='text-[#FF0000]'>*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder='Enter your email address...'
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full p-2 border-2 border-gray-200 rounded-[5px] focus:border-gray-500 focus:ring-gray-500"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder='Enter your message...'
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="mt-1 block w-full p-2 border-2 border-gray-200 rounded-[5px] focus:border-gray-500 focus:ring-gray-500"
                                        disabled={isSubmitting}
                                    />
                                </div>


                                <   Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 transition-colors duration-200 ${isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#2E2E2E] hover:bg-gray-700'
                                        } text-white`}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactPage;