import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import croovrLogo from '../../assets/logo.svg'
import creotlyLogo from '../../assets/creotly.png'

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-grid-pattern">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 opacity-30 animate-pulse-slow" />
            <div className="absolute top-[20%] right-0 w-[800px] h-[600px] bg-primary-end/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="container mx-auto px-4 md:px-6 text-center relative z-10">

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
                    className="mx-auto max-w-2xl text-lg text-text-secondary md:text-xl mb-10 leading-relaxed"
                >
                    Kliiq is the intelligent software manager that installs, updates, repairs,
                    and optimizes your computer — all from one clean dashboard.
                    <span className="block mt-2 text-text-muted text-base">Set up your PC in minutes, not hours.</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6"
                >
                    <Link to="/signup">
                        <Button size="lg" className="group h-14 px-8 text-lg font-semibold shadow-2xl shadow-primary/20">
                            Get started
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                    <Link to="/docs">
                        <Button variant="ghost" size="lg" className="h-14 px-8 text-lg font-semibold border border-white/5 hover:bg-white/5 transition-colors">
                            View Documentation
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Abstract UI representation - Panoramic View */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="mt-24 mx-auto max-w-[80rem] relative group px-4 md:px-6"
            >
                {/* Floating Elements - Precision Aligned to Window edges */}
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-0 lg:left-0 top-1/4 z-20 hidden lg:block"
                >
                    <div className="glass-card p-4 rounded-xl shadow-2xl flex items-center gap-4 transform -rotate-1 hover:rotate-0 transition-all duration-500 border-l-2 border-l-green-500">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                            <Check className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">Status</div>
                            <div className="text-sm font-semibold text-white">System Optimized</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute right-0 lg:right-0 top-1/3 z-20 hidden lg:block"
                >
                    <div className="glass-card p-4 rounded-xl shadow-2xl flex items-center gap-4 transform rotate-1 hover:rotate-0 transition-all duration-500 border-r-2 border-r-blue-500">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <ArrowRight className="w-5 h-5 rotate-90" />
                        </div>
                        <div>
                            <div className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">lifecycle</div>
                            <div className="text-sm font-semibold text-white">VS Code Updated</div>
                            <div className="text-[10px] font-mono text-blue-400/70">PATCH v1.85.1 SUCCESS</div>
                        </div>
                    </div>
                </motion.div>

                {/* Subtler backlight */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-primary/5 blur-[120px] -z-10 rounded-full" />

                {/* Standard Aspect Ratio Container */}
                <div className="relative rounded-xl border border-white/10 bg-surface/80 backdrop-blur-md shadow-[0_0_50px_-12px_rgba(10,132,255,0.2)] overflow-hidden ring-1 ring-white/5 mx-auto max-w-[80rem]">
                    {/* Window Chrome */}
                    <div className="h-12 bg-black/40 border-b border-white/5 flex items-center px-6 justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-white/10"></div>
                            <div className="w-3 h-3 rounded-full bg-white/10"></div>
                            <div className="w-3 h-3 rounded-full bg-white/10"></div>
                        </div>
                        <div className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">Kliiq Dashboard Console</div>
                        <div className="w-12 h-1 rounded-full bg-white/5"></div>
                    </div>
                    {/* Image Container */}
                    <div className="aspect-video relative bg-[#0B0D10]">
                        <img
                            src="/assets/dashboard-hero.png"
                            alt="Kliiq Dashboard Interface"
                            className="w-full h-full object-cover object-top opacity-90 transition-opacity duration-700 group-hover:opacity-100"
                        />
                        {/* Technical Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-transparent to-transparent pointer-events-none opacity-40" />
                        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                    </div>
                </div>

                {/* Trusted By Section - Minimalist Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 max-w-[80rem] mx-auto px-4"
                >
                    <div className="flex-shrink-0">
                        <span className="text-sm font-medium text-text-muted whitespace-nowrap">Trusted by top teams</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-12 gap-y-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        {/* Croovr Logo */}
                        <a
                            href="https://croovr-frontend.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                        >
                            <img src={croovrLogo} alt="Croovr" className="h-4 w-auto" />
                            <span className="text-base font-bold text-white tracking-tight">Croovr</span>
                        </a>

                        {/* BORT Logo */}
                        <a
                            href="https://bortai.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                        >
                            <div className="w-5 h-5 rounded bg-white flex items-center justify-center">
                                <span className="text-black font-black text-[10px]">B</span>
                            </div>
                            <span className="text-base font-black text-white tracking-tighter">BORT</span>
                        </a>

                        {/* Creotly Logo */}
                        <a
                            href="https://creotly-web.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                        >
                            <img src={creotlyLogo} alt="Creotly" className="h-4 w-auto" />
                            <span className="text-base font-semibold text-white tracking-tight">Creotly</span>
                        </a>
                    </div>
                </motion.div>
            </motion.div>

        </section>
    )
}
