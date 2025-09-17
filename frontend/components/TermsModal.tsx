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
                <div className="space-y-6">
                    <section>
                        <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            By accessing and using Borak Travel Services website and booking our travel services,
                            you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-3">2. Booking and Payment</h3>
                        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                            <p>• All bookings are subject to availability and confirmation by Borak Travel Services.</p>
                            <p>• Payment is required at the time of booking unless otherwise specified.</p>
                            <p>• Prices are subject to change without notice until booking is confirmed.</p>
                            <p>• Additional fees may apply for special requests or modifications.</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-3">3. Cancellation and Refund Policy</h3>
                        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                            <p>• Cancellations made 7+ days before travel: Full refund minus processing fee</p>
                            <p>• Cancellations made 3-6 days before travel: 50% refund</p>
                            <p>• Cancellations made less than 3 days before travel: No refund</p>
                            <p>• Weather-related cancellations: Full refund or rescheduling option</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-3">4. Travel Requirements</h3>
                        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                            <p>• Valid identification is required for all travelers</p>
                            <p>• Travelers must meet health and fitness requirements for selected activities</p>
                            <p>• Age restrictions may apply to certain tours and activities</p>
                            <p>• Travel insurance is recommended but not mandatory</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-3">5. Liability and Responsibility</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Borak Travel Services acts as an intermediary between travelers and service providers.
                            We are not liable for any injury, damage, loss, accident, delay, or irregularity that
                            may occur during your travel. Travelers participate in all activities at their own risk.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-3">6. Force Majeure</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We are not responsible for any failure to perform our obligations due to circumstances
                            beyond our reasonable control, including but not limited to natural disasters,
                            government actions, strikes, or other unforeseeable events.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-3">7. Modifications to Terms</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Borak Travel Services reserves the right to modify these terms at any time.
                            Continued use of our services constitutes acceptance of any changes.
                        </p>
                    </section>
                </div>
            )
        },
        privacy: {
            title: "Privacy Policy",
            content: (
                <div className="space-y-6">
                    <section>
                        <h3 className="text-lg font-semibold mb-3">1. Information We Collect</h3>
                        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                            <p><strong>Personal Information:</strong> Name, email address, phone number, address, and payment information</p>
                            <p><strong>Travel Information:</strong> Travel preferences, special requirements, and booking history</p>
                            <p><strong>Technical Information:</strong> IP address, browser type, device information, and usage data</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-3">2. How We Use Your Information</h3>
                        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                            <p>• Process and manage your bookings and payments</p>
                            <p>• Communicate with you about your travel arrangements</p>
                            <p>• Provide customer support and respond to inquiries</p>
                            <p>• Send promotional materials and travel updates (with consent)</p>
                            <p>• Improve our services and website functionality</p>
                            <p>• Comply with legal obligations and prevent fraud</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-3">3. Information Sharing</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We do not sell, trade, or rent your personal information to third parties.
                            We may share your information with trusted service providers who assist us in
                            operating our business, conducting transactions, or servicing you, provided
                            they agree to keep this information confidential.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-3">4. Data Security</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We implement appropriate security measures to protect your personal information
                            against unauthorized access, alteration, disclosure, or destruction. However,
                            no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-3">5. Cookies and Tracking</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Our website uses cookies to enhance your browsing experience, analyze site traffic,
                            and personalize content. You can control cookie settings through your browser preferences.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-3">6. Your Rights</h3>
                        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                            <p>• Access and review your personal information</p>
                            <p>• Request corrections to inaccurate information</p>
                            <p>• Request deletion of your personal information</p>
                            <p>• Opt-out of marketing communications</p>
                            <p>• Data portability (where applicable)</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-3">7. Contact Information</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            For questions about this Privacy Policy or to exercise your rights,
                            please contact us at privacy@boraktravelservices.com or through our website contact form.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-3">8. Policy Updates</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We may update this Privacy Policy periodically. We will notify you of any
                            material changes by posting the new policy on our website with an updated effective date.
                        </p>
                    </section>
                </div>
            )
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Welcome to Borak Travel Services
                    </DialogTitle>
                    <p className="text-center text-muted-foreground mt-2">
                        Please review our Terms and Conditions and Privacy Policy before continuing
                    </p>
                </DialogHeader>

                <div className="px-6">
                    <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('terms')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'terms'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Terms & Conditions
                        </button>
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'privacy'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Privacy Policy
                        </button>
                    </div>
                </div>

                <ScrollArea className="flex-1 px-6 max-h-[50vh]">
                    <div className="py-4">
                        <h2 className="text-xl font-bold mb-4">{termsContent[activeTab].title}</h2>
                        {termsContent[activeTab].content}
                    </div>
                </ScrollArea>

                <Separator />

                <DialogFooter className="p-6 pt-4">
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <p className="text-xs text-muted-foreground flex-1 self-center">
                            By clicking "I Agree", you acknowledge that you have read and agree to both our Terms and Conditions and Privacy Policy.
                        </p>
                        <Button
                            onClick={onAccept}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                        >
                            I Agree & Continue
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}