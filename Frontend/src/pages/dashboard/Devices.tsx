import { Laptop, Search, Filter, MoreVertical, RefreshCw, Smartphone, Monitor, Shield, Trash2, Key } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'

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

    const initializationRef = useRef(false);

    useEffect(() => {
        if (!initializationRef.current) {
            initializationRef.current = true;
            initializeDevice();
        }
    }, []);

    const initializeDevice = async () => {
        // Dynamic Detection
        let deviceId = localStorage.getItem('kliiq_device_id');
        let deviceName = localStorage.getItem('kliiq_device_name');
        let deviceType = localStorage.getItem('kliiq_device_type');
        let deviceOS = localStorage.getItem('kliiq_device_os');

        if (!deviceId) {
            deviceId = 'DEV-' + Math.random().toString(36).substr(2, 6).toUpperCase();

            const ua = navigator.userAgent;
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
            deviceType = isMobile ? 'mobile' : 'laptop';

            // Simple OS Detection
            if (ua.indexOf("Win") !== -1) deviceOS = "Windows 11";
            else if (ua.indexOf("Mac") !== -1) deviceOS = "macOS";
            else if (ua.indexOf("Linux") !== -1) deviceOS = "Linux";
            else if (ua.indexOf("Android") !== -1) deviceOS = "Android";
            else if (ua.indexOf("like Mac") !== -1) deviceOS = "iOS";
            else deviceOS = "Unknown OS";

            const browser = ua.indexOf("Chrome") !== -1 ? "Chrome" : ua.indexOf("Firefox") !== -1 ? "Firefox" : "Browser";
            deviceName = `${browser} on ${deviceOS} (${deviceId.substring(4)})`;

            localStorage.setItem('kliiq_device_id', deviceId);
            localStorage.setItem('kliiq_device_name', deviceName);
            localStorage.setItem('kliiq_device_type', deviceType);
            localStorage.setItem('kliiq_device_os', deviceOS);
        }

        const currentSpecs = {
            id: deviceId, // Note: ID in DB might be different if DB ignores this, but we use Name for dedupe currently
            name: deviceName,
            type: deviceType,
            os: deviceOS,
            specs: 'Web Agent | ' + navigator.hardwareConcurrency + ' Cores'
        };

        await fetchDevices(currentSpecs);
    };

    const fetchDevices = async (currentSpecs?: any) => {
        try {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not authenticated');

            const response = await fetch(`${API_URL}/devices`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch devices');
            const data = await response.json();

            // Real-time Agent Logic
            if (currentSpecs) {
                // Check if THIS specific browser instance is registered
                // We trust local storage name as the "Identity"
                const currentDeviceExists = data.find((d: any) => d.name === currentSpecs.name);

                if (!currentDeviceExists) {
                    // Check if this is the FIRST device ever
                    const isFirstDevice = data.length === 0;

                    await fetch(`${API_URL}/devices`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${session.access_token}`
                        },
                        body: JSON.stringify({
                            name: currentSpecs.name,
                            type: currentSpecs.type,
                            os: currentSpecs.os,
                            specs: currentSpecs.specs,
                            is_host: isFirstDevice
                        })
                    });
                    // Re-fetch
                    const refreshHelper = await fetch(`${API_URL}/devices`, {
                        headers: { 'Authorization': `Bearer ${session.access_token}` }
                    });
                    const refreshData = await refreshHelper.json();
                    setDevices(refreshData);
                } else {
                    // CHECK FOR NO HOST: If no device is host, auto-promote the current one
                    const hostExists = data.some((d: any) => d.is_host);
                    if (!hostExists) {
                        const myDevice = data.find((d: any) => d.name === currentSpecs.name);
                        if (myDevice) {
                            await fetch(`${API_URL}/devices/${myDevice.id}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${session.access_token}`
                                },
                                body: JSON.stringify({ is_host: true })
                            });
                            // Refresh logic to show the update immediately
                            const refreshResponse = await fetch(`${API_URL}/devices`, {
                                headers: { 'Authorization': `Bearer ${session.access_token}` }
                            });
                            const refreshData = await refreshResponse.json();
                            setDevices(refreshData);
                            return;
                        }
                    }
                    setDevices(data);
                }
            } else {
                setDevices(data);
            }

            setError(null);
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not authenticated');

            // Verify Password with Backend
            const verifyResponse = await fetch(`${API_URL}/settings/verify-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ password })
            });

            if (!verifyResponse.ok) {
                const contentType = verifyResponse.headers.get("content-type");
                let errorMessage = 'Password verification failed';
                if (contentType && contentType.includes("application/json")) {
                    const errData = await verifyResponse.json();
                    errorMessage = errData.error || errorMessage;
                } else {
                    errorMessage = `Server Error: ${verifyResponse.status} (Is backend running and updated?)`;
                }
                throw new Error(errorMessage);
            }

            // Optimistic Update
            let newDevices = [...devices];

            if (actionState.type === 'change_host' && selectedHostId) {
                // Optimistically update
                newDevices = newDevices.map(d => ({
                    ...d,
                    is_host: d.id === selectedHostId
                }));
                // Force update UI immediately
                setDevices(newDevices);

                const response = await fetch(`${API_URL}/devices/${selectedHostId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify({ is_host: true })
                })
                if (!response.ok) {
                    // Revert if failed
                    await fetchDevices();
                    throw new Error('Failed to change host')
                }
            } else if (actionState.type === 'remove' && actionState.targetId) {
                // Optimistically update
                newDevices = newDevices.filter(d => d.id !== actionState.targetId);
                setDevices(newDevices);

                const response = await fetch(`${API_URL}/devices/${actionState.targetId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                })
                if (!response.ok) {
                    // Revert if failed
                    await fetchDevices();
                    throw new Error('Failed to remove device')
                }
            }

            // No need to refetch immediately if successful, state is already correct
            // await fetchDevices()
        } catch (err: any) {
            alert(err.message)
        }

        // Reset
        setActionState({ type: null, targetId: null, step: 'confirm' })
        setPassword("")
        setSelectedHostId(null)
    }

    // internal component for actions menu to avoid repetition and fix layout
    const DeviceActionsMenu = ({ device, handleAction }: { device: any, handleAction: any }) => (
        <div className="relative group/menu">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-white/10 peer">
                <MoreVertical className="w-4 h-4 text-gray-400 dark:text-text-muted" />
            </Button>
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-8 w-48 bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-lg shadow-xl py-1 hidden group-hover/menu:block hover:block z-50 peer-focus:block">
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
    );

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
            <div className="bg-white dark:bg-surface/20 border border-gray-200 dark:border-white/10 rounded-xl min-h-[400px] shadow-sm dark:shadow-none overflow-hidden">
                <div className="overflow-x-auto">
                    {/* Header: Hidden on mobile */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 dark:border-white/10 text-xs font-semibold text-gray-500 dark:text-text-muted uppercase tracking-wider min-w-[800px]">
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
                                <div key={device.id} className="flex flex-col lg:grid lg:grid-cols-12 gap-4 p-4 items-start lg:items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative">
                                    {/* Device Info */}
                                    <div className="w-full lg:col-span-4 flex items-center justify-between lg:justify-start gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-text-muted group-hover:text-primary transition-colors">
                                                {device.type === 'mobile' ? <Smartphone className="w-5 h-5" /> :
                                                    device.type === 'laptop' ? <Laptop className="w-5 h-5" /> :
                                                        <Monitor className="w-5 h-5" />}
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-text-primary truncate max-w-[150px] lg:max-w-none">{device.name}</div>
                                                    {device.is_host && (
                                                        <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-1.5 rounded uppercase tracking-wider shrink-0">
                                                            (Host)
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-400 dark:text-text-muted">UID: {device.id}</div>
                                            </div>
                                        </div>
                                        {/* Actions for mobile (right side of header) */}
                                        <div className="lg:hidden relative">
                                            <DeviceActionsMenu device={device} handleAction={handleAction} />
                                        </div>
                                    </div>

                                    {/* Content Wrapper for mobile (Stats, OS etc) */}
                                    <div className="w-full lg:contents flex flex-wrap gap-4 pt-2 lg:pt-0">
                                        {/* Status */}
                                        <div className="lg:col-span-2">
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
                                        <div className="lg:col-span-3 min-w-[200px]">
                                            <div className="text-sm text-gray-700 dark:text-text-primary/80">{device.os}</div>
                                            <div className="text-xs text-gray-400 dark:text-text-muted">{device.specs}</div>
                                        </div>

                                        {/* Sync */}
                                        <div className="lg:col-span-2 text-sm text-gray-500 dark:text-text-muted font-mono">
                                            <span className="lg:hidden text-[10px] uppercase mr-2 opacity-50">Last Sync:</span>
                                            {device.last_sync ? new Date(device.last_sync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                                        </div>

                                        {/* Actions for Desktop */}
                                        <div className="hidden lg:col-span-1 lg:flex justify-end relative group/menu">
                                            <DeviceActionsMenu device={device} handleAction={handleAction} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
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
