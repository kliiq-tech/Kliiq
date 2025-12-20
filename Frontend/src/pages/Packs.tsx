import { motion } from 'framer-motion'
import { Code, Palette, Cpu, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/Button'

const blueprints = [
    {
        title: "Creator's Suite",
        description: "Optimized for high-fidelity creative production.",
        apps: ["Blender", "Figma", "GIMP", "OBS Studio", "VLC"],
        icon: <Palette className="w-6 h-6" />,
        color: "from-purple-500/20 to-pink-500/20"
    },
    {
        title: "Full-Stack Dev",
        description: "Zero-config environment for modern engineers.",
        apps: ["VS Code", "Node.js", "Docker", "Git", "Python"],
        icon: <Code className="w-6 h-6" />,
        color: "from-blue-500/20 to-cyan-500/20"
    },
    {
        title: "Infrastructure Core",
        description: "Base setup for reliable deployments.",
        apps: ["7-Zip", "WizTree", "AnyDesk", "Chrome"],
        icon: <Cpu className="w-6 h-6" />,
        color: "from-emerald-500/20 to-teal-500/20"
    }
]

export function Packs() {
    return (
        <div className="pt-32 pb-24 bg-background min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-20">
                    <div className="text-primary font-mono text-xs mb-4 uppercase tracking-[0.3em]">Environment Blueprints</div>
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-8">
                        Verified Software Packs. <br />
                        <span className="text-text-secondary">Deploy complex stacks instantly.</span>
                    </h1>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                        Pre-configured environments designed for specific technical workflows.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {blueprints.map((pack, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-10 rounded-2xl border-white/5 relative group hover:border-primary/30 transition-all duration-500"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${pack.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl -z-10`} />

                            <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                                {pack.icon}
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4">{pack.title}</h3>
                            <p className="text-text-secondary mb-8 text-sm">{pack.description}</p>

                            <div className="space-y-3 mb-12 flex-grow">
                                {pack.apps.map((app, j) => (
                                    <div key={j} className="flex items-center gap-3 text-xs text-text-muted">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                        {app}
                                    </div>
                                ))}
                            </div>

                            <Button className="w-full gap-2 group/btn">
                                Install Pack
                                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
