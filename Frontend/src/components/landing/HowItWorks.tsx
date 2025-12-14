import { motion } from 'framer-motion'

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-surface/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-6">
                            Simple on the surface.<br />
                            <span className="text-primary">Powerful underneath.</span>
                        </h2>
                        <div className="space-y-6 text-lg text-text-secondary">
                            <p>
                                Kliiq runs through a web-based dashboard and a lightweight helper that works on your computer.
                            </p>
                            <p>
                                You choose what you need. <br />
                                Kliiq handles the rest — quietly and efficiently.
                            </p>
                            <ul className="space-y-2 text-white font-medium">
                                <li className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                    <span>No heavy desktop apps.</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                    <span>No constant manual updates.</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                    <span>Just control.</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-2xl bg-surface/50 border border-white/5 overflow-hidden shadow-2xl"
                    >
                        <img
                            src="/assets/architecture-diagram.png"
                            alt="Kliiq Architecture"
                            className="w-full h-auto object-cover"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
