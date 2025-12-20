import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/0 backdrop-blur-sm py-6 transition-all duration-300 ease-in-out">
            <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold bg-brand-gradient bg-clip-text text-transparent flex items-center">
                    Kliiq
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/#faq" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">FAQs</Link>
                    <Link to="/#packs" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Software Packs</Link>
                    <Link to="/pricing" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Pricing</Link>
                    <Link to="/contact" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Contact Us</Link>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    <Link to="/signin">
                        <Button variant="ghost" size="sm" className="text-text-secondary hover:text-white">Sign in</Button>
                    </Link>
                    <Link to="/signup">
                        <Button size="sm" className="shadow-lg shadow-primary/20">Get Started</Button>
                    </Link>
                </div>

                <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/5 p-4 space-y-4 shadow-2xl absolute top-full left-0 right-0">
                    <Link to="/#faq" className="block text-sm font-medium text-text-secondary hover:text-white" onClick={() => setMobileMenuOpen(false)}>FAQs</Link>
                    <Link to="/#packs" className="block text-sm font-medium text-text-secondary hover:text-white" onClick={() => setMobileMenuOpen(false)}>Software Packs</Link>
                    <Link to="/pricing" className="block text-sm font-medium text-text-secondary hover:text-white" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                    <Link to="/contact" className="block text-sm font-medium text-text-secondary hover:text-white" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
                    <Link to="/signin" className="block" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">Sign in</Button>
                    </Link>
                    <Link to="/signup" className="block" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full">Get Started</Button>
                    </Link>
                </div>
            )}
        </nav>
    )
}
