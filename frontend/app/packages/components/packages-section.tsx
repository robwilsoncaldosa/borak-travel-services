import PackageCards, { PackageCardProps } from '@/components/ui/packages';
import AnimatedSection from '../../_components/animated-section';

interface PackagesSectionProps {
    packages: PackageCardProps[];
}

// Loading component for packages (exported for use in Suspense)
export function PackagesLoading() {
    return (
        <div className="w-full bg-white">
            <AnimatedSection>
                <div className="w-full py-16 bg-white" id="packages">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-[#2E2E2E]"
                                style={{
                                    fontFamily: '"Playfair Display", serif',
                                    letterSpacing: '0.02em'
                                }}>
                                Premium Cebu Experiences
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4"
                                style={{ fontFamily: '"Poppins", sans-serif' }}>
                                Every package below has been personally tested and handpicked by our travel experts.
                                We focus on delivering exceptional quality rather than overwhelming you with endless options.
                            </p>
                            <p className="text-base text-gray-500 max-w-2xl mx-auto"
                                style={{ fontFamily: '"Poppins", sans-serif' }}>
                                Quality over quantity • Personally tested • Premium experiences only
                            </p>
                        </div>
                    </div>
                </div>
            </AnimatedSection>
            
            <AnimatedSection>
                <div className="flex justify-center items-center py-32">
                    <div className="text-center">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#2E2E2E] rounded-full animate-spin mx-auto mb-6" />
                        </div>
                        <h3 className="text-xl text-[#2E2E2E] font-semibold mb-2"
                            style={{ fontFamily: '"Poppins", sans-serif' }}>
                            Curating premium experiences...
                        </h3>
                        <p className="text-gray-600">
                            We're preparing our handpicked collection for you
                        </p>
                    </div>
                </div>
            </AnimatedSection>
        </div>
    );
}

// Empty state component
function EmptyPackages() {
    return (
        <div className="flex flex-col justify-center items-center py-32">
            <div className="text-center max-w-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#2E2E2E] mb-4"
                    style={{ fontFamily: '"Playfair Display", serif' }}>
                    Premium Experiences Coming Soon
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed"
                    style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Our travel experts are currently curating exceptional experiences.
                    Check back soon for our handpicked premium packages!
                </p>
            </div>
        </div>
    );
}

export default function PackagesSection({ packages }: PackagesSectionProps) {
    return (
        <>
            {/* Section Header with Enhanced Typography */}
            <AnimatedSection>
                <div className="w-full py-16 bg-white" id="packages">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-[#2E2E2E]"
                                style={{
                                    fontFamily: '"Playfair Display", serif',
                                    letterSpacing: '0.02em'
                                }}>
                                Premium Cebu Experiences
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4"
                                style={{ fontFamily: '"Poppins", sans-serif' }}>
                                Every package below has been personally tested and handpicked by our travel experts.
                                We focus on delivering exceptional quality rather than overwhelming you with endless options.
                            </p>
                            <p className="text-base text-gray-500 max-w-2xl mx-auto"
                                style={{ fontFamily: '"Poppins", sans-serif' }}>
                                Quality over quantity • Personally tested • Premium experiences only
                            </p>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Packages Section with Enhanced Premium Layout */}
            <AnimatedSection>
                <div className="w-full bg-white">
                    {packages.length === 0 ? (
                        <EmptyPackages />
                    ) : (
                        <PackageCards packages={packages} />
                    )}
                </div>
            </AnimatedSection>
        </>
    );
}