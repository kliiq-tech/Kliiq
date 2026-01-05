import { HardDrive, ShieldCheck, Wifi, User, LogIn, AlertCircle, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export interface ActivityItem {
    time: string;
    user: string;
    action: string;
    type: 'software' | 'security' | 'network' | 'admin' | 'security_alert' | 'system' | 'profile';
    date?: string;
}

export function DashboardActivity() {
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [isProfileIncomplete, setIsProfileIncomplete] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                const user = session.user
                const isIncomplete = !user.user_metadata?.gender || !user.user_metadata?.dob || !user.user_metadata?.username
                setIsProfileIncomplete(isIncomplete)

                // Load existing activities from localStorage
                const savedActivities = JSON.parse(localStorage.getItem(`activities_${user.id}`) || '[]')

                // Add "Logged In" activity if it's a new session tab or if logs are empty
                const sessionStartLogged = sessionStorage.getItem('login_activity_logged')
                if (!sessionStartLogged) {
                    const loginActivity: ActivityItem = {
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        user: user.user_metadata?.full_name || 'User',
                        action: 'Successfully logged into Kliiq Dashboard',
                        type: 'system',
                        date: 'Today'
                    }
                    const updated = [loginActivity, ...savedActivities].slice(0, 50)
                    setActivities(updated)
                    localStorage.setItem(`activities_${user.id}`, JSON.stringify(updated))
                    sessionStorage.setItem('login_activity_logged', 'true')
                } else {
                    setActivities(savedActivities)
                }
            }
        }
        fetchUserData()
    }, [])

    const displayLogs = [...activities]

    // Prepend profile alert if incomplete
    if (isProfileIncomplete) {
        displayLogs.unshift({
            time: "Action Required",
            user: "Security System",
            action: "Please complete your profile in Settings",
            type: "security_alert",
            date: "Now"
        })
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Activity Log</h1>
                <p className="text-gray-500 dark:text-text-muted text-sm">Audit trail of all events</p>
            </div>

            {displayLogs.length === 0 ? (
                <div className="bg-white dark:bg-surface/20 border border-dashed border-gray-200 dark:border-white/10 rounded-xl p-12 text-center">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-gray-900 dark:text-white font-medium mb-1">No activity yet</h3>
                    <p className="text-gray-500 dark:text-text-muted text-sm">Actions like profile updates or system alerts will appear here.</p>
                </div>
            ) : (
                <div className="relative border-l-2 border-gray-100 dark:border-white/10 ml-3 space-y-8 py-4">
                    {displayLogs.map((log, i) => (
                        <div key={i} className="relative pl-8 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-background ${log.type === 'security_alert' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' :
                                log.type === 'security' || log.type === 'system' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' :
                                    log.type === 'profile' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]' :
                                        'bg-primary'
                                }`}></div>

                            <div className="bg-white dark:bg-surface/20 border border-gray-200 dark:border-white/10 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm dark:shadow-none group border-l-4 border-l-transparent hover:border-l-primary">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
                                        {log.time}
                                    </span>
                                    {log.type === 'software' && <HardDrive className="w-4 h-4 text-text-muted" />}
                                    {log.type === 'security' && <ShieldCheck className="w-4 h-4 text-green-400" />}
                                    {log.type === 'network' && <Wifi className="w-4 h-4 text-blue-400" />}
                                    {log.type === 'security_alert' && <AlertCircle className="w-4 h-4 text-red-500" />}
                                    {log.type === 'system' && <LogIn className="w-4 h-4 text-green-400" />}
                                    {log.type === 'profile' && <User className="w-4 h-4 text-purple-400" />}
                                </div>
                                <p className="text-gray-600 dark:text-text-secondary text-sm">
                                    <span className="text-gray-900 dark:text-white font-bold">{log.user === 'Security System' ? 'System' : log.user}</span> {log.action}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
