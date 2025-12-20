import { Link } from 'react-router-dom'

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#0B0D10] py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2 lg:col-span-2">
                        <Link to="/" className="text-2xl font-bold text-white mb-6 block">Kliiq</Link>
                        <p className="text-text-secondary max-w-xs leading-relaxed mb-8">
                            The intelligent operating layer for modern software lifecycle management.
                            Automate the friction out of your desktop environment.
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                <span className="text-xs font-bold">𝕏</span>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                <span className="text-xs font-bold">in</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><Link to="/#faq" className="text-text-secondary hover:text-primary transition-colors">FAQs</Link></li>
                            <li><Link to="/#packs" className="text-text-secondary hover:text-primary transition-colors">Software Packs</Link></li>
                            <li><Link to="/#installer" className="text-text-secondary hover:text-primary transition-colors">Installer</Link></li>
                            <li><Link to="/pricing" className="text-text-secondary hover:text-primary transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Resources</h4>
                        <ul className="space-y-4">
                            <li><Link to="/docs" className="text-text-secondary hover:text-primary transition-colors">Documentation</Link></li>
                            <li><Link to="/support" className="text-text-secondary hover:text-primary transition-colors">Support</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="text-text-secondary hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="text-text-secondary hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link to="/privacy" className="text-text-secondary hover:text-primary transition-colors">Privacy</Link></li>
                            <li><Link to="/terms" className="text-text-secondary hover:text-primary transition-colors">Terms</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em]">Intelligence</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em]">Reliability</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em]">Automation</span>
                    </div>
                    <div className="text-text-muted text-xs font-mono">
                        © {new Date().getFullYear()} KLIIQ TECHNOLOGIES. RIGHTS RESERVED.
                    </div>
                </div>
            </div>
        </footer>
    )
}
