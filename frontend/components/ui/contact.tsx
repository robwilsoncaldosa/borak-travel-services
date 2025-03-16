'use client'
import { useState } from 'react';
import Image from 'next/image';
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
        // Handle form submission logic here
        console.log(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen w-full relative">
            <div className="h-[600px] w-full absolute inset-0">
                <Image
                    src={'/contactbg.jpg'}
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <div className="relative z-10 flex flex-col justify-center items-center min-h-screen pt-[160px] pb-[50px]">
                <div className="text-center mb-[100px] max-w-[1100px] mx-auto">
                    <h1 className="text-7xl font-extrabold tracking-wider drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                        Get In Touch</h1>
                    <p className="pt-2 text-[18px] font-medium tracking-wider drop-shadow-lg text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                        Have questions about our tours, need expert travel advice, or ready to book your next adventure? Reach out to us today, and our team will help you create the perfect travel experience tailored just for you.</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-6xl flex overflow-hidden">
                    {/* Left Side - Contact Information (30%) */}
                    <div className="w-[35%] bg-[#2E2E2E] text-white p-12 space-y-8">
                        <h2 className="text-[25px] font-bold mb-8">Contact Information</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Address</h3>
                                <div className="flex items-center gap-5">
                                    <MdLocationOn className="text-3xl" />
                                    <div>
                                        <p>123 Business Street, City</p>
                                        {/* <p>City, Country</p> */}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Phone</h3>
                                <div className="flex items-center gap-5">
                                    <MdPhone className="text-3xl " />
                                    <div>
                                        <p>+1 234 567 890</p>
                                        <p>+1 234 567 890</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Email</h3>
                                <div className="flex items-center gap-5">
                                    <MdEmail className="text-3xl " />
                                    <p>borak@gmail.com</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
                                <div className="flex items-center gap-5">
                                    <MdAccessTime className="text-3xl " />
                                    <div>
                                        <p>Mon - Fri: 9:00 AM - 5:00 PM</p>
                                        <p>Weekend: Closed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Contact Form (70%) */}
                    <div className="w-[70%] p-8">
                        <h2 className="text-3xl font-bold mb-6 mt-4">Write to Us</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                        Full Name <span className='text-[#FF0000]'>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full  p-2 border-2 border-gray-400  rounded-[5px]  focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                                        Mobile Number <span className='text-[#FF0000]'>*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        className="mt-1 block w-full  p-2 border-2 border-gray-400  rounded-[5px]  focus:border-blue-500 focus:ring-blue-500"
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
                                    className="mt-1 block w-full  p-2 border-2 border-gray-400  rounded-[5px]  focus:border-blue-500 focus:ring-blue-500"
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
                                    className="mt-1 block w-full  p-2 border-2 border-gray-400  rounded-[5px]  focus:border-blue-500 focus:ring-blue-500"
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
    );
};

export default ContactPage;
