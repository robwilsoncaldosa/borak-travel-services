import { PackagesLoading } from './components/packages-section';
import HeroSection from './components/hero-section';

export default function Loading() {
    return (
        <div className="flex flex-col items-center">
            <HeroSection />
            <PackagesLoading />
        </div>
    );
}