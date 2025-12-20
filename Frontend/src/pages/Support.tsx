import { LifeBuoy, Zap, Shield, Search } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function Support() {
    return (
        <div className="pt-32 pb-24 bg-background min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                <div className="max-w-3xl mx-auto mb-20">
                    <div className="text-primary font-mono text-xs mb-4 uppercase tracking-[0.3em]">Help Center</div>
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-8">
                        Technical Support.
                    </h1>
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                        <Input
                            className="pl-12 h-14 bg-surface/50 border-white/10"
                            placeholder="Describe your issue or search documentation..."
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
                    <div className="glass-card p-8 rounded-2xl border-white/5 hover:border-primary/20 transition-all">
                        <Zap className="w-8 h-8 text-primary mb-6" />
                        <h3 className="text-xl font-bold text-white mb-4">Fast Tracking</h3>
                        <p className="text-text-secondary text-sm leading-relaxed mb-6">
                            Resolution for installation blockers and deployment failures. Typical response under 2 hours.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Create Ticket</Button>
                    </div>
                    <div className="glass-card p-8 rounded-2xl border-white/5 hover:border-primary/20 transition-all">
                        <Shield className="w-8 h-8 text-primary mb-6" />
                        <h3 className="text-xl font-bold text-white mb-4">Enterprise SLA</h3>
                        <p className="text-text-secondary text-sm leading-relaxed mb-6">
                            Dedicated support channels and priority engineering access for contract customers.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">SLA Login</Button>
                    </div>
                    <div className="glass-card p-8 rounded-2xl border-white/5 hover:border-primary/20 transition-all">
                        <LifeBuoy className="w-8 h-8 text-primary mb-6" />
                        <h3 className="text-xl font-bold text-white mb-4">Knowledge Base</h3>
                        <p className="text-text-secondary text-sm leading-relaxed mb-6">
                            Browse hundreds of technical articles and community-verified solutions.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Open Docs</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
