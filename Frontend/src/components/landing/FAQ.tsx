import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { useState } from 'react'

const faqs = [
    {
        question: "How does the Kliiq Engine ensure system stability?",
        answer: "Kliiq operates as a management system that communicates directly with official vendor repositories. By verifying checksums and using atomic installation patterns, we prevent dependency conflicts and ensure every software package is deployed in its optimal state."
    },
    {
        question: "Is Kliiq compatible with legacy Windows versions?",
        answer: "Yes, the Kliiq deployment script is designed to be backwards compatible with Windows 10, 8.x, and 7, alongside full support for Windows 11 and Windows Server environments."
    },
    {
        question: "Can I manage software that wasn't installed through Kliiq?",
        answer: "Absolutely. Kliiq's 'Continuous Repair' and 'Update' modules scan your system for existing software and bring them into the Kliiq lifecycle for automated optimization and maintenance."
    },
    {
        question: "What makes Kliiq different from a standard package manager?",
        answer: "Unlike traditional managers, Kliiq provides a full-lifecycle experience. We don't just 'install and forget'—we proactively monitor, repair, and optimize your software stack and system resources continuously."
    },
    {
        question: "How are software updates handled?",
        answer: "Updates are managed silently in the background or scheduled according to your preferences. Kliiq ensures that updates never interrupt your workflow and only proceed when system integrity is verified."
    }
]

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <section id="faq" className="py-32 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="text-primary font-mono text-xs mb-4 uppercase tracking-[0.3em]">Knowledge Base</div>
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-text-secondary leading-relaxed">
                            Everything you need to know about Kliiq.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="glass-card rounded-xl border-white/5 overflow-hidden transition-all duration-300"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="text-white font-bold text-lg pr-8">{faq.question}</span>
                                    {openIndex === i ? (
                                        <Minus className="w-5 h-5 text-primary flex-shrink-0" />
                                    ) : (
                                        <Plus className="w-5 h-5 text-text-muted flex-shrink-0" />
                                    )}
                                </button>

                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-6 pb-6"
                                    >
                                        <div className="pt-2 text-text-secondary leading-relaxed border-t border-white/5">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
