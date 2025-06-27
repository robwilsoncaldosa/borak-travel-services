'use client'
import { useState } from 'react';
import { MdLocationOn, MdPhone, MdEmail, MdAccessTime } from 'react-icons/md';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobileNumber: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Create mailto link with form data
        const subject = encodeURIComponent('Contact Form Submission');
        const body = encodeURIComponent(
            `Name: ${formData.fullName}\n` +
            `Email: ${formData.email}\n` +
            `Mobile: ${formData.mobileNumber}\n` +
            `Message: ${formData.message}`
        );
        
        const mailtoLink = `mailto:borak@gmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
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

                <div className="bg-white backdrop-blur-sm rounded-lg  shadow-xl w-full max-w-6xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row ">
                        {/* Left Side - Contact Information */}
                        <div className="w-full lg:w-[35%] bg-[#2E2E2E] text-white p-8 lg:p-12 space-y-8">
                            <h2 className="text-[25px] font-bold mb-8 text-center md:text-center lg:text-left">Contact Information</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 text-center md:text-center lg:text-left">Address</h3>
                                    <div className="flex items-center gap-5 justify-center md:justify-center lg:justify-start">
                                        <MdLocationOn className="text-3xl" />
                                        <div>
                                            <p className="text-center md:text-center lg:text-left">123 Business Street, City</p>
                                            {/* <p>City, Country</p> */}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 text-center md:text-center lg:text-left">Phone</h3>
                                    <div className="flex items-center gap-5 justify-center md:justify-center lg:justify-start">
                                        <MdPhone className="text-3xl" />
                                        <div>
                                            <p className="text-center md:text-center lg:text-left">+1 234 567 890</p>
                                            <p className="text-center md:text-center lg:text-left">+1 234 567 890</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 text-center md:text-center lg:text-left">Email</h3>
                                    <div className="flex items-center gap-5 justify-center md:justify-center lg:justify-start">
                                        <MdEmail className="text-3xl" />
                                        <p className="text-center md:text-center lg:text-left">borak@gmail.com</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 text-center md:text-center lg:text-left">Business Hours</h3>
                                    <div className="flex items-center gap-5 justify-center md:justify-center lg:justify-start">
                                        <MdAccessTime className="text-3xl" />
                                        <div>
                                            <p className="text-center md:text-center lg:text-left">Mon - Fri: 9:00 AM - 5:00 PM</p>
                                            <p className="text-center md:text-center lg:text-left">Weekend: Closed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Contact Form */}
                        <div className="w-full lg:w-[65%] p-8">
                            <h2 className="text-3xl font-bold mb-6 mt-4">Write to Us</h2>
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
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-2 border-2 border-gray-400 rounded-[5px] focus:border-blue-500 focus:ring-blue-500"
                                            required
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
                                            value={formData.mobileNumber}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-2 border-2 border-gray-400 rounded-[5px] focus:border-blue-500 focus:ring-blue-500"
                                            required
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
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full p-2 border-2 border-gray-400 rounded-[5px] focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="mt-1 block w-full p-2 border-2 border-gray-400 rounded-[5px] focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-[150px] bg-[#2E2E2E] text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
