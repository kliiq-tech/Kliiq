import { HardDrive, ShieldCheck, Wifi } from 'lucide-react'

const activityLog = [
    { time: "10:42 AM", user: "Odin Dev", action: "Updated visual-studio-code", type: "software" },
    { time: "10:15 AM", user: "System", action: "Scheduled compliance scan completed", type: "security" },
    { time: "09:30 AM", user: "Design-Lead-01", action: "Device connected to Kliiq-Main-Network", type: "network" },
    { time: "Yesterday", user: "Odin Dev", action: "Modified hardware policy for Dev Group", type: "admin" },
    { time: "Yesterday", user: "Guest-Laptop-04", action: "Failed login attempt detected", type: "security_alert" },
]

export function DashboardActivity() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Activity Log</h1>
                <p className="text-gray-500 dark:text-text-muted text-sm">Audit trail of all events</p>
            </div>

            <div className="relative border-l-2 border-gray-100 dark:border-white/10 ml-3 space-y-8 py-4">
                {activityLog.map((log, i) => (
                    <div key={i} className="relative pl-8">
                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-background ${log.type === 'security_alert' ? 'bg-red-500' :
                            log.type === 'security' ? 'bg-green-500' : 'bg-primary'
                            }`}></div>

                        <div className="bg-white dark:bg-surface/20 border border-gray-200 dark:border-white/10 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm dark:shadow-none">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-mono text-gray-500 dark:text-text-muted bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
                                    {log.time}
                                </span>
                                {log.type === 'software' && <HardDrive className="w-4 h-4 text-text-muted" />}
                                {log.type === 'security' && <ShieldCheck className="w-4 h-4 text-green-400" />}
                                {log.type === 'network' && <Wifi className="w-4 h-4 text-blue-400" />}
                                {log.type === 'security_alert' && <ShieldCheck className="w-4 h-4 text-red-400" />}
                            </div>
                            <p className="text-gray-600 dark:text-text-secondary text-sm">
                                <span className="text-gray-900 dark:text-white font-medium hover:underline cursor-pointer">{log.user}</span> {log.action}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
