import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollToTopButton } from '../ScrollToTopButton'
import { useEffect } from 'react'

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-text-primary antialiased selection:bg-primary/20 selection:text-primary">
            <ScrollToTop />
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <ScrollToTopButton />
        </div>
    )
}
