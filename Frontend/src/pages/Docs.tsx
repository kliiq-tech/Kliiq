import { Terminal, BookOpen, Plus, Minus } from 'lucide-react'
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

export function Docs() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <div className="pt-32 pb-24 bg-background min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-[250px_1fr] gap-12">
                    {/* Sidebar */}
                    <aside className="hidden lg:block space-y-8">
                        <div>
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary" />
                                Fundamentals
                            </h4>
                            <ul className="space-y-2 text-sm text-text-secondary">
                                <li className="text-primary">Introduction</li>
                                <li className="hover:text-white cursor-pointer">Architecture</li>
                                <li className="hover:text-white cursor-pointer">Security Protocols</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-primary" />
                                CLI Reference
                            </h4>
                            <ul className="space-y-2 text-sm text-text-secondary">
                                <li className="hover:text-white cursor-pointer">Installation</li>
                                <li className="hover:text-white cursor-pointer">Update Commands</li>
                                <li className="hover:text-white cursor-pointer">Repair Flags</li>
                            </ul>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="max-w-4xl prose prose-invert">
                        <h1 className="text-4xl font-bold text-white mb-8">Documentation</h1>
                        <p className="text-xl text-text-secondary leading-relaxed mb-12">
                            A comprehensive guide to managing your software lifecycle with the Kliiq Engine.
                        </p>

                        <div className="glass-card p-10 rounded-2xl border-white/5 bg-surface/30 mb-8">
                            <h3 className="text-white mt-0">Quick Start</h3>
                            <p>To initialize the Kliiq environment on your system, run the following command in an elevated prompt:</p>
                            <div className="bg-black/50 p-4 rounded-lg font-mono text-sm border border-white/10 text-primary mb-6">
                                curl -sL https://kliiq.sh/install | sh
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white">Advanced Configuration</h2>
                        <p>
                            Kliiq supports complex environment blueprints through YAML-based configuration. This allows for reproducible software stacks across distributed teams.
                        </p>

                        {/* FAQ Section */}
                        <div className="mt-16 not-prose">
                            <div className="mb-12">
                                <div className="text-primary font-mono text-xs mb-4 uppercase tracking-[0.3em]">Knowledge Base</div>
                                <h2 className="text-3xl font-bold tracking-tight text-white mb-6">
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
            </div>
        </div>
    )
}
