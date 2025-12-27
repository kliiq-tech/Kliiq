import { useState } from 'react'
import { Check, ArrowLeft, Building2, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'

interface Plan {
    name: string
    price: string
    description: string
    features: string[]
    isCurrent?: boolean
    buttonText: string
    isNew?: boolean
    recommended?: boolean
    highlight?: string
    buttonVariant?: "secondary" | "primary" | "ghost" | "outline"
}

const plans: { personal: Plan[], business: Plan[] } = {
    personal: [
        {
            name: "Free",
            price: "0",
            description: "See what Kliiq can do",
            features: ["Get simple explanations", "Have short chats for common questions", "Try out image generation", "Save limited memory and context"],
            isCurrent: true,
            buttonText: "Your current plan"
        },
        {
            name: "Go",
            price: "7,000",
            description: "Do more with smarter AI",
            features: ["Go deep on harder questions", "Chat longer and upload more content", "Make realistic images for your projects", "Store more context for smarter replies", "Get help with planning and tasks", "Explore projects, tasks, and custom GPTs"],
            isNew: true,
            buttonText: "Upgrade to Go",
            highlight: "bg-primary/5 border-primary/20",
            buttonVariant: "primary"
        },
        {
            name: "Plus",
            price: "31,500",
            description: "Unlock the full experience",
            features: ["Solve complex problems", "Have long chats over multiple sessions", "Create more images, faster", "Remember goals and past conversations", "Plan travel and tasks with agent mode", "Organize projects and customize GPTs", "Produce and share videos on Sora", "Write code and build apps with Codex"],
            buttonText: "Get Plus",
            buttonVariant: "secondary"
        },
        {
            name: "Pro",
            price: "299,900",
            description: "Maximize your productivity",
            features: ["Master advanced tasks and topics", "Tackle big projects with unlimited messages", "Create high-quality images at any scale", "Keep full context with maximum memory", "Run research and plan tasks with agents", "Scale your projects and automate workflows", "Expand your limits with Sora video creation", "Deploy code faster with Codex", "Get early access to experimental features"],
            buttonText: "Get Pro",
            buttonVariant: "secondary"
        }
    ],
    business: [
        {
            name: "Free",
            price: "0",
            description: "See what AI can do",
            features: ["Get simple explanations", "Have short chats for common questions", "Try out image generation", "Save limited memory and context"],
            isCurrent: true,
            buttonText: "Your current plan"
        },
        {
            name: "Business",
            price: "37,500",
            description: "Get more work done with AI for teams",
            features: ["Conduct professional analysis", "Get unlimited messages with GPT-4", "Produce images, videos, slides, & more", "Secure your space with SSO, MFA, & more", "Protect privacy; data never used for training", "Share projects & custom GPTs", "Integrate with SharePoint & other tools", "Simplify billing and user management", "Capture meeting notes with transcription", "Deploy agents to code and research"],
            recommended: true,
            buttonText: "Get Business",
            highlight: "bg-primary/5 border-primary/20",
            buttonVariant: "primary"
        }
    ]
}

export function UpgradePage() {
    const [type, setType] = useState<'personal' | 'business'>('personal')

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex items-center gap-4">
                <Link to="/dashboard">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-center flex-1 pr-10">Upgrade your plan</h1>
            </div>

            <div className="flex justify-center">
                <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-full flex gap-1 border border-gray-200 dark:border-white/10">
                    <button
                        onClick={() => setType('personal')}
                        className={cn(
                            "px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2",
                            type === 'personal' ? "bg-white dark:bg-zinc-800 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-white"
                        )}
                    >
                        <User className="w-3 h-3" />
                        Personal
                    </button>
                    <button
                        onClick={() => setType('business')}
                        className={cn(
                            "px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2",
                            type === 'business' ? "bg-white dark:bg-zinc-800 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-white"
                        )}
                    >
                        <Building2 className="w-3 h-3" />
                        Business
                    </button>
                </div>
            </div>

            <div className={cn(
                "grid gap-6",
                type === 'personal' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
            )}>
                {plans[type].map((plan) => (
                    <div
                        key={plan.name}
                        className={cn(
                            "relative flex flex-col p-6 rounded-3xl border transition-all hover:scale-[1.02]",
                            plan.isCurrent ? "bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 opacity-80" :
                                plan.highlight ? "bg-gradient-to-b from-primary/5 to-transparent border-primary/20 shadow-xl shadow-primary/5" :
                                    "bg-white dark:bg-surface border-gray-200 dark:border-white/10 shadow-sm"
                        )}
                    >
                        {plan.isNew && (
                            <span className="absolute top-4 right-4 bg-primary text-[10px] font-bold text-white px-2 py-0.5 rounded uppercase tracking-wider">New</span>
                        )}
                        {plan.recommended && (
                            <span className="absolute top-4 right-4 bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Recommended</span>
                        )}

                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{plan.name}</h2>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">₦{plan.price}</span>
                                {plan.price !== '0' && <span className="text-gray-500 text-xs">/ month</span>}
                            </div>
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed">{plan.description}</p>
                        </div>

                        <Link to={plan.isCurrent ? "#" : "/dashboard/configure-plan"} className="mt-auto block">
                            <Button
                                className="w-full text-xs font-bold py-6"
                                variant={plan.buttonVariant || "outline"}
                                disabled={plan.isCurrent}
                            >
                                {plan.buttonText}
                            </Button>
                        </Link>

                        <div className="mt-8 space-y-4">
                            {plan.features.map((feature) => (
                                <div key={feature} className="flex gap-3">
                                    <div className="mt-0.5 rounded-full bg-primary/10 p-0.5">
                                        <Check className="w-3 h-3 text-primary stroke-[3]" />
                                    </div>
                                    <span className="text-xs text-gray-600 dark:text-text-secondary leading-tight">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Enterprise suggestion */}
            <div className="text-center pt-8 border-t border-gray-100 dark:border-white/5">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Need more capabilities for your business?
                </p>
                <Link to="/contact" className="text-primary text-sm font-bold hover:underline">
                    See Kliiq Enterprise
                </Link>
            </div>
        </div>
    )
}
