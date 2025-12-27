import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

interface StatsCardProps {
    title: string
    value: string
    subValue?: string
    icon: LucideIcon
    status?: 'normal' | 'warning' | 'error' | 'success'
    trend?: string
}

export function StatsCard({ title, value, subValue, icon: Icon, status = 'normal', trend }: StatsCardProps) {
    const statusColors = {
        normal: "text-primary",
        warning: "text-yellow-500",
        error: "text-red-500",
        success: "text-green-500",
    }

    const borderColors = {
        normal: "border-gray-200 dark:border-white/10 hover:border-primary/50",
        warning: "border-gray-200 dark:border-white/10 hover:border-yellow-500/50",
        error: "border-gray-200 dark:border-white/10 hover:border-red-500/50",
        success: "border-gray-200 dark:border-white/10 hover:border-green-500/50",
    }

    return (
        <div className={cn(
            "p-5 rounded-xl border bg-white dark:bg-surface/30 backdrop-blur-sm transition-all duration-300 group shadow-sm dark:shadow-none",
            borderColors[status]
        )}>
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-colors", statusColors[status])}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <span className="text-xs font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded">
                        {trend}
                    </span>
                )}
            </div>

            <div className="space-y-1">
                <h3 className="text-gray-500 dark:text-text-muted text-sm font-medium uppercase tracking-wide">{title}</h3>
                <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</div>
                {subValue && (
                    <p className="text-xs text-gray-400 dark:text-text-muted">{subValue}</p>
                )}
            </div>
        </div>
    )
}
