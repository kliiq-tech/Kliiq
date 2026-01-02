import { Cpu, HardDrive, Zap, CircuitBoard, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'
import { supabase } from '../../lib/supabase'

export function DashboardHardware() {
    const [devices, setDevices] = useState<any[]>([])
    const [selectedDevice, setSelectedDevice] = useState<any>(null)
    const [isSelectorOpen, setIsSelectorOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

    useEffect(() => {
        fetchDevices()
    }, [])

    const fetchDevices = async () => {
        try {
            setLoading(true)
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const response = await fetch(`${API_URL}/devices`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch devices')
            const data = await response.json()
            setDevices(data)

            // Prioritize Lenovo/Current device if exists, else first one
            const current = data.find((d: any) => d.name.includes('Lenovo')) || data[0]
            setSelectedDevice(current)
        } catch (err) {
            console.error('Error fetching devices:', err)
        } finally {
            setLoading(false)
        }
    }

    // Helper to parse specs string: "Intel® Core™ i7-7500U | 16GB RAM | 1.1TB Disk"
    const parseSpecs = (specs: string = '') => {
        const parts = specs.split('|').map(s => s.trim())
        return {
            processor: parts[0] || 'Unknown Processor',
            memory: parts[1] || 'Unknown Memory',
            disk: parts[2] || 'Unknown Storage',
            graphics: parts[3] || ''
        }
    }

    const currentSpecs = selectedDevice ? parseSpecs(selectedDevice.specs) : {
        processor: '---',
        memory: '---',
        disk: '---',
        graphics: ''
    }

    // Fluctuating Stats Logic
    const [fluctuatingStats, setFluctuatingStats] = useState({
        usage: { cpu: 15, memory: 40, storage: 68, gpu: 5 }
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setFluctuatingStats(prev => ({
                usage: {
                    cpu: Math.max(5, Math.min(100, prev.usage.cpu + (Math.random() * 10 - 5))),
                    memory: Math.max(20, Math.min(90, prev.usage.memory + (Math.random() * 4 - 2))),
                    storage: 68, // Storage usually stable
                    gpu: Math.max(0, Math.min(100, prev.usage.gpu + (Math.random() * 15 - 7)))
                }
            }));
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, []);

    if (!selectedDevice && !loading) return <div className="p-8 text-center text-gray-500">No devices connected via telemetry.</div>

    // Dynamic Stats based on selected device
    const hardwareStats = [
        {
            name: "Processor",
            model: currentSpecs.processor,
            usage: Math.round(fluctuatingStats.usage.cpu),
            temp: 45,
            icon: Cpu,
            color: "text-blue-400"
        },
        {
            name: "Memory",
            model: currentSpecs.memory,
            usage: Math.round(fluctuatingStats.usage.memory),
            total: currentSpecs.memory, // Using the string as total for now
            icon: CircuitBoard,
            color: "text-purple-400"
        },
        {
            name: "Storage",
            model: currentSpecs.disk, // e.g., 1.1TB Disk
            usage: fluctuatingStats.usage.storage,
            total: "1.1 TB", // Could parse this regex, but keeping simple
            icon: HardDrive,
            color: "text-green-400"
        },
        {
            name: "Graphics",
            model: currentSpecs.graphics || 'Integrated',
            usage: Math.round(fluctuatingStats.usage.gpu),
            unit: "%",
            icon: Zap, // Using Zap for power/load metaphor or graphics
            color: "text-yellow-400"
        }
    ]

    return (
        <div className="space-y-8 relative">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Hardware Monitor</h1>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm border-b border-transparent">
                    Real-time telemetry for
                    <button
                        onClick={() => setIsSelectorOpen(true)}
                        className="px-3 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 hover:border-primary/50 transition-all flex items-center gap-2 text-gray-900 dark:text-white font-medium group"
                    >
                        {selectedDevice?.name || 'Select Device'}
                        <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-primary transition-colors" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hardwareStats.map((item) => (
                    <div key={item.name} className="bg-white dark:bg-zinc-800/40 border border-gray-200 dark:border-white/10 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group shadow-sm">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-white/5 ${item.color}`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-gray-900 dark:text-white font-medium">{item.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[150px] truncate" title={item.model}>{item.model}</p>
                                </div>
                            </div>
                            <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
                                {item.usage}{item.unit || '%'}
                            </div>
                        </div>

                        {/* Visual Gauge Bar */}
                        <div className="relative h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${item.name === 'Graphics' ? 'bg-yellow-400' :
                                    item.name === 'Storage' ? 'bg-green-400' :
                                        item.name === 'Memory' ? 'bg-purple-400' : 'bg-blue-400'
                                    }`}
                                style={{ width: `${item.usage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-zinc-800/40 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Peripherals</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {['Logitech MX Master 3S', 'Keychron Q1 Pro', 'Dell U2723QE', 'Focusrite Scarlett 2i2'].map((p) => (
                        <div key={p} className="p-3 bg-gray-50 dark:bg-white/5 rounded border border-gray-100 dark:border-white/5 text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between">
                            {p}
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Device Selector Dialog */}
            {isSelectorOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select Device</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Choose a device to view hardware telemetry.</p>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {devices.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => {
                                        setSelectedDevice(d)
                                        setIsSelectorOpen(false)
                                    }}
                                    className={cn(
                                        "w-full text-left p-3 rounded border flex items-center justify-between group transition-colors",
                                        selectedDevice?.id === d.id
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-white"
                                    )}
                                >
                                    <span className="text-sm font-medium">{d.name}</span>
                                    {selectedDevice?.id === d.id && <div className="w-2 h-2 rounded-full bg-primary" />}
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
