import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollToTopButton } from '../ScrollToTopButton'
import { useScrollToHash } from '../../lib/useScrollToHash'

export function Layout() {
    useScrollToHash()

    return (
        <div className="min-h-screen flex flex-col bg-background text-text-primary antialiased selection:bg-primary/20 selection:text-primary">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <ScrollToTopButton />
        </div>
    )
}
