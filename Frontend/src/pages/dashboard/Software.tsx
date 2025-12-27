import { ShieldCheck, DownloadCloud, AlertCircle, Clock } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const softwareList = [
    {
        name: "Adobe Creative Cloud",
        version: "2024.1.0",
        status: "up-to-date",
        lastCheck: "2 mins ago",
        domain: "adobe.com"
    },
    {
        name: "Visual Studio Code",
        version: "1.85.1",
        status: "update-available",
        newVersion: "1.86.0",
        lastCheck: "10 mins ago",
        domain: "code.visualstudio.com"
    },
    {
        name: "Docker Desktop",
        version: "4.26.0",
        status: "up-to-date",
        lastCheck: "1 hour ago",
        domain: "docker.com"
    },
    {
        name: "Slack",
        version: "4.35.121",
        status: "warning",
        message: "Policy restriction",
        lastCheck: "3 hours ago",
        domain: "slack.com"
    }
]

export function DashboardSoftware() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Software Compliance</h1>
                    <p className="text-gray-500 dark:text-text-muted text-sm border-b border-transparent">Real-time infrastructure compliance status</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button size="sm" className="gap-2">
                        <DownloadCloud className="w-4 h-4" />
                        Scan All Nodes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-surface/20 border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm dark:shadow-none">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                        <ShieldCheck className="w-6 h-6 text-green-500 dark:text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">98%</div>
                    <div className="text-sm text-gray-500 dark:text-text-muted">Compliance Score</div>
                </div>
                <div className="bg-white dark:bg-surface/20 border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm dark:shadow-none">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                        <DownloadCloud className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">4</div>
                    <div className="text-sm text-gray-500 dark:text-text-muted">Updates Pending</div>
                </div>
                <div className="bg-white dark:bg-surface/20 border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm dark:shadow-none">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">1</div>
                    <div className="text-sm text-gray-500 dark:text-text-muted">Policy Warning</div>
                </div>
            </div>

            <div className="bg-white dark:bg-surface/20 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
                <div className="p-4 border-b border-gray-100 dark:border-white/10 font-semibold text-gray-500 dark:text-text-muted text-xs uppercase tracking-wider">
                    Installed Packs
                </div>
                <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {softwareList.map((sw) => (
                        <div key={sw.name} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-white/10 flex-shrink-0">
                                    <img
                                        src={`https://www.google.com/s2/favicons?domain=${sw.domain}&sz=128`}
                                        alt={sw.name}
                                        className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 transition-all"
                                    />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        {sw.name}
                                        {sw.status === 'warning' && <AlertCircle className="w-3 h-3 text-yellow-500" />}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-text-muted">v{sw.version}</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                                <div className="text-right">
                                    <div className={`text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full border ${sw.status === 'up-to-date' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' :
                                        sw.status === 'update-available' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
                                            'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
                                        }`}>
                                        {sw.status === 'up-to-date' ? 'Up to date' :
                                            sw.status === 'update-available' ? `Update to v${sw.newVersion}` : 'Policy Warning'}
                                    </div>
                                </div>
                                <div className="text-[10px] sm:text-xs text-text-muted font-mono sm:w-24 text-right flex items-center justify-end gap-1">
                                    <Clock className="w-3 h-3" /> {sw.lastCheck}
                                </div>

                                <div className="flex items-center gap-2 sm:ml-4">
                                    <button className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">Update</button>
                                    <span className="text-gray-300 dark:text-white/10">|</span>
                                    <button className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:hover:text-white">Repair</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
