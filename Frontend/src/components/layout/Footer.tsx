import { Link } from 'react-router-dom'

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-surface/30 backdrop-blur-sm py-12 mt-auto">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                <div className="text-center md:text-left">
                    <Link to="/" className="text-xl font-bold text-white mb-2 block">Kliiq</Link>
                    <p className="text-sm text-text-muted">Kliiq — software, simplified.</p>
                </div>

                <div className="flex space-x-8">
                    <a href="#" className="text-sm text-text-muted hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="text-sm text-text-muted hover:text-white transition-colors">Terms</a>
                    <a href="#" className="text-sm text-text-muted hover:text-white transition-colors">Contact</a>
                </div>
            </div>
            <div className="mt-8 text-center text-xs text-text-muted">
                © {new Date().getFullYear()} Kliiq. All rights reserved.
            </div>
        </footer>
    )
}
