import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import croovrLogo from '../../assets/logo.svg'
import creotlyLogo from '../../assets/creotly.png'

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 opacity-30 animate-pulse" />
            <div className="absolute top-[20%] right-0 w-[800px] h-[600px] bg-primary-end/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="container mx-auto px-4 md:px-6 text-center">

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-7xl mb-6"
                >
                    Install Smarter. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary-end">Optimize Instantly.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto max-w-2xl text-lg text-text-secondary md:text-xl mb-4"
                >
                    Kliiq is the intelligent software manager that installs, updates, repairs, and optimizes your computer — all from one clean dashboard.
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="text-sm text-text-muted mb-10"
                >
                    Set up your PC in minutes, not hours.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6"
                >
                    <Link to="/signup">
                        <Button size="lg" className="group">
                            Get started
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                    <Link to="/signin">
                        <Button variant="ghost" size="lg">Sign in</Button>
                    </Link>
                </motion.div>
            </div>

            {/* Abstract UI representation - Panoramic View */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="mt-20 mx-auto max-w-[80rem] relative group px-4 md:px-6"
            >
                {/* Floating Elements - Adjusted for Wide Layout */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-4 lg:left-12 top-1/4 z-20 hidden lg:block"
                >
                    <div className="bg-surface/90 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-xl flex items-center gap-3 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                            <span className="text-xs">✓</span>
                        </div>
                        <div className="text-sm">
                            <div className="font-medium text-white">System Optimized</div>
                            <div className="text-xs text-text-secondary">Just now</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute right-4 lg:right-12 top-1/3 z-20 hidden lg:block"
                >
                    <div className="bg-surface/90 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-xl flex items-center gap-3 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <span className="text-xs">↓</span>
                        </div>
                        <div className="text-sm">
                            <div className="font-medium text-white">Update Installed</div>
                            <div className="text-xs text-text-secondary">VS Code • v1.85</div>
                        </div>
                    </div>
                </motion.div>

                {/* Glow effect */}
                {/* Subtle backlight instead of heavy glow */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-primary/10 blur-[100px] -z-10 rounded-full" />

                {/* Standard Aspect Ratio Container */}
                <div className="relative rounded-xl border border-white/10 bg-surface shadow-2xl overflow-hidden ring-1 ring-white/5 mx-auto max-w-[80rem]">
                    {/* Window Chrome */}
                    <div className="h-10 bg-surface border-b border-white/5 flex items-center px-4 space-x-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
                    </div>
                    {/* Image Container */}
                    <div className="aspect-video relative bg-black/50">
                        <img
                            src="/assets/dashboard-hero.png"
                            alt="Kliiq Dashboard Interface"
                            className="w-full h-full object-cover object-top"
                        />
                        {/* Reflection/Sheen - subtle */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none opacity-50" />
                    </div>
                </div>

                {/* Trusted By Section - Notion Style Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 max-w-[80rem] mx-auto px-4"
                >
                    <span className="text-sm font-medium text-text-muted whitespace-nowrap">Trusted by top teams</span>

                    <div className="flex items-center justify-center gap-12 sm:gap-16 w-full md:w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {/* Croovr Logo */}
                        <div className="flex items-center gap-2">
                            <img src={croovrLogo} alt="Croovr" className="h-6 w-auto" />
                            <span className="text-lg font-bold text-white tracking-tight">Croovr</span>
                        </div>

                        {/* BORT Logo */}
                        <div className="flex items-center gap-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                                <rect x="2" y="2" width="20" height="20" rx="6" />
                                <path d="M8 8h8v8H8z" fill="black" />
                            </svg>
                            <span className="text-lg font-black text-white tracking-tighter">BORT</span>
                        </div>

                        {/* Creotly Logo */}
                        <div className="flex items-center gap-2">
                            <img src={creotlyLogo} alt="Creotly" className="h-6 w-auto" />
                            <span className="text-lg font-semibold text-white">Creotly</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

        </section>
    )
}
