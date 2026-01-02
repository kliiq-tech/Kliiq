import { Search, Monitor, Smartphone, Star, Package, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_APPS } from '../../data/apps';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { downloadInstaller } from '../../lib/installer';
import { Button } from '../../components/ui/Button';
import { HeroCarousel } from '../../components/store/HeroCarousel';
import type { HeroSlide } from '../../data/storeData';

interface Pack {
    id: string;
    name: string;
    app_ids: string[];
}

export function DashboardStore() {
    const navigate = useNavigate();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeReason, setUpgradeReason] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

    const [selectedDevice, setSelectedDevice] = useState<'windows' | 'phone'>('windows');
    const [selectedNav, setSelectedNav] = useState<'home' | 'apps' | 'games' | 'news'>('home');
    const [packs, setPacks] = useState<Pack[]>([]);
    const [showAddToPack, setShowAddToPack] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fizz Fazz game data (for Games/Phone)
    const fizzFazzGame = {
        id: 'fizz-fazz',
        name: 'Fizz Fazz',
        publisher: 'Kliiq Games',
        category: 'Puzzle',
        icon: '',
        price: 'free' as const,
        description: 'The exciting puzzle game from Kliiq',
        rating: 4.8
    };


    useEffect(() => {
        fetchPacks();
    }, []);

    const fetchPacks = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch(`${API_URL}/packs`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPacks(data);
            }
        } catch (err) {
            console.error('Error fetching packs:', err);
        }
    };

    const addAppToPack = async (appId: string, packId: string) => {
        const pack = packs.find(p => p.id === packId);
        if (!pack) return;

        const currentApps = pack.app_ids || [];

        if (currentApps.length >= 10) {
            setUpgradeReason('This pack has reached the limit of 10 apps on your free plan.');
            setShowUpgradeModal(true);
            return;
        }

        if (currentApps.includes(appId)) {
            alert('App is already in this pack');
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not authenticated');

            // Optimistic Update: Update UI immediately
            const updatedPacks = packs.map(p => {
                if (p.id === packId) {
                    return { ...p, app_ids: [...(p.app_ids || []), appId] };
                }
                return p;
            });
            setPacks(updatedPacks);
            setShowAddToPack(null); // Close modal instantly

            const response = await fetch(`${API_URL}/packs/${packId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ app_ids: [...currentApps, appId] })
            });

            if (!response.ok) {
                // Revert on failure
                const revertPacks = packs.map(p => {
                    if (p.id === packId) {
                        return { ...p, app_ids: currentApps };
                    }
                    return p;
                });
                setPacks(revertPacks);

                const contentType = response.headers.get("content-type");
                let errorMessage = 'Failed to add app to pack';
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } else {
                    errorMessage = `Server Error: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            // Success - No need to re-fetch if confident, but re-fetching ensures consistency eventually
            // We can skip await fetchPacks() here for speed, or do it silently in background
            // await fetchPacks(); 
            // alert("App added successfully!"); // Logic: Don't block user with alert if optimistic
        } catch (err: any) {
            console.error('Error adding app to pack:', err);
            alert(`Error adding app: ${err.message}`);
        }
    };

    const handleInstall = (appId: string) => {
        const app = ALL_APPS.find(a => a.id === appId);
        if (app) {
            downloadInstaller([{ id: app.id, name: app.name }]);
        }
    };

    const handleAddToPackClick = (appId: string) => {
        if (packs.length === 0) {
            if (window.confirm('You have no packs. Would you like to create one?')) {
                navigate('/dashboard/packs', { state: { createPack: true, appId: appId } });
            }
            return;
        }
        setShowAddToPack(appId);
    };

    // Filter apps & Search Logic
    useEffect(() => {
        if (!searchQuery || selectedNav !== 'home') return;

        const lowerQuery = searchQuery.toLowerCase();

        // Check Windows Apps
        const hasWindowsMatch = ALL_APPS.some(app =>
            app.name.toLowerCase().includes(lowerQuery)
        );

        // Check Phone Apps (Mock check since we only have one phone game)
        const hasPhoneMatch = fizzFazzGame.name.toLowerCase().includes(lowerQuery);

        if (hasPhoneMatch && !hasWindowsMatch && selectedDevice === 'windows') {
            setSelectedDevice('phone');
        } else if (hasWindowsMatch && !hasPhoneMatch && selectedDevice === 'phone') {
            setSelectedDevice('windows');
        }
    }, [searchQuery, selectedNav, selectedDevice]);

    const filteredApps = ALL_APPS.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    // Helper for random ratings
    const isValidRating = (name: string) => name.length > 0;

    // Render content based on nav and device
    const renderContent = () => {
        // Hero Slides Data
        const heroSlides: HeroSlide[] = [
            {
                id: '1',
                title: 'Unlock Your Potential',
                subtitle: 'Discover the best tools for developers and creators.',
                cta: 'Explore Now',
                image: '', // Placeholder
                link: '/store'
            },
            {
                id: '2',
                title: 'Gaming Evolved',
                subtitle: 'Experience the next generation of gaming on Windows.',
                cta: 'Play Free',
                image: '',
                link: '/games'
            }
        ];

        // Helper for sections
        const StoreSection = ({ title, apps }: { title: string, apps: typeof ALL_APPS }) => (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button className="text-sm font-medium text-primary hover:underline">See all</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {apps.map((app) => (
                        <div key={app.id} className="min-w-[160px] w-[160px] snap-start flex-shrink-0 group relative">
                            <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 flex items-center justify-center mb-3 transition-all group-hover:bg-white dark:group-hover:bg-white/10 group-hover:shadow-lg">
                                <img
                                    src={`https://www.google.com/s2/favicons?domain=${app.domain}&sz=128`}
                                    alt={app.name}
                                    className="w-16 h-16 object-contain drop-shadow-md transition-transform group-hover:scale-110"
                                />
                                {/* Hover Overlay Actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                                    <button
                                        onClick={() => handleInstall(app.id)}
                                        className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full transform translate-y-2 group-hover:translate-y-0 transition-transform"
                                    >
                                        Install
                                    </button>
                                    <button
                                        onClick={() => handleAddToPackClick(app.id)}
                                        className="px-4 py-1.5 bg-black/50 text-white border border-white/30 text-xs font-bold rounded-full hover:bg-black/70 transform translate-y-2 group-hover:translate-y-0 transition-transform delay-75"
                                    >
                                        + Pack
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate" title={app.name}>{app.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span>{app.category}</span>
                                    <span>•</span>
                                    <span>{app.size}</span>
                                </div>
                                {isValidRating(app.name) && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-[10px] font-bold text-gray-900 dark:text-white">4.{Math.floor(Math.random() * 5) + 5}</span>
                                        <Star className="w-2.5 h-2.5 fill-gray-900 dark:fill-white text-gray-900 dark:text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );

        // Windows device - Store Layout
        if (selectedNav === 'home' || selectedNav === 'apps') {

            const essentialApps = filteredApps.filter(a => ['Chrome', 'VS Code', 'Spotify', 'Discord'].includes(a.name) || a.category === 'Browsers');
            const devTools = filteredApps.filter(a => a.category === 'Developer Tools' || a.category === 'Terminals');
            const creativeTools = filteredApps.filter(a => a.category === 'Multimedia' || a.category === 'Communication');

            return (
                <div className="space-y-10 pb-20">
                    <HeroCarousel slides={heroSlides} />

                    <StoreSection title="Essential Apps" apps={essentialApps.length ? essentialApps : filteredApps.slice(0, 6)} />
                    <StoreSection title="Developer Tools" apps={devTools.length ? devTools : filteredApps.slice(6, 12)} />
                    <StoreSection title="Creative & Social" apps={creativeTools.length ? creativeTools : filteredApps.slice(12, 18)} />
                    <StoreSection title="Top Free Apps" apps={filteredApps} />
                </div>
            );
        }

        // Phone device placeholder
        if (selectedDevice === 'phone') {
            return (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center space-y-4">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                            <Smartphone className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mobile Store</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                            Connect your device to browse mobile apps.
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Coming Soon</h2>
                    <p className="text-gray-500 dark:text-gray-400">Content coming soon...</p>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white dark:bg-background">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white dark:bg-background border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between px-4 h-14 gap-4">
                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        {(['home', 'apps', 'games', 'news'] as const).map((nav) => (
                            <button
                                key={nav}
                                onClick={() => setSelectedNav(nav)}
                                className={cn(
                                    "text-sm font-medium transition-colors capitalize",
                                    selectedNav === nav
                                        ? "text-primary dark:text-primary"
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                )}
                            >
                                {nav === 'home' ? 'Home' : nav === 'apps' ? 'Apps' : nav === 'games' ? 'Games' : 'News'}
                            </button>
                        ))}
                    </div>

                    {/* Center: Search Bar */}
                    <div className="flex-1 max-w-xl relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search apps, games, and more"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 bg-gray-100 dark:bg-white/5 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Device Filter Pills */}
                <div className="flex items-center gap-2 px-4 pb-3">
                    <button
                        onClick={() => setSelectedDevice('windows')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                            selectedDevice === 'windows'
                                ? "bg-primary/10 dark:bg-primary/20 text-primary border-primary/30 dark:border-primary/50"
                                : "bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
                        )}
                    >
                        <Monitor className="w-4 h-4" />
                        Windows
                    </button>
                    <button
                        onClick={() => setSelectedDevice('phone')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                            selectedDevice === 'phone'
                                ? "bg-primary/10 dark:bg-primary/20 text-primary border-primary/30 dark:border-primary/50"
                                : "bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
                        )}
                    >
                        <Smartphone className="w-4 h-4" />
                        Phone
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-6">
                {renderContent()}
            </div>

            {showAddToPack && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
                        <button
                            onClick={() => setShowAddToPack(null)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add to Pack</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Select a pack to add this app to.</p>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {packs.map(pack => (
                                <button
                                    key={pack.id}
                                    onClick={() => addAppToPack(showAddToPack, pack.id)}
                                    className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between group border border-transparent hover:border-primary/20"
                                >
                                    <span className="font-medium text-gray-900 dark:text-white">{pack.name}</span>
                                    <span className="text-xs text-gray-500 group-hover:text-primary transition-colors">
                                        {pack.app_ids.length} apps
                                    </span>
                                </button>
                            ))}
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
