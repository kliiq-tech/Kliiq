import { Hero } from '../components/landing/Hero'
import { Features } from '../components/landing/Features'
import { Testimonials } from '../components/landing/Testimonials'
import { WhyKliiq } from '../components/landing/WhyKliiq'
import { HowItWorks } from '../components/landing/HowItWorks'
import { TargetAudience } from '../components/landing/TargetAudience'
import { AppInstaller } from '../components/landing/AppInstaller'
import { SoftwarePacks } from '../components/landing/SoftwarePacks'
import { FAQ } from '../components/landing/FAQ'

export function LandingPage() {
    return (
        <div className="min-h-screen">
            <Hero />
            <WhyKliiq />
            <Features />
            <AppInstaller />
            <SoftwarePacks />
            <HowItWorks />
            <TargetAudience />
            <Testimonials />
            <FAQ />
        </div>
    )
}
