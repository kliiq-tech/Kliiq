import { ShieldCheck } from 'lucide-react'

export function Security() {
    return (
        <section className="py-32 bg-background relative overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-xs font-mono mb-8">
                        <ShieldCheck className="w-4 h-4" />
                        Verified Security Protocol
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-8">
                        Integrated Safety. <br />
                        <span className="text-text-secondary">Uncompromising Technical Integrity.</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12 text-left mt-16">
                        <div className="glass-card p-8 rounded-xl border-white/5">
                            <h3 className="text-xl font-bold text-white mb-4">Official Vendor Channels</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Kliiq orchestrates installations directly from verified vendor sources.
                                No middle-ware, no modified binaries, and zero bundled third-party bloat.
                            </p>
                        </div>
                        <div className="glass-card p-8 rounded-xl border-white/5">
                            <h3 className="text-xl font-bold text-white mb-4">System Sovereignty</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Your environment remains under your absolute control. Kliiq operates as a transparent
                                management layer without altering core system permissions or personal data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
