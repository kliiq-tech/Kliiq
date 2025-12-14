import { ShieldCheck } from 'lucide-react'

export function Security() {
    return (
        <section className="py-24 bg-background border-t border-white/5">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-6">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-6">
                    Safe. Transparent. Reliable.
                </h2>
                <div className="max-w-2xl mx-auto text-lg text-text-secondary leading-relaxed">
                    <p className="mb-4">
                        Kliiq installs software directly from official vendor sources.
                        We don’t modify installers, bundle extras, or touch your personal files.
                    </p>
                    <p className="text-white font-medium">
                        Your system stays yours.
                    </p>
                </div>
            </div>
        </section>
    )
}
