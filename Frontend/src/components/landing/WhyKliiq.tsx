import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export function WhyKliiq() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-5xl mx-auto grid md:grid-cols-[1.5fr,1fr] gap-12 items-end"
                >
                    <div className="space-y-8">
                        {/* Quote Icon - Cyan like reference */}
                        <Quote className="w-16 h-16 text-cyan-400 fill-cyan-400 opacity-90" />

                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                            Software setup shouldn’t be this hard.
                        </h2>
                    </div>

                    <div className="space-y-6 pb-2">
                        <p className="text-lg text-text-secondary leading-relaxed">
                            Setting up a new computer is still slow, manual, and repetitive.
                            You install apps one by one, hunt for updates, and waste time configuring tools.
                        </p>
                        <p className="text-lg text-white font-medium border-l-2 border-cyan-500 pl-4">
                            Kliiq removes that friction by managing your entire software lifecycle — automatically.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
