import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'
import { Bell, Moon, Sun, User, Lock, X } from 'lucide-react'
import { useTheme } from '../../components/theme-provider'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

// Alias for internal use to avoid collision with Lucide User icon
type User = SupabaseUser;

export function DashboardSettings() {
    const { theme, setTheme } = useTheme()
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [adminPassword, setAdminPassword] = useState('')
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
    const [user, setUser] = useState<User | null>(null)
    const [editData, setEditData] = useState({
        full_name: '',
        nickname: '',
        gender: '',
        dob: '',
        email: '',
        username: '',
        avatar_url: ''
    })

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUser(session.user)
                setEditData({
                    full_name: session.user.user_metadata?.full_name || 'Miracle Iwunze',
                    nickname: session.user.user_metadata?.nickname || 'Miracle',
                    gender: session.user.user_metadata?.gender || '',
                    dob: session.user.user_metadata?.dob || '',
                    email: session.user.email || '',
                    username: session.user.user_metadata?.username || 'miracle',
                    avatar_url: session.user.user_metadata?.avatar_url || ''
                })
            }
        })
    }, [])

    const handleUpdateProfile = async () => {
        setSaveStatus('saving')
        try {
            const { error } = await supabase.auth.updateUser({
                email: editData.email,
                data: {
                    full_name: editData.full_name,
                    nickname: editData.nickname,
                    gender: editData.gender,
                    dob: editData.dob,
                    username: editData.username.toLowerCase().replace(/[^a-z0-9]/g, ''),
                    avatar_url: editData.avatar_url
                }
            })

            if (error) throw error

            // Update local user state
            const { data: { user: updatedUser } } = await supabase.auth.getUser()
            setUser(updatedUser)

            // Log activity
            if (updatedUser) {
                const savedActivities = JSON.parse(localStorage.getItem(`activities_${updatedUser.id}`) || '[]')
                const newActivity = {
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    user: updatedUser.user_metadata?.nickname || updatedUser.user_metadata?.full_name || 'User',
                    action: 'updated their user profile',
                    type: 'profile',
                    date: 'Today'
                }
                const updated = [newActivity, ...savedActivities].slice(0, 50)
                localStorage.setItem(`activities_${updatedUser.id}`, JSON.stringify(updated))
            }

            setSaveStatus('success')
            setTimeout(() => {
                setIsProfileModalOpen(false)
                setSaveStatus('idle')
            }, 1000)
        } catch (error: any) {
            console.error('Error:', error)
            setSaveStatus('error')
            alert(error.message)
        }
    }

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

    const AVATARS = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    ]

    const isProfileIncomplete = !user?.user_metadata?.gender || !user?.user_metadata?.dob

    return (
        <div className="max-w-2xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Settings</h1>
                    <p className="text-gray-500 dark:text-text-muted text-sm">Manage your account and dashboard preferences</p>
                </div>
                {isProfileIncomplete && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-xs font-bold animate-pulse">
                        <User className="w-3 h-3" /> Profile Incomplete
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-white dark:bg-surface/20 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" /> Profile
                    </h3>
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-primary-end flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/20 flex-shrink-0 overflow-hidden border-2 border-white/10">
                                    {user?.user_metadata?.avatar_url ? (
                                        <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>
                                            {(user?.user_metadata?.full_name || 'Miracle Iwunze')
                                                .split(' ')
                                                .map((n: string) => n[0])
                                                .join('')
                                                .substring(0, 2)}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-gray-900 dark:text-white">{user?.user_metadata?.full_name || 'Miracle Iwunze'}</div>
                                    <div className="text-sm text-gray-400 font-medium">@{user?.user_metadata?.username || 'miracle'}</div>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="sm:ml-auto border-gray-200 dark:border-white/10 text-gray-900 dark:text-white h-10 px-6 sm:h-9 sm:px-3"
                                onClick={() => setIsProfileModalOpen(true)}
                            >
                                Edit Profile
                            </Button>
                        </div>

                        {/* Profile Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 dark:border-white/5 pt-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nickname</label>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.user_metadata?.nickname || '--'}</div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.email || '--'}</div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Gender</label>
                                <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">{user?.user_metadata?.gender || '--'}</div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date of Birth</label>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.user_metadata?.dob || '--'}</div>
                            </div>
                        </div>
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
            {/* Edit Profile Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h3>
                            <button onClick={() => setIsProfileModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Avatar Picker */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Profile Picture</label>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                    {editData.avatar_url ? (
                                        <img src={editData.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 flex-1">
                                    {AVATARS.map((url, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setEditData(prev => ({ ...prev, avatar_url: url }))}
                                            className={cn(
                                                "w-10 h-10 rounded-full border-2 transition-all overflow-hidden",
                                                editData.avatar_url === url ? "border-primary scale-110" : "border-transparent opacity-50 hover:opacity-100"
                                            )}
                                        >
                                            <img src={url} alt="" className="w-full h-full" />
                                        </button>
                                    ))}
                                    <label className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 dark:border-white/20 flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                        <span className="text-xl text-gray-400 group-hover:text-primary">+</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setEditData(prev => ({ ...prev, avatar_url: reader.result as string }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                                <input
                                    type="text"
                                    value={editData.full_name}
                                    onChange={(e) => setEditData(prev => ({ ...prev, full_name: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nickname</label>
                                <input
                                    type="text"
                                    value={editData.nickname}
                                    onChange={(e) => setEditData(prev => ({ ...prev, nickname: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                                <input
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">User Tag (@kliiq)</label>
                                <input
                                    type="text"
                                    value={editData.username}
                                    onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') }))}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Gender</label>
                                <select
                                    value={editData.gender}
                                    onChange={(e) => setEditData(prev => ({ ...prev, gender: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Date of Birth</label>
                                <input
                                    type="date"
                                    value={editData.dob}
                                    onChange={(e) => setEditData(prev => ({ ...prev, dob: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
                            <Button variant="ghost" className="flex-1" onClick={() => setIsProfileModalOpen(false)}>Cancel</Button>
                            <Button
                                onClick={handleUpdateProfile}
                                disabled={saveStatus === 'saving'}
                                className={cn("flex-1", saveStatus === 'success' && "bg-green-500 hover:bg-green-600")}
                            >
                                {saveStatus === 'saving' ? 'Updating...' : saveStatus === 'success' ? 'Updated!' : 'Save Profile'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
