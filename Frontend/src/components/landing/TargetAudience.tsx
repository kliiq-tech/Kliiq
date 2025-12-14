import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const audiences = [
    "Developers setting up new machines",
    "Designers installing creative tools",
    "Gamers preparing performance-ready systems",
    "Teams onboarding devices faster",
    "Anyone tired of reinstalling software from scratch"
]

export function TargetAudience() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-12">
                        Designed for how people actually work.
                    </h2>

                    <div className="grid gap-4 text-left max-w-lg mx-auto mb-10">
                        {audiences.map((item, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                                <span className="text-lg text-text-secondary">{item}</span>
                            </div>
                        ))}
                    </div>

                    <p className="text-xl font-medium text-white">
                        If you use a computer to get work done, Kliiq fits.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
