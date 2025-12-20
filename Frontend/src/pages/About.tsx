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

export function About() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <div className="pt-32 pb-24 bg-background min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="text-primary font-mono text-xs mb-4 uppercase tracking-[0.3em]">Our Mission</div>
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-8">
                        The Operating Layer <br />
                        <span className="text-text-secondary">for Personal Computing.</span>
                    </h1>

                    <div className="prose prose-invert prose-lg max-w-none space-y-8 text-text-secondary leading-relaxed">
                        <p>
                            Kliiq was founded on a simple premise: managing software should be as automated and reliable as the infrastructure that runs the modern web.
                            For too long, desktop software management has been fragmented, manual, and prone to technical debt.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 my-16">
                            <div className="glass-card p-8 rounded-xl border-white/5">
                                <h3 className="text-xl font-bold text-white mb-4">Integrity Driven</h3>
                                <p className="text-sm">We believe in system sovereignty. Every tool we build respects your system's integrity and absolute control.</p>
                            </div>
                            <div className="glass-card p-8 rounded-xl border-white/5">
                                <h3 className="text-xl font-bold text-white mb-4">Automation First</h3>
                                <p className="text-sm">Human error is the leading cause of system failure. We remove the human element from repetitive maintenance routines.</p>
                            </div>
                        </div>

                        <p>
                            Our team of engineers and designers is dedicated to building the ultimate management system for your digital tools.
                            Whether you're an individual developer or a distributed enterprise, Kliiq ensures your software lifecycle is continuous and frictionless.
                        </p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-32 max-w-3xl mx-auto">
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
                                    <div className="px-6 pb-6">
                                        <div className="pt-2 text-text-secondary leading-relaxed border-t border-white/5">
                                            {faq.answer}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
