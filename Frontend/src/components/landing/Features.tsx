import { BentoGrid, BentoGridItem } from './BentoGrid'
import { Download, RefreshCw, Zap, Sparkles } from 'lucide-react'

const features = [
    {
        title: "Optimize system performance",
        description: "Free up space, manage background apps, and keep your system running smoothly.",
        header: (
            <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-white/10 relative">
                <img src="/assets/feature-optimize.png" alt="Optimize Interface" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>
        ),
        className: "md:col-span-3",
        icon: <Zap className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Install software in one click",
        description: "Install individual apps or full software packs instantly — no pop-ups, no bundled junk.",
        header: (
            <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-white/10 relative">
                <img src="/assets/feature-install.png" alt="Install Interface" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>
        ),
        className: "md:col-span-1",
        icon: <Download className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Auto-update and repair",
        description: "Keep all your software up to date and automatically fix broken or failed installations.",
        header: (
            <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-white/10 relative">
                <img src="/assets/feature-update.png" alt="Update Interface" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>
        ),
        className: "md:col-span-1",
        icon: <RefreshCw className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Smart software packs",
        description: "Set up developer, creator, productivity, or gaming environments in minutes.",
        header: (
            <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-white/10 relative">
                <img src="/assets/feature-packs.png" alt="Smart Packs Interface" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>
        ),
        className: "md:col-span-1",
        icon: <Sparkles className="h-4 w-4 text-neutral-500" />,
    },
]

export function Features() {
    return (
        <section id="features" className="py-24 bg-surface/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                        Everything your computer needs.
                    </h2>
                    <p className="text-xl text-text-secondary max-w-2xl">
                        Powerful tools to manage your digital life, all in one place.
                    </p>
                </div>
                <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
                    {features.map((feature, i) => (
                        <BentoGridItem
                            key={i}
                            title={feature.title}
                            description={feature.description}
                            header={feature.header}
                            className={feature.className}
                            icon={feature.icon}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    )
}
