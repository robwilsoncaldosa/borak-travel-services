'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface TermsModalProps {
    isOpen: boolean;
    onAccept: () => void;
}

export default function TermsModal({ isOpen, onAccept }: TermsModalProps) {
    const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

    const termsContent = {
        terms: {
            title: "Terms and Conditions",
            content: (
                <div className="space-y-4 md:space-y-6">
                    <section>
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">1. Acceptance of Terms</h3>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                            By accessing and using Borak Travel Services website and booking our travel services,
                            you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">2. Booking and Payment</h3>
                        <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                            <p>• All bookings are subject to availability and confirmation by Borak Travel Services.</p>
                            <p>• Payment is required at the time of booking unless otherwise specified.</p>
                            <p>• Prices are subject to change without notice until booking is confirmed.</p>
                            <p>• Additional fees may apply for special requests or modifications.</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">3. Cancellation and Refund Policy</h3>
                        <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                            <p>• Cancellations made 7+ days before travel: Full refund minus processing fee</p>
                            <p>• Cancellations made 3-6 days before travel: 50% refund</p>
                            <p>• Cancellations made 1-2 days before travel: 25% refund</p>
                            <p>• Same-day cancellations: No refund</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">4. Travel Insurance</h3>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                            We strongly recommend purchasing travel insurance. Borak Travel Services is not responsible
                            for any losses, damages, or expenses arising from unforeseen circumstances.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">5. Liability</h3>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                            Borak Travel Services acts as an intermediary between you and service providers.
                            Our liability is limited to the amount paid for our services.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">6. Force Majeure</h3>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                            We are not liable for any failure to perform due to circumstances beyond our control,
                            including but not limited to natural disasters, government actions, or pandemics.
                        </p>
                    </section>
                </div>
            )
        },
        privacy: {
            title: "Privacy Policy",
            content: (
                <div className="space-y-4 md:space-y-6">
                    <section>
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Information We Collect</h3>
                        <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                            <p>• Personal information (name, email, phone number, address)</p>
                            <p>• Payment information (processed securely through third-party providers)</p>
                            <p>• Travel preferences and special requirements</p>
                            <p>• Website usage data and cookies</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">How We Use Your Information</h3>
                        <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                            <p>• To process and manage your bookings</p>
                            <p>• To communicate with you about your travel arrangements</p>
                            <p>• To improve our services and website functionality</p>
                            <p>• To send promotional materials (with your consent)</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Information Sharing</h3>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                            We do not sell your personal information. We may share information with trusted partners
                            necessary to provide our services, such as hotels, transportation providers, and payment processors.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Data Security</h3>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                            We implement appropriate security measures to protect your personal information against
                            unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Your Rights</h3>
                        <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                            <p>• Access and review your personal information</p>
                            <p>• Request corrections to inaccurate information</p>
                            <p>• Request deletion of your personal information</p>
                            <p>• Opt-out of marketing communications</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Cookies</h3>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                            We use cookies to enhance your browsing experience and analyze website traffic.
                            You can control cookie settings through your browser preferences.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Contact Us</h3>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                            If you have questions about this Privacy Policy, please contact us at privacy@boraktravel.com
                            or through our website contact form.
                        </p>
                    </section>

                    <section>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </section>
                </div>
            )
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="w-[95vw] max-w-4xl h-[95dvh] md:max-h-[90dvh] p-0 flex flex-col">
                <DialogHeader className="p-3 md:p-6 pb-0 shrink-0">
                    <DialogTitle className="text-lg md:text-2xl font-bold text-center">
                        Welcome to Borak Travel Services
                    </DialogTitle>
                    <p className="text-center text-muted-foreground mt-1 md:mt-2 text-xs md:text-sm px-2">
                        Please review our Terms and Conditions and Privacy Policy before continuing
                    </p>
                </DialogHeader>

                <div className="px-3 md:px-6 shrink-0">
                    <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('terms')}
                            className={`flex-1 py-2 px-2 md:px-4 rounded-md text-xs md:text-sm font-medium transition-colors ${activeTab === 'terms'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span className="hidden sm:inline">Terms & Conditions</span>
                            <span className="sm:hidden">Terms</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`flex-1 py-2 px-2 md:px-4 rounded-md text-xs md:text-sm font-medium transition-colors ${activeTab === 'privacy'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span className="hidden sm:inline">Privacy Policy</span>
                            <span className="sm:hidden">Privacy</span>
                        </button>
                    </div>
                </div>

                <ScrollArea className="flex-1 px-3 md:px-6 min-h-0">
                    <div className="py-3 md:py-4">
                        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{termsContent[activeTab].title}</h2>
                        {termsContent[activeTab].content}
                    </div>
                </ScrollArea>

                <Separator className="shrink-0" />

                <DialogFooter className="p-3 md:p-6 pt-3 md:pt-4 shrink-0">
                    <div className="flex flex-col gap-3 w-full">
                        <p className="text-xs text-muted-foreground text-center md:text-left leading-relaxed">
                            By clicking "I Agree", you acknowledge that you have read and agree to both our Terms and Conditions and Privacy Policy.
                        </p>
                        <Button
                            onClick={onAccept}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto md:self-end px-6 md:px-8 py-2 md:py-3"
                            size="lg"
                        >
                            I Agree & Continue
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}