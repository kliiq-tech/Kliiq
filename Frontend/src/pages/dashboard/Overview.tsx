import { Activity, AlertTriangle, HardDrive, Monitor, Server, Users, Wifi } from 'lucide-react'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { DeviceNode } from '../../components/dashboard/DeviceNode'
import { useNavigate } from 'react-router-dom'


export function DashboardOverview() {
    const navigate = useNavigate()

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
                    value="124"
                    subValue="8 New this week"
                    icon={Monitor}
                />
                <StatsCard
                    title="System Health"
                    value="98.2%"
                    subValue="All systems operational"
                    icon={Activity}
                    status="success"
                />
                <StatsCard
                    title="Active Users"
                    value="86"
                    subValue="Currently online"
                    icon={Users}
                />
                <StatsCard
                    title="Compliance"
                    value="12"
                    subValue="Critical Updates Pending"
                    icon={AlertTriangle}
                    status="warning"
                />
            </div>

            {/* Main Content Area - Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">

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
                    <div className="relative h-full w-full min-h-[400px]">
                        {/* Connecting Lines (Background) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-20 transition-opacity">
                            <line x1="150" y1="120" x2="400" y2="120" stroke="currentColor" className="text-gray-300 dark:text-white" strokeWidth="2" strokeDasharray="5,5" />
                            <line x1="150" y1="120" x2="150" y2="300" stroke="currentColor" className="text-gray-300 dark:text-white" strokeWidth="2" strokeDasharray="5,5" />
                            <line x1="400" y1="120" x2="400" y2="300" stroke="currentColor" className="text-gray-300 dark:text-white" strokeWidth="1" />
                        </svg>

                        <DeviceNode
                            name="Design-Lead-01"
                            os="mac"
                            status="online"
                            specs={{ cpu: "M2 Max", ram: "32GB" }}
                            position={{ x: 50, y: 50 }}
                            peripherals={[
                                { type: 'monitor', label: 'Studio Display', active: true }
                            ]}
                            onClick={() => navigate('/dashboard/devices')}
                        />

                        <DeviceNode
                            name="Dev-Station-Alpha"
                            os="windows"
                            status="warning"
                            specs={{ cpu: "i9-13900K", ram: "64GB" }}
                            position={{ x: 350, y: 50 }}
                            peripherals={[
                                { type: 'usb', label: 'Security Key', active: true },
                                { type: 'drive', label: 'Backup SSD', active: false }
                            ]}
                            onClick={() => navigate('/dashboard/devices')}
                        />

                        <DeviceNode
                            name="Finance-Server"
                            os="linux"
                            status="online"
                            specs={{ cpu: "Xeon Gold", ram: "128GB" }}
                            position={{ x: 50, y: 250 }}
                        />

                        <DeviceNode
                            name="Guest-Laptop-04"
                            os="windows"
                            status="offline"
                            specs={{ cpu: "i5-12400", ram: "16GB" }}
                            position={{ x: 350, y: 250 }}
                        />
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="bg-gray-50/50 dark:bg-surface/20 rounded-xl border border-gray-200 dark:border-white/10 p-6 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-accent" />
                        Live Activity
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex gap-3 text-sm border-l-2 border-gray-100 dark:border-white/5 pl-4 pb-4 relative last:pb-0">
                                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-gray-200 dark:bg-white/20"></div>
                                <div>
                                    <div className="text-xs text-gray-400 dark:text-text-muted mb-1 font-mono">09:4{5 - i} AM</div>
                                    <div className="text-gray-600 dark:text-text-secondary">
                                        <span className="text-gray-900 dark:text-white font-medium">Device-{100 + i}</span> initiated software update pack <span className="text-primary">v2.1</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
