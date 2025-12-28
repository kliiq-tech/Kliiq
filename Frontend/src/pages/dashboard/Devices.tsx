import { Laptop, Search, Filter, MoreVertical, RefreshCw, Smartphone, Monitor, Shield, Trash2, Key } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

// Mock Data for Assigned Devices
const initialDevices = [
    {
        id: "DEV-001",
        name: "Design-Lead-01",
        type: "desktop",
        os: "macOS Sonoma",
        status: "online",
        lastSync: "2 mins ago",
        specs: "M2 Max / 32GB RAM",
        user: "Odin Dev",
        isHost: false
    },
    {
        id: "DEV-002",
        name: "Dev-Station-Alpha",
        type: "desktop",
        os: "Windows 11 Pro",
        status: "warning",
        lastSync: "5 mins ago",
        specs: "i9-13900K / 64GB RAM",
        user: "Odin Dev",
        isHost: true
    },
    {
        id: "DEV-003",
        name: "Mobile-Test-Unit",
        type: "mobile",
        os: "Android 14",
        status: "offline",
        lastSync: "2 hours ago",
        specs: "Pixel 8 / 12GB RAM",
        user: "Odin Dev",
        isHost: false
    },
    {
        id: "DEV-004",
        name: "Guest-Laptop-04",
        type: "laptop",
        os: "Windows 10",
        status: "offline",
        lastSync: "1 day ago",
        specs: "i5-12400 / 16GB RAM",
        user: "Odin Dev",
        isHost: false
    }
]

