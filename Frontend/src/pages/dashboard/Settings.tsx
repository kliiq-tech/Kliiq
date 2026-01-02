import { Button } from '../../components/ui/Button'
import { Bell, Moon, Sun, User, Lock } from 'lucide-react'
import { useTheme } from '../../components/theme-provider'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export function DashboardSettings() {
    const { theme, setTheme } = useTheme()
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [adminPassword, setAdminPassword] = useState('')
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

    const handleSaveAdminPassword = async () => {
        setSaveStatus('saving')
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error('Not authenticated')

            const response = await fetch(`${API_URL}/settings/admin-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ password: adminPassword })
            })

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorMessage = 'Failed to set password';
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } else {
                    errorMessage = `Server Error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            setSaveStatus('success')
            setIsPasswordModalOpen(false)
            setSaveStatus('idle')
            setAdminPassword('')
            alert("Admin Password set successfully!")
        } catch (error: any) {
            console.error('Error:', error)
            setSaveStatus('error')
            alert(error.message)
        }
    }

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
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-primary-end flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-primary/20 flex-shrink-0">
                                OD
                            </div>
                            <div>
                                <div className="font-bold text-gray-900 dark:text-white">Odin Dev</div>
                                <div className="text-sm text-gray-500 dark:text-text-muted">odin@kliiq.io</div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="sm:ml-auto border-gray-200 dark:border-white/10 text-gray-900 dark:text-white h-10 px-6 sm:h-9 sm:px-3">Edit Profile</Button>
                    </div>
                </div>

                {/* Privacy & Security */}
                <div className="bg-white dark:bg-surface/20 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-blue-500" /> Privacy & Security
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                        <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">Admin Password</div>
                            <div className="text-xs text-gray-500 dark:text-text-muted mt-1">Required for host switching and critical system changes</div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(true)}>
                            Change
                        </Button>
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

            {/* Admin Password Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Set Admin Password</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter a secure password to use for admin actions.
                        </p>

                        <input
                            type="password"
                            placeholder="New Admin Password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="ghost" onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
                            <Button
                                onClick={handleSaveAdminPassword}
                                disabled={!adminPassword || saveStatus === 'saving' || saveStatus === 'success'}
                                className={saveStatus === 'success' ? 'bg-green-500 hover:bg-green-600' : ''}
                            >
                                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save Password'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
