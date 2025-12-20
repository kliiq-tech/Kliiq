export function Terms() {
    return (
        <div className="pt-32 pb-24 bg-background min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-3xl mx-auto prose prose-invert">
                    <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
                    <p className="text-text-secondary mb-6">Last updated: December 2025</p>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">1. License</h2>
                    <p className="text-text-secondary">
                        By using the Kliiq Engine, you are granted a non-exclusive license to orchestrate your software lifecycle
                        using our proprietary automation protocols.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Usage Policy</h2>
                    <p className="text-text-secondary">
                        You agree not to use Kliiq for orchestrating malicious software or violating vendor licenses.
                        Kliiq operates as a transparent management layer and is not responsible for third-party software conduct.
                    </p>
                </div>
            </div>
        </div>
    )
}