export function DashboardDevices() {
    const [devices, setDevices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionState, setActionState] = useState<{
        type: 'change_host' | 'remove' | null,
        targetId: string | null,
        step: 'confirm' | 'password' | 'select_host'
    }>({ type: null, targetId: null, step: 'confirm' })
    const [password, setPassword] = useState("")
    const [selectedHostId, setSelectedHostId] = useState<string | null>(null)

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

    useEffect(() => {
        fetchDevices()
    }, [])

    const fetchDevices = async () => {
        try {
            setLoading(true)
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error('Not authenticated')

            const response = await fetch(`${API_URL}/devices`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            })
            if (!response.ok) throw new Error('Failed to fetch devices')
            const data = await response.json()
            setDevices(data)
            setError(null)
        } catch (err: any) {
            setError(err.message)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Helper to find device by ID
    const getDevice = (id: string | null) => devices.find(d => d.id === id)

    // Handlers
    const handleAction = (type: 'change_host' | 'remove', id: string) => {
        const device = getDevice(id)
        if (!device) return

        if (type === 'change_host') {
            setActionState({ type, targetId: id, step: 'select_host' })
        } else if (type === 'remove') {
            if (device.is_host) {
                setActionState({ type, targetId: id, step: 'password' }) // Direct to password for host removal
            } else {
                // Non-host: still confirming for persistence
                setActionState({ type, targetId: id, step: 'password' })
            }
        }
    }

    const handleHostSelection = (newHostId: string) => {
        setSelectedHostId(newHostId)
        setActionState(prev => ({ ...prev, step: 'password' }))
    }

    const confirmAction = async () => {
        // Mock Password Check
        if (password !== 'admin') {
            alert("Incorrect Password (Try 'admin')")
            return
        }

        try {
            if (actionState.type === 'change_host' && selectedHostId) {
                // Promotion logic: Update the new host in the database
                const response = await fetch(`${API_URL}/devices/${selectedHostId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_host: true })
                })
                if (!response.ok) throw new Error('Failed to change host')
            } else if (actionState.type === 'remove' && actionState.targetId) {
                const response = await fetch(`${API_URL}/devices/${actionState.targetId}`, {
                    method: 'DELETE'
                })
                if (!response.ok) throw new Error('Failed to remove device')
            }

            // Re-fetch to get fresh state from DB
            await fetchDevices()
        } catch (err: any) {
            alert(err.message)
        }

        // Reset
        setActionState({ type: null, targetId: null, step: 'confirm' })
        setPassword("")
        setSelectedHostId(null)
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">Assigned Devices</h1>
                    <p className="text-gray-500 dark:text-text-muted text-sm">Manage hardware assigned to <span className="text-gray-900 dark:text-text-primary font-medium">Odin Dev</span> (Admin)</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Sync All
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex items-center gap-4 bg-gray-100 dark:bg-surface/20 p-2 rounded-lg border border-gray-200 dark:border-white/5">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-text-muted" />
                    <input
                        id="device-search-input"
                        type="text"
                        autoComplete="off"
                        placeholder="Search devices..."
                        className="w-full bg-white dark:bg-white/5 border-none rounded pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-text-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-text-muted/50"
                    />
                </div>
                <Button variant="ghost" size="sm" className="gap-2 text-gray-500 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary">
                    <Filter className="w-4 h-4" />
                    Filter
                </Button>
            </div>

            {/* Devices List Table Style */}
            <div className="bg-white dark:bg-surface/20 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden min-h-[400px] shadow-sm dark:shadow-none">
                <div className="responsive-table-container">
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 dark:border-white/10 text-xs font-semibold text-gray-500 dark:text-text-muted uppercase tracking-wider">
                            <div className="col-span-4">Device Name</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-3">OS & Specs</div>
                            <div className="col-span-2">Last Sync</div>
                            <div className="col-span-1 text-right">Actions</div>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-white/5">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500 animate-pulse">
                                    Fetching infrastructure telemetry...
                                </div>
                            ) : error ? (
                                <div className="p-8 text-center text-red-500">
                                    {error}. Is the backend running?
                                </div>
                            ) : devices.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No devices identified in this namespace.
                                </div>
                            ) : (
                                devices.map((device) => (
                                    <div key={device.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative">
                                        {/* Device Info */}
                                        <div className="col-span-4 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-text-muted group-hover:text-primary transition-colors">
                                                {device.type === 'mobile' ? <Smartphone className="w-5 h-5" /> :
                                                    device.type === 'laptop' ? <Laptop className="w-5 h-5" /> :
                                                        <Monitor className="w-5 h-5" />}
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-text-primary">{device.name}</div>
                                                    {device.is_host && (
                                                        <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-1.5 rounded uppercase tracking-wider">
                                                            (Host)
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-400 dark:text-text-muted">UID: {device.id}</div>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-2">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border",
                                                device.status === 'online' ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" :
                                                    device.status === 'warning' ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" :
                                                        "bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20"
                                            )}>
                                                <span className={cn("w-1.5 h-1.5 rounded-full",
                                                    device.status === 'online' ? "bg-green-500 dark:bg-green-400" :
                                                        device.status === 'warning' ? "bg-yellow-500 dark:bg-yellow-400" :
                                                            "bg-gray-500 dark:bg-gray-400"
                                                )} />
                                                {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                                            </div>
                                        </div>

                                        {/* OS */}
                                        <div className="col-span-3">
                                            <div className="text-sm text-gray-700 dark:text-text-primary/80">{device.os}</div>
                                            <div className="text-xs text-gray-400 dark:text-text-muted">{device.specs}</div>
                                        </div>

                                        {/* Sync */}
                                        <div className="col-span-2 text-sm text-gray-500 dark:text-text-muted font-mono">
                                            {device.last_sync ? new Date(device.last_sync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-1 text-right flex justify-end relative group/menu">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-white/10 peer">
                                                <MoreVertical className="w-4 h-4 text-gray-400 dark:text-text-muted" />
                                            </Button>
                                            {/* Dropdown Menu */}
                                            <div className="absolute right-8 top-0 w-48 bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-lg shadow-xl py-1 hidden group-hover/menu:block hover:block z-10 peer-focus:block">
                                                <button
                                                    onClick={() => handleAction('change_host', device.id)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                                                >
                                                    <Shield className="w-4 h-4" /> Change Host
                                                </button>
                                                <button
                                                    onClick={() => handleAction('remove', device.id)}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Remove Device
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Dialog / Modal */}
            {actionState.type && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-text-primary">
                            {actionState.type === 'change_host' ? 'Change Host Device' : 'Remove Device'}
                        </h3>

                        {actionState.step === 'select_host' && (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500 dark:text-text-muted">Select the device you want to promote to Host:</p>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {devices.map(d => (
                                        <button
                                            key={d.id}
                                            onClick={() => handleHostSelection(d.id)}
                                            className="w-full text-left p-3 rounded border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-between group"
                                        >
                                            <span className="text-sm text-gray-900 dark:text-text-primary">{d.name}</span>
                                            {d.isHost && <span className="text-xs text-primary">(Current Host)</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {actionState.step === 'password' && (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-500 dark:text-text-muted">
                                    {actionState.type === 'remove'
                                        ? "This critical action requires Admin verification."
                                        : "Confirm host change with Admin password."}
                                </p>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-text-muted" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded pl-10 pr-4 py-2 text-gray-900 dark:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="Enter Admin Password"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="ghost" onClick={() => setActionState({ type: null, targetId: null, step: 'confirm' })}>Cancel</Button>
                            {actionState.step === 'password' && (
                                <Button onClick={confirmAction} className={actionState.type === 'remove' ? "bg-red-500 hover:bg-red-600" : ""}>
                                    {actionState.type === 'remove' ? 'Confirm Removal' : 'Confirm Change'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
