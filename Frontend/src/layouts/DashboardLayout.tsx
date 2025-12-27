import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Monitor, ShieldCheck, Activity, Settings, LogOut, Cpu, Grid, Menu, X as CloseIcon } from 'lucide-react'
import { cn } from '../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { useState, useEffect } from 'react'

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Grid, label: 'Apps', path: '/dashboard/apps' },
    { icon: Monitor, label: 'Devices', path: '/dashboard/devices' },
    { icon: Cpu, label: 'Hardware', path: '/dashboard/hardware' },
    { icon: ShieldCheck, label: 'Software', path: '/dashboard/software' },
    { icon: Activity, label: 'Activity', path: '/dashboard/activity' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
]

export function DashboardLayout() {
    const location = useLocation()
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsSidebarOpen(false)
    }, [location.pathname])

    const handleLogout = () => {
        navigate('/signin')
    }

    return (
        <div className="min-h-screen bg-white dark:bg-background text-gray-900 dark:text-white flex font-sans selection:bg-primary/30 transition-colors duration-300 overflow-x-hidden">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 w-64 border-r border-gray-200 dark:border-white/10 flex flex-col bg-white/95 dark:bg-background/95 backdrop-blur-sm z-[70] transition-transform duration-300 lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Brand Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/10">
                    <Link to="/" className="text-2xl font-bold bg-brand-gradient bg-clip-text text-transparent flex items-center">
                        Kliiq
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 lg:hidden text-gray-500 hover:text-gray-900 dark:text-text-muted dark:hover:text-white"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.path
                        const Icon = item.icon

                        return (
                            <Link key={item.path} to={item.path}>
                                <div className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group",
                                    isActive
                                        ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5"
                                        : "text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                                )}>
                                    <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-gray-400 dark:text-text-muted group-hover:text-gray-900 dark:group-hover:text-white")} />
                                    {item.label}

                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full"
                                        />
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer User Profile */}
                <div className="p-4 border-t border-gray-200 dark:border-white/10 space-y-4">
                    <div className="flex items-center justify-between gap-3 bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden relative group/user">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/20 flex-shrink-0">
                                OD
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Odin Dev</p>
                                </div>
                                <div className="mt-0.5">
                                    <span className="text-[10px] font-bold bg-white dark:bg-white/10 text-gray-400 dark:text-text-muted px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">Free</span>
                                </div>
                            </div>
                        </div>

                        <Link to="/dashboard/upgrade" className="absolute bottom-2 right-2">
                            <Button size="sm" className="h-7 px-3 text-[10px] bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-black border-0 rounded-full font-bold shadow-lg shadow-primary/20">
                                Upgrade
                            </Button>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="absolute top-2 right-2 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                            title="Sign Out"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:pl-64 w-full transition-all duration-300">
                {/* Top Bar */}
                <header className="h-16 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 lg:px-8 sticky top-0 bg-white/80 dark:bg-background/80 backdrop-blur-md z-40 transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 lg:hidden text-gray-500 hover:text-gray-900 dark:text-text-muted dark:hover:text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500 dark:text-text-muted">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Online
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-text-muted uppercase tracking-[0.2em] px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-md border border-gray-200 dark:border-white/10">Admin</span>
                        </div>
                    </div>
                    <div className="text-xs font-mono text-gray-400 dark:text-white/20">
                        v1.0-stable
                    </div>
                </header>

                <div className="p-4 lg:p-8 max-w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
