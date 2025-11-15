
import { getPackages } from '@/lib/supabase/queries/getPackages';
import HeroSection from './components/hero-section';
import PackagesSection from './components/packages-section';

export default async function Page() {

    const packages = await getPackages();

    return (
        <div className="flex flex-col items-center">
            <HeroSection />
            <PackagesSection packages={packages} />
        </div>
    );
}
