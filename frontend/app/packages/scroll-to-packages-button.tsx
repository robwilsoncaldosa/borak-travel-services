'use client';

export default function ScrollToPackagesButton() {
    // Smooth scroll function
    const scrollToPackages = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const packagesSection = document.getElementById('packages');
        if (packagesSection) {
            packagesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <a
            onClick={scrollToPackages}
            className="bg-white text-[#2E2E2E] px-10 py-4 rounded-full font-bold text-lg tracking-wide transition-all duration-300 hover:bg-gray-100 hover:scale-105 shadow-2xl cursor-pointer"
            style={{ fontFamily: '"Poppins", sans-serif' }}
        >
            Explore Premium Packages
        </a>
    );
}