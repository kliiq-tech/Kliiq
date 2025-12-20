import { BentoGrid, BentoGridItem } from './BentoGrid'
import { Download, RefreshCw, Zap, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'

const features = [
    {
        title: "Intelligent Lifecycle Optimization",
        description: "Free up space, manage resources, and keep your infrastructure running at peak efficiency through automated routines.",
        header: (
            <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-white/5 relative">
                <img src="/assets/feature-optimize.png" alt="Optimize Interface" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
        ),
        className: "md:col-span-3",
        icon: <Zap className="h-4 w-4 text-primary" />,
    },
    {
        title: "Atomic Installation",
        description: "Zero-friction deployment of individual apps or orchestrated software stacks. No bundles, no noise.",
        header: (
            <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-white/5 relative">
                <img src="/assets/feature-install.png" alt="Install Interface" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110 opacity-70" />
            </div>
        ),
        className: "md:col-span-1",
        icon: <Download className="h-4 w-4 text-primary" />,
    },
    {
        title: "Continuous Repair",
        description: "Proactive monitoring and automated fixing of broken dependencies or failed installations.",
        header: (
            <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-white/5 relative">
                <img src="/assets/feature-update.png" alt="Update Interface" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110 opacity-70" />
            </div>
        ),
        className: "md:col-span-1",
        icon: <RefreshCw className="h-4 w-4 text-primary" />,
    },
    {
        title: "Environment Blueprints",
        description: "Deploy complex dev, creative, or production environments instantly with verified software packs.",
        header: (
            <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-white/5 relative">
                <img src="/assets/feature-packs.png" alt="Smart Packs Interface" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110 opacity-70" />
            </div>
        ),
        className: "md:col-span-1",
        icon: <Sparkles className="h-4 w-4 text-primary" />,
    },
]

export function Features() {
    return (
        <section id="features" className="py-32 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="mb-20">
                    <div className="text-primary font-mono text-xs mb-4 uppercase tracking-[0.3em]">Infrastructure Capabilities</div>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-6xl mb-8">
                        The Operating Layer <br /> for Your Software.
                    </h2>
                    <p className="text-xl text-text-secondary max-w-3xl leading-relaxed">
                        Kliiq transforms management into a continuous, automated service.
                        Reliable, compliant, and designed for the modern desktop lifecycle.
                    </p>
                </div>
                <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[22rem] gap-6">
                    {features.map((feature, i) => (
                        <BentoGridItem
                            key={i}
                            title={feature.title}
                            description={feature.description}
                            header={feature.header}
                            className={cn(feature.className, "glass-card border-white/5 hover:border-primary/20 transition-all duration-500")}
                            icon={feature.icon}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    )
}
