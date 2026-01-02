import { useState, useEffect } from 'react';
import { Plus, Trash2, DownloadCloud, X, Package } from 'lucide-react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { ALL_APPS } from '../../data/apps';
import { downloadInstaller } from '../../lib/installer';

interface Pack {
    id: string;
    name: string;
    app_ids: string[];
    status: string;
    created_at: string;
    updated_at: string;
}

export function DashboardPacks() {
    const location = useLocation(); // Hook usage
    const [packs, setPacks] = useState<Pack[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPackName, setNewPackName] = useState('');
    const [pendingAppId, setPendingAppId] = useState<string | null>(null);

    useEffect(() => {
        // Auto-open modal if directed from Store
        if (location.state && location.state.createPack) {
            setShowCreateModal(true);

            // Capture pending app ID if provided
            if (location.state.appId) {
                setPendingAppId(location.state.appId);
            }

            // Optional: Clear state so it doesn't reopen on refresh? 
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const [selectedPack, setSelectedPack] = useState<string | null>(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeReason, setUpgradeReason] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

    useEffect(() => {
        fetchPacks();
    }, []);

    const fetchPacks = async () => {
        try {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not authenticated');

            const response = await fetch(`${API_URL}/packs`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch packs');
            const data = await response.json();

            // DEDUPLICATION: Ensure each pack ID appears only once in the UI
            const uniquePacksMap = new Map();
            data.forEach((p: Pack) => {
                if (!uniquePacksMap.has(p.id)) {
                    uniquePacksMap.set(p.id, p);
                }
            });
            setPacks(Array.from(uniquePacksMap.values()));
        } catch (err: any) {
            console.error('Error fetching packs:', err);
        } finally {
            setLoading(false);
        }
    };

    const clearAllPacks = async () => {
        if (!window.confirm("CRITICAL: This will delete ALL your software packs. Proceed?")) return;
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not authenticated');

            // Delete each pack
            for (const pack of packs) {
                await fetch(`${API_URL}/packs/${pack.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });
            }
            await fetchPacks();
            alert("All packs cleared successfully.");
        } catch (err: any) {
            console.error(err);
            alert("Error clearing packs: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    const createPack = async () => {
        setLoading(true);
        if (packs.length >= 3) {
            setUpgradeReason('You have reached the limit of 3 packs on your free plan.');
            setShowUpgradeModal(true);
            return;
        }
        if (!newPackName.trim()) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not authenticated - please sign in');

            const response = await fetch(`${API_URL}/packs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ name: newPackName, app_ids: [] })
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorMessage = 'Failed to create pack';

                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } else {
                    const textError = await response.text();
                    console.error('Non-JSON error response:', textError);
                    errorMessage = `Server Error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const createdPack = await response.json();

            // Auto-add pending app if it exists
            if (pendingAppId) {
                try {
                    await fetch(`${API_URL}/packs/${createdPack.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${session.access_token}`
                        },
                        body: JSON.stringify({ app_ids: [pendingAppId] })
                    });
                    setPendingAppId(null);
                } catch (addErr) {
                    console.error('Error auto-adding app:', addErr);
                }
            }

            await fetchPacks();
            setNewPackName('');
            setShowCreateModal(false);

            // Auto-select the newly created pack
            if (createdPack && createdPack.id) {
                setSelectedPack(createdPack.id);
            }
        } catch (err: any) {
            console.error('Error creating pack:', err);
            alert(`Error creating pack: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const deletePack = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this pack?')) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not authenticated');

            const response = await fetch(`${API_URL}/packs/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete pack');
            await fetchPacks();
            if (selectedPack === id) setSelectedPack(null);
        } catch (err: any) {
            console.error('Error deleting pack:', err);
            alert(`Error deleting pack: ${err.message}`);
        }
    };

    const removeAppFromPack = async (packId: string, appId: string) => {
        const pack = packs.find(p => p.id === packId);
        if (!pack) return;

        const currentApps = pack.app_ids || [];
        const updatedAppIds = currentApps.filter(id => id !== appId);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not authenticated');

            const response = await fetch(`${API_URL}/packs/${packId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ app_ids: updatedAppIds })
            });

            if (!response.ok) throw new Error('Failed to update pack');
            await fetchPacks();
        } catch (err: any) {
            console.error('Error updating pack:', err);
            alert(`Error removing app: ${err.message}`);
        }
    };

    const handleInstallPack = (pack: Pack) => {
        const apps = pack.app_ids
            .map(id => ALL_APPS.find(app => app.id === id))
            .filter(Boolean) as typeof ALL_APPS;

        if (apps.length > 0) {
            downloadInstaller(apps.map(app => ({ id: app.id, name: app.name })));
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Packs</h1>
                    <p className="text-gray-500 dark:text-text-muted text-sm">Manage your software deployment packs</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={clearAllPacks} className="gap-2 px-3 sm:px-4 h-9 sm:h-11 text-red-500 hover:text-red-600 dark:hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete All Packs</span>
                    </Button>
                    <Button onClick={() => setShowCreateModal(true)} className="gap-2 px-3 sm:px-4 h-9 sm:h-11">
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Create New Pack</span>
                        <span className="sm:hidden">New Pack</span>
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading packs...</div>
            ) : packs.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No packs yet</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first pack to get started</p>
                    <Button onClick={() => setShowCreateModal(true)}>Create Pack</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                    {packs.map((pack) => {
                        const packApps = pack.app_ids
                            .map(id => ALL_APPS.find(app => app.id === id))
                            .filter((app): app is typeof ALL_APPS[0] => !!app);

                        const isSelected = selectedPack !== null && pack.id !== undefined && String(selectedPack) === String(pack.id);

                        return (
                            <div
                                key={pack.id}
                                className={cn(
                                    "bg-white dark:bg-surface/40 border rounded-2xl overflow-hidden transition-all duration-300 shadow-sm",
                                    isSelected
                                        ? "border-primary shadow-lg shadow-primary/5 ring-1 ring-primary/20 scale-[1.02]"
                                        : "border-gray-200 dark:border-white/10 hover:border-primary/30 opacity-70 hover:opacity-100"
                                )}
                            >
                                <div
                                    className="p-4 cursor-pointer flex items-center justify-between group"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (isSelected) {
                                            setSelectedPack(null);
                                        } else {
                                            setSelectedPack(pack.id);
                                        }
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-3 h-3 rounded-full shadow-inner transition-colors duration-300",
                                            isSelected ? "bg-primary" : "bg-gray-300 dark:bg-white/10"
                                        )} />
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "font-bold text-xs uppercase tracking-wider transition-colors",
                                                isSelected ? "text-primary" : "text-gray-900 dark:text-white"
                                            )}>
                                                {pack.name}
                                            </span>
                                            {isSelected && (
                                                <span className="text-[8px] text-text-muted font-mono opacity-50">
                                                    ID: {pack.id.substring(0, 8)}...
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold text-text-muted">
                                            {pack.app_ids?.length || 0}/10
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deletePack(pack.id);
                                            }}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                            title="Delete Pack"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="p-3 bg-gray-50/50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 space-y-2">
                                        {packApps.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500 text-sm">
                                                No apps in this pack. Add apps from the Store.
                                            </div>
                                        ) : (
                                            packApps.map((app) => (
                                                <div
                                                    key={app.id}
                                                    className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white dark:bg-surface border border-gray-100 dark:border-white/10 group/item transition-all hover:border-primary/30"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={`https://www.google.com/s2/favicons?domain=${app.domain}&sz=32`}
                                                            alt=""
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-[10px] font-bold text-gray-700 dark:text-text-secondary uppercase tracking-tight">
                                                            {app.name}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => removeAppFromPack(pack.id, app.id)}
                                                        className="opacity-0 group-hover/item:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                        <Button
                                            className="w-full mt-2 h-9 text-[10px] font-bold uppercase tracking-widest gap-2 bg-gray-900 dark:bg-white text-white dark:text-black"
                                            onClick={() => handleInstallPack(pack)}
                                            disabled={packApps.length === 0}
                                        >
                                            <DownloadCloud className="w-3.5 h-3.5" />
                                            Install Pack
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Pack Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create a Pack</h2>
                            <p className="text-sm text-gray-500 dark:text-text-muted">Group your essential tools for massive speed.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pack Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="e.g. Frontend Dev, Design Suite..."
                                    value={newPackName}
                                    onChange={(e) => setNewPackName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && createPack()}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button variant="ghost" className="flex-1 py-6" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                                <Button
                                    className="flex-1 py-6 font-bold"
                                    onClick={createPack}
                                    disabled={!newPackName || loading}
                                >
                                    {loading ? 'Creating...' : 'Create & Save'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl text-center">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Upgrade Required</h2>
                        <p className="text-gray-500 dark:text-text-muted mb-8 leading-relaxed">
                            {upgradeReason} Upgrade your plan to unlock unlimited packs and advanced deployment tools.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Button className="w-full py-6 font-bold text-sm bg-primary hover:bg-primary/90" onClick={() => window.location.href = '/dashboard/upgrade'}>
                                View Plans
                            </Button>
                            <Button variant="ghost" className="py-6" onClick={() => setShowUpgradeModal(false)}>Maybe Later</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

