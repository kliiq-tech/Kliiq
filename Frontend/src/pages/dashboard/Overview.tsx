import { Activity, AlertTriangle, HardDrive, Monitor, Server, Users, Wifi } from 'lucide-react'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { DeviceNode } from '../../components/dashboard/DeviceNode'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export function DashboardOverview() {
    const navigate = useNavigate()
    const [devices, setDevices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) return

                const response = await fetch(`${API_URL}/devices`, {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                })
                if (response.ok) {
                    const data = await response.json()
                    // Deduplicate logic to match Devices.tsx
                    // We only want unique device names to show in the topology
                    const uniqueDevices = data.reduce((acc: any[], current: any) => {
                        const x = acc.find(item => item.name === current.name);
                        if (!x) {
                            return acc.concat([current]);
                        } else {
                            return acc;
                        }
                    }, []);
                    setDevices(uniqueDevices)
                }
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const totalCount = devices.length

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Overview</h1>
                    <p className="text-gray-500 dark:text-text-muted text-sm">Real-time infrastructure telemetry</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Devices"
                    value={totalCount.toString()}
                    subValue={`${devices.filter(d => new Date(d.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} New this week`}
                    icon={Monitor}
                />
                <StatsCard
                    title="System Health"
                    value={totalCount > 0 ? "100%" : "---"}
                    subValue="All systems operational"
                    icon={Activity}
                    status="success"
                />
                <StatsCard
                    title="Active Users"
                    value="1" // Single user for now
                    subValue="Currently online"
                    icon={Users}
                />
                <StatsCard
                    title="Compliance"
                    value="0"
                    subValue="All updates installed"
                    icon={AlertTriangle}
                    status={totalCount > 0 ? "success" : undefined}
                />
            </div>

            {/* Main Content Area - Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:h-[600px]">

                {/* Visual Map / Device Nodes */}
                <div className="lg:col-span-2 bg-gray-50/50 dark:bg-surface/20 rounded-xl border border-gray-200 dark:border-white/10 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <Server className="w-64 h-64 text-gray-900/5 dark:text-white/5 absolute -right-10 -top-10" />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Wifi className="w-5 h-5 text-primary" />
                        Network Topology
                    </h3>

                    {/* Interactive 2D Map Canvas */}
                    <div className="responsive-table-container h-full">
                        <div className="relative h-full w-full min-h-[400px] min-w-[600px] lg:min-w-0">
                            {/* Connecting Lines (Background) - Connect all to first device (Host) */}
                            {!loading && devices.length > 1 && (
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-20 transition-opacity">
                                    {devices.slice(1).map((_, i) => {
                                        const index = i + 1;
                                        const x1 = 50; // Host X center logic (index 0)
                                        const y1 = 50; // Host Y center logic (index 0)

                                        const x2 = 50 + (index % 3) * 250;
                                        const y2 = 50 + Math.floor(index / 3) * 200;

                                        // Adjust centers for line
                                        return (
                                            <line
                                                key={`line-${index}`}
                                                x1={x1 + 60} y1={y1 + 40} x2={x2 + 60} y2={y2 + 40}
                                                stroke="currentColor"
                                                className="text-gray-300 dark:text-white"
                                                strokeWidth="2"
                                                strokeDasharray="5,5"
                                            />
                                        )
                                    })}
                                </svg>
                            )}

                            {/* Nodes */}
                            {loading ? (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">Loading network map...</div>
                            ) : devices.length === 0 ? (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">No devices connected</div>
                            ) : (
                                devices.map((device, index) => {
                                    // Grid positioning
                                    const x = 50 + (index % 3) * 250;
                                    const y = 50 + Math.floor(index / 3) * 200;

                                    // Parse specs simplistic
                                    const cpu = device.specs?.split('|')[0] || 'Unknown CPU';

                                    return (
                                        <DeviceNode
                                            key={device.id}
                                            name={device.name}
                                            // Ensure valid OS type for icon logic. 'windows' gives the monitor/laptop icon usually.
                                            os={'windows'}
                                            status={device.status === 'online' ? 'online' : 'offline'}
                                            specs={{ cpu: cpu.substring(0, 15) + '...', ram: '' }}
                                            position={{ x, y }}
                                            peripherals={device.is_host ? [{ type: 'usb', label: 'Host', active: true }] : []}
                                            onClick={() => navigate('/dashboard/devices')}
                                        />
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="bg-gray-50/50 dark:bg-surface/20 rounded-xl border border-gray-200 dark:border-white/10 p-6 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-accent" />
                        Live Activity
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {devices.map((d, i) => (
                            <div key={d.id} className="flex gap-3 text-sm border-l-2 border-gray-100 dark:border-white/5 pl-4 pb-4 relative last:pb-0">
                                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-green-500"></div>
                                <div>
                                    <div className="text-xs text-gray-400 dark:text-text-muted mb-1 font-mono">Now</div>
                                    <div className="text-gray-600 dark:text-text-secondary">
                                        <span className="text-gray-900 dark:text-white font-medium">{d.name}</span> is connected and syncing.
                                    </div>
                                </div>
                            </div>
                        ))}
                        {devices.length === 0 && <span className="text-gray-500 text-sm">No recent activity.</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}
