import Image from 'next/image';
import AnimatedSection from '../../_components/animated-section';
import ScrollToPackagesButton from '../scroll-to-packages-button';

export default function HeroSection() {
    return (
        <section className="relative h-[100dvh] w-full">
            <Image
                src={'/package-landing-page.jpg'}
                alt='Explore Packages'
                fill
                className='object-cover object-center'
                priority
                quality={100}
            />
            {/* Enhanced Overlay with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60 z-10" />

            {/* Centered Content with Animations */}
            <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 sm:px-6">
                <div className="text-center max-w-5xl mx-auto space-y-6 sm:space-y-8">
                    <AnimatedSection type="initial" direction="up">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-4 sm:mb-6"
                            style={{
                                fontFamily: '"Playfair Display", serif',
                                textShadow: '3px 3px 12px rgba(0,0,0,0.8)',
                                letterSpacing: '0.02em'
                            }}>
                            Discover Paradise
                        </h1>
                    </AnimatedSection>

                    <AnimatedSection type="initial" direction="up" delay={0.3}>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/95 mb-6"
                            style={{
                                fontFamily: '"Poppins", sans-serif',
                                textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                                fontWeight: '600'
                            }}>
                            Handpicked Premium Cebu Experiences
                        </h2>
                    </AnimatedSection>

                    <AnimatedSection type="initial" direction="up" delay={0.6}>
                        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed"
                            style={{
                                fontFamily: '"Poppins", sans-serif',
                                textShadow: '1px 1px 6px rgba(0,0,0,0.6)',
                                fontWeight: '400'
                            }}>
                            We believe in quality over quantity. Each adventure is carefully curated and personally tested
                            to ensure you experience only the finest that Cebu has to offer.
                        </p>
                    </AnimatedSection>

                    <AnimatedSection type="initial" direction="up" delay={0.9}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <ScrollToPackagesButton />
                        </div>
                    </AnimatedSection>
                </div>
            </div>

            {/* Scroll Indicator */}
            <AnimatedSection type="initial" direction="up" delay={1.2}>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="animate-bounce">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </AnimatedSection>
        </section>
    );
}