import { Laptop, Cpu, HardDrive, Monitor, Usb, Apple, Terminal } from 'lucide-react'
import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface HardwareProps {
    type: 'usb' | 'monitor' | 'network' | 'drive'
    active?: boolean
    label?: string
}

interface DeviceNodeProps {
    name: string
    os: 'windows' | 'mac' | 'linux'
    status: 'online' | 'offline' | 'warning'
    specs: {
        cpu: string
        ram: string
    }
    peripherals?: HardwareProps[]
    position: { x: number, y: number }
    onClick?: () => void
}

export function DeviceNode({ name, os, status, specs, peripherals = [], position, onClick }: DeviceNodeProps) {
    const [isHovered, setIsHovered] = useState(false)

    const statusColors = {
        online: "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]",
        offline: "bg-gray-500",
        warning: "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]",
    }

    const osIcons = {
        windows: Monitor,
        mac: Apple,
        linux: Terminal
    }

    const OSIcon = osIcons[os] || Laptop

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("absolute", onClick && "cursor-pointer")}
            style={{ left: position.x, top: position.y }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Connection Lines (Removed floating logic for better organization) */}

            {/* Main Node Card */}
            <div className={cn(
                "w-48 bg-white dark:bg-background border border-gray-200 dark:border-white/10 rounded-lg p-3 relative z-10 transition-all duration-300 shadow-sm dark:shadow-none",
                isHovered && "border-primary/50 shadow-lg shadow-primary/10 scale-105"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-gray-100 dark:bg-white/5">
                            <OSIcon className="w-4 h-4 text-gray-900 dark:text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{name}</span>
                    </div>
                    <div className={cn("w-2 h-2 rounded-full", statusColors[status])} />
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-text-muted">
                        <Cpu className="w-3 h-3 text-primary" />
                        {specs.cpu}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-text-muted">
                        <HardDrive className="w-3 h-3 text-accent" />
                        {specs.ram}
                    </div>
                </div>

                {/* Peripherals List (Now internal to prevent overlap) */}
                {peripherals.length > 0 && (
                    <div className="pt-2 border-t border-gray-100 dark:border-white/5 space-y-1.5">
                        {peripherals.map((p, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex items-center justify-between text-[9px] px-1.5 py-1 rounded transition-colors",
                                    p.active
                                        ? "bg-primary/5 text-primary border border-primary/10"
                                        : "text-gray-400 dark:text-text-muted bg-gray-50 dark:bg-white/5 border border-transparent"
                                )}
                            >
                                <div className="flex items-center gap-1.5 truncate">
                                    {p.type === 'usb' && <Usb className="w-2.5 h-2.5" />}
                                    {p.type === 'monitor' && <Monitor className="w-2.5 h-2.5" />}
                                    {p.type === 'drive' && <HardDrive className="w-2.5 h-2.5" />}
                                    <span className="truncate">{p.label}</span>
                                </div>
                                {p.active && <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />}
                            </div>
                        ))}
                    </div>
                )}

                {/* Status Warning Overlay */}
                {status === 'warning' && (
                    <div className="absolute -top-1 -right-1">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
