import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Monitor, ShieldCheck, Activity, Settings, LogOut, Cpu, Grid, Menu, X as CloseIcon } from 'lucide-react'
import { cn } from '../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { useState, useEffect } from 'react'
import { useTheme } from '../components/theme-provider'

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
    const { theme } = useTheme()
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
        <div className={theme}>
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
                    <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
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

                    {/* Sidebar Footer - New Odin Dev Look */}
                    <div className="p-4 border-t border-gray-200 dark:border-white/10">
                        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        OD
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[100px]">Odin Dev</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest">Online</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex-1 text-[10px] font-black text-gray-400 dark:text-white/50 uppercase tracking-widest text-center">
                                    Free
                                </span>
                                <Button size="sm" className="h-[28px] text-[10px] px-3 font-black uppercase tracking-widest bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-primary hover:text-white border-none">
                                    Upgrade
                                </Button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:pl-64 w-full">
                    <header className="h-16 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 lg:px-8 sticky top-0 bg-white/80 dark:bg-background/80 backdrop-blur-md z-40">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 lg:hidden text-gray-500 hover:text-gray-900 dark:text-text-muted dark:hover:text-white"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500 dark:text-text-muted">
                                <span className="text-[10px] font-bold text-gray-400 dark:text-text-muted uppercase tracking-[0.2em] px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-sm border border-gray-200 dark:border-white/10">Admin</span>
                            </div>
                        </div>
                        <div className="text-xs font-mono text-gray-400 dark:text-white/20">
                            v1.0-stable
                        </div>
                    </header>

                    <div className="p-4 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
