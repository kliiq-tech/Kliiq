import { Button } from '../../components/ui/Button'
import { Bell, Moon, Sun, User } from 'lucide-react'
import { useTheme } from '../../components/theme-provider'

export function DashboardSettings() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Settings</h1>
                <p className="text-gray-500 dark:text-text-muted text-sm">Manage your account and dashboard preferences</p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-white dark:bg-surface/20 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" /> Profile
                    </h3>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-primary-end flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-primary/20">
                            OD
                        </div>
                        <div>
                            <div className="font-bold text-gray-900 dark:text-white">Odin Dev</div>
                            <div className="text-sm text-gray-500 dark:text-text-muted">odin@kliiq.io</div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">Edit Profile</Button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white dark:bg-surface/20 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-accent" /> Notifications
                    </h3>
                    <div className="space-y-4">
                        {['Critical Security Alerts', 'Device Offline Alerts', 'Software Update Available'].map((setting) => (
                            <div key={setting} className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-600 dark:text-text-secondary">{setting}</span>
                                <div className="w-10 h-6 bg-gray-200 dark:bg-gray-800 rounded-full relative cursor-pointer group transition-colors has-[:checked]:bg-primary">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all peer-checked:translate-x-4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Appearance */}
                <div className="bg-white dark:bg-surface/20 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        {theme === 'dark' ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-orange-400" />} Appearance
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div
                            onClick={() => setTheme('dark')}
                            className={`border-2 bg-gray-950 rounded-lg p-4 cursor-pointer text-center transition-all ${theme === 'dark' ? 'border-primary' : 'border-transparent'}`}
                        >
                            <div className="h-2 w-full bg-gray-800 mb-2 rounded"></div>
                            <span className={`text-xs font-bold ${theme === 'dark' ? 'text-primary' : 'text-gray-400'}`}>Dark</span>
                        </div>
                        <div
                            onClick={() => setTheme('light')}
                            className={`border-2 bg-white rounded-lg p-4 cursor-pointer text-center transition-all ${theme === 'light' ? 'border-primary' : 'border-gray-200'}`}
                        >
                            <div className="h-2 w-full bg-gray-200 mb-2 rounded"></div>
                            <span className={`text-xs font-bold ${theme === 'light' ? 'text-primary' : 'text-gray-400'}`}>Light</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
