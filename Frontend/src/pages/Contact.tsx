import { Mail, MessageSquare, Plus, Minus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
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

export function Contact() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <div className="pt-32 pb-24 bg-background min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16">
                        <div>
                            <div className="text-primary font-mono text-xs mb-4 uppercase tracking-[0.3em]">Communication Channels</div>
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-8">
                                Get in Touch.
                            </h1>
                            <p className="text-xl text-text-secondary mb-12 leading-relaxed">
                                Have questions about Kliiq or need enterprise-grade support? Our technical team is ready to assist.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">Email Support</h4>
                                        <p className="text-text-secondary">kliiqtech@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">Community Discord</h4>
                                        <p className="text-text-secondary">Join over 5,000+ builders</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-10 rounded-2xl border-white/5">
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-secondary">Full Name</label>
                                        <Input placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-secondary">Work Email</label>
                                        <Input type="email" placeholder="john@company.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">Subject</label>
                                    <Input placeholder="How can we help?" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">Message</label>
                                    <textarea
                                        className="w-full h-32 bg-surface/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        placeholder="Tell us about your requirements..."
                                    />
                                </div>
                                <Button className="w-full h-12">Send Message</Button>
                            </form>
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
        </div>
    )
}
