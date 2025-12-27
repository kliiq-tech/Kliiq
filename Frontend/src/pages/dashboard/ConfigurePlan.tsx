import { ArrowLeft, ShieldCheck, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export function ConfigurePlan() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex items-center gap-4 mb-12">
                <Link to="/dashboard/upgrade">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Configure your plan</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Side: Form */}
                <div className="space-y-10">
                    <section className="space-y-6">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            Payment method
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Card number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                        <div className="w-8 h-5 bg-gray-200 dark:bg-white/20 rounded opacity-50" />
                                        <div className="w-8 h-5 bg-gray-200 dark:bg-white/20 rounded opacity-50" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Expiration date</label>
                                    <input
                                        type="text"
                                        placeholder="MM / YY"
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Security code</label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Mail className="w-5 h-5 text-primary" />
                            Billing address
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Full name</label>
                                <input
                                    type="text"
                                    placeholder="Jane Doe"
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Country</label>
                                <select className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm outline-none">
                                    <option>Nigeria</option>
                                    <option>United States</option>
                                    <option>United Kingdom</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Address line 1</label>
                                <input
                                    type="text"
                                    placeholder="Street address"
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Side: Summary Card */}
                <div>
                    <div className="bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl shadow-black/5 dark:shadow-none sticky top-24">
                        <h3 className="text-2xl font-bold mb-6">Plus plan</h3>
                        <div className="space-y-4 mb-8">
                            {[
                                "Smarter, faster responses with GPT-5",
                                "More messages & uploads",
                                "Faster, higher-quality image creation",
                                "Extra memory & context"
                            ].map((feature) => (
                                <div key={feature} className="flex gap-3 text-sm text-gray-600 dark:text-text-secondary leading-tight">
                                    <div className="mt-1 w-1 h-1 rounded-full bg-primary" />
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-white/10">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Monthly subscription</span>
                                <span className="font-medium">₦31,500.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">VAT (7.5%)</span>
                                <span className="font-medium">₦2,197.67</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-100 dark:border-white/10">
                                <span>Due today</span>
                                <span className="text-primary">₦31,500.00</span>
                            </div>
                        </div>

                        <Button className="w-full mt-8 py-7 text-sm font-bold bg-gray-900 dark:bg-white text-white dark:text-black">
                            Subscribe
                        </Button>

                        <p className="mt-6 text-[10px] text-gray-400 text-center leading-relaxed">
                            By subscribing, you authorize Kliiq Inc. to charge you, according to the terms until you cancel. You also agree to the Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
