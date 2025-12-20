export function Privacy() {
    return (
        <div className="pt-32 pb-24 bg-background min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-3xl mx-auto prose prose-invert">
                    <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
                    <p className="text-text-secondary mb-6">Last updated: December 2025</p>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
                    <p className="text-text-secondary">
                        Kliiq is designed with a privacy-first architecture. We do not collect your personal files or monitor your screen.
                        We only collect telemetry data related to software installation success rates and system resource usage to improve the Kliiq Engine.
                    </p>

                    <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Technical Integrity</h2>
                    <p className="text-text-secondary">
                        Our management layer operates transparently. All automated routines are logged locally on your system for your audit.
                    </p>
                </div>
            </div>
        </div>
    )
}
