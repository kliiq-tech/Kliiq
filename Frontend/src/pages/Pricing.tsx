import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '../components/ui/Button'

const plans = [
    {
        name: "Community",
        price: "Free",
        description: "Perfect for individual developers and power users.",
        features: [
            "Atomic Installation",
            "Official Vendor Sources",
            "Basic Lifecycle Support",
            "Community Documentation",
            "Personal Environments"
        ],
        cta: "Get Started",
        popular: false
    },
    {
        name: "Professional",
        price: "$12",
        period: "/mo",
        description: "Advanced management for growing teams and studios.",
        features: [
            "Everything in Community",
            "Continuous Repair Module",
            "Intelligent Optimization",
            "Custom Environment Blueprints",
            "Priority Support",
            "Multi-system Sync"
        ],
        cta: "Start Free Trial",
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Full-spectrum governance for large-scale operations.",
        features: [
            "Everything in Professional",
            "Compliance & Auditing Logs",
            "Role-Based Access Control",
            "Dedicated Account Manager",
            "Custom Integration API",
            "On-premise Deployment"
        ],
        cta: "Contact Sales",
        popular: false
    }
]

export function Pricing() {
    return (
        <div className="pt-32 pb-24 bg-background min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-20">
                    <div className="text-primary font-mono text-xs mb-4 uppercase tracking-[0.3em]">Scalable Solutions</div>
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-8">
                        Flexible Pricing. <br />
                        <span className="text-text-secondary">Enterprise-grade reliability.</span>
                    </h1>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                        Choose the plan that fits your workflow. From individual workstations to distributed architecture.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "flex flex-col p-8 rounded-2xl glass-card relative",
                                plan.popular ? "border-primary/50 shadow-2xl shadow-primary/10 scale-105 z-10" : "border-white/5 shadow-xl"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-black text-xs font-bold rounded-full">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    {plan.period && <span className="text-text-muted">{plan.period}</span>}
                                </div>
                                <p className="text-text-secondary text-sm">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-10 flex-grow">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-center gap-3 text-sm text-text-secondary">
                                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.popular ? 'primary' : 'outline'}
                                className="w-full h-12"
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* Comparison Table */}
                <div className="mt-32 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                            Compare Plans
                        </h2>
                        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                            Detailed feature comparison across all pricing tiers.
                        </p>
                    </div>

                    <div className="glass-card rounded-2xl border-white/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left p-6 text-white font-bold">Features</th>
                                        <th className="text-center p-6 text-white font-bold">Community</th>
                                        <th className="text-center p-6 text-white font-bold bg-primary/5">Professional</th>
                                        <th className="text-center p-6 text-white font-bold">Enterprise</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-white/5">
                                        <td className="p-6 text-text-secondary">Atomic Installation</td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-6 bg-primary/5"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="p-6 text-text-secondary">Official Vendor Sources</td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-6 bg-primary/5"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="p-6 text-text-secondary">Basic Lifecycle Support</td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-6 bg-primary/5"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="p-6 text-text-secondary">Continuous Repair Module</td>
                                        <td className="text-center p-6 text-text-muted">—</td>
                                        <td className="text-center p-6 bg-primary/5"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="p-6 text-text-secondary">Intelligent Optimization</td>
                                        <td className="text-center p-6 text-text-muted">—</td>
                                        <td className="text-center p-6 bg-primary/5"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="p-6 text-text-secondary">Custom Environment Blueprints</td>
                                        <td className="text-center p-6 text-text-muted">—</td>
                                        <td className="text-center p-6 bg-primary/5"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="p-6 text-text-secondary">Multi-system Sync</td>
                                        <td className="text-center p-6 text-text-muted">—</td>
                                        <td className="text-center p-6 bg-primary/5"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="p-6 text-text-secondary">Priority Support</td>
                                        <td className="text-center p-6 text-text-muted">—</td>
                                        <td className="text-center p-6 bg-primary/5"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="p-6 text-text-secondary">Compliance & Auditing Logs</td>
                                        <td className="text-center p-6 text-text-muted">—</td>
                                        <td className="text-center p-6 bg-primary/5 text-text-muted">—</td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="p-6 text-text-secondary">Role-Based Access Control</td>
                                        <td className="text-center p-6 text-text-muted">—</td>
                                        <td className="text-center p-6 bg-primary/5 text-text-muted">—</td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="p-6 text-text-secondary">Dedicated Account Manager</td>
                                        <td className="text-center p-6 text-text-muted">—</td>
                                        <td className="text-center p-6 bg-primary/5 text-text-muted">—</td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="p-6 text-text-secondary">Custom Integration API</td>
                                        <td className="text-center p-6 text-text-muted">—</td>
                                        <td className="text-center p-6 bg-primary/5 text-text-muted">—</td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                    </tr>
                                    <tr>
                                        <td className="p-6 text-text-secondary">On-premise Deployment</td>
                                        <td className="text-center p-6 text-text-muted">—</td>
                                        <td className="text-center p-6 bg-primary/5 text-text-muted">—</td>
                                        <td className="text-center p-6"><Check className="w-5 h-5 text-primary mx-auto" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Utility for cn (needed if pricing is in separate file but using same lib)
import { cn } from '../lib/utils'
