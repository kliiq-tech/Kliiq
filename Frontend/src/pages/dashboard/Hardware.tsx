import { Cpu, HardDrive, Zap, CircuitBoard, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'

// Mock Device List for Selector
const availableDevices = [
    { id: "DEV-001", name: "Design-Lead-01", type: "mac" },
    { id: "DEV-002", name: "Dev-Station-Alpha", type: "windows" },
    { id: "DEV-003", name: "Mobile-Test-Unit", type: "mobile" },
]

export function DashboardHardware() {
    const [selectedDevice, setSelectedDevice] = useState(availableDevices[1]) // Default to Dev-Station-Alpha
    const [isSelectorOpen, setIsSelectorOpen] = useState(false)

    // Dynamic Stats based on device (Mock logic)
    const hardwareStats = [
        {
            name: "Processor",
            model: selectedDevice.type === 'mac' ? "Apple M2 Max" : "Intel Core i9-13900K",
            usage: selectedDevice.type === 'mac' ? 12 : 24,
            temp: 45,
            icon: Cpu,
            color: "text-blue-400"
        },
        {
            name: "Memory",
            model: selectedDevice.type === 'mac' ? "Unified 32GB" : "Kingston Fury 64GB DDR5",
            usage: 42,
            total: selectedDevice.type === 'mac' ? "32 GB" : "64 GB",
            icon: CircuitBoard,
            color: "text-purple-400"
        },
        {
            name: "Storage",
            model: "Samsung 990 Pro 2TB",
            usage: 68,
            total: "2 TB",
            icon: HardDrive,
            color: "text-green-400"
        },
        {
            name: "Power Draw",
            model: "System Total",
            usage: selectedDevice.type === 'mac' ? 45 : 350,
            unit: "W",
            icon: Zap,
            color: "text-yellow-400"
        }
    ]

    return (
        <div className="space-y-8 relative">
            <div>
                <h1 className="text-2xl font-bold text-text-primary mb-1">Hardware Monitor</h1>
                <div className="flex items-center gap-2 text-text-muted text-sm border-b border-transparent">
                    Real-time telemetry for
                    <button
                        onClick={() => setIsSelectorOpen(true)}
                        className="px-3 py-1 bg-gray-100 dark:bg-surface border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 hover:border-primary/50 transition-all flex items-center gap-2 text-gray-900 dark:text-text-primary font-medium group"
                    >
                        {selectedDevice.name}
                        <ChevronDown className="w-3 h-3 text-text-muted group-hover:text-primary transition-colors" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hardwareStats.map((item) => (
                    <div key={item.name} className="bg-white dark:bg-surface/20 border border-gray-200 dark:border-white/10 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group shadow-sm dark:shadow-none">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-white/5 ${item.color}`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-gray-900 dark:text-text-primary font-medium">{item.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-text-muted">{item.model}</p>
                                </div>
                            </div>
                            <div className="text-2xl font-bold font-mono text-gray-900 dark:text-text-primary">
                                {item.usage}{item.unit || '%'}
                            </div>
                        </div>

                        {/* Visual Gauge Bar */}
                        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${item.name === 'Power Draw' ? 'bg-yellow-400' :
                                    item.name === 'Storage' ? 'bg-green-400' :
                                        item.name === 'Memory' ? 'bg-purple-400' : 'bg-blue-400'
                                    }`}
                                style={{ width: `${item.name === 'Power Draw' ? (item.usage / 850) * 100 : item.usage}%` }}
                            />
                        </div>

                        <div className="flex justify-between mt-2 text-xs text-text-muted font-mono">
                            <span>0%</span>
                            <span>{item.name === 'Power Draw' ? '850W' : '100%'}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-surface/20 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm dark:shadow-none">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">Peripherals</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {['Logitech MX Master 3S', 'Keychron Q1 Pro', 'Dell U2723QE', 'Focusrite Scarlett 2i2'].map((p) => (
                        <div key={p} className="p-3 bg-gray-50 dark:bg-white/5 rounded border border-gray-100 dark:border-white/5 text-sm text-gray-700 dark:text-text-secondary flex items-center justify-between">
                            {p}
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Device Selector Dialog */}
            {isSelectorOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-text-primary">Select Device</h3>
                        <p className="text-sm text-gray-500 dark:text-text-muted">Choose a device to view hardware telemetry.</p>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {availableDevices.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => {
                                        setSelectedDevice(d)
                                        setIsSelectorOpen(false)
                                    }}
                                    className={cn(
                                        "w-full text-left p-3 rounded border flex items-center justify-between group transition-colors",
                                        selectedDevice.id === d.id
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-text-primary"
                                    )}
                                >
                                    <span className="text-sm font-medium">{d.name}</span>
                                    {selectedDevice.id === d.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button variant="ghost" onClick={() => setIsSelectorOpen(false)}>Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
