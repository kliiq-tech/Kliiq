import { Search, Plus, Trash2, DownloadCloud, Check, X, Building2, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'
import { Link } from 'react-router-dom'

// Data for apps using categories as in the provided image
interface App {
    id: string;
    name: string;
    domain: string;
    version: string;
    size: string;
}

interface Category {
    name: string;
    icon?: any;
    apps: App[];
}

interface Pack {
    id: string;
    name: string;
    apps: string[];
    color: string;
}

const categories: Category[] = [
    {
        name: "Web Browsers",
        apps: [
            { id: "chrome", name: "Chrome", domain: "chrome.com", version: "v120.0", size: "95 MB" },
            { id: "firefox", name: "Firefox", domain: "mozilla.org", version: "v121.0", size: "112 MB" },
            { id: "edge", name: "Edge", domain: "microsoftedge.com", version: "v120.0", size: "145 MB" },
            { id: "brave", name: "Brave", domain: "brave.com", version: "v1.61", size: "98 MB" },
            { id: "opera", name: "Opera", domain: "opera.com", version: "v106.0", size: "105 MB" },
        ]
    },
    {
        name: "Messaging",
        apps: [
            { id: "zoom", name: "Zoom", domain: "zoom.us", version: "v5.17", size: "82 MB" },
            { id: "discord", name: "Discord", domain: "discord.com", version: "v1.0.9031", size: "156 MB" },
            { id: "teams", name: "Teams", domain: "teams.microsoft.com", version: "v24004", size: "210 MB" },
            { id: "slack", name: "Slack", domain: "slack.com", version: "v4.36", size: "185 MB" },
            { id: "whatsapp", name: "WhatsApp", domain: "whatsapp.com", version: "v2.23", size: "92 MB" },
        ]
    },
    {
        name: "Media",
        apps: [
            { id: "itunes", name: "iTunes", domain: "apple.com", version: "12.13", size: "256 MB" },
            { id: "vlc", name: "VLC", domain: "videolan.org", version: "3.0.20", size: "42 MB" },
            { id: "spotify", name: "Spotify", domain: "spotify.com", version: "1.2.25", size: "82 MB" },
            { id: "handbrake", name: "Handbrake", domain: "handbrake.fr", version: "1.7.2", size: "28 MB" },
        ]
    },
    {
        name: "Other",
        apps: [
            { id: "evernote", name: "Evernote", domain: "evernote.com", version: "10.68", size: "142 MB" },
            { id: "steam", name: "Steam", domain: "steampowered.com", version: "Latest", size: "2 MB" },
            { id: "everything", name: "Everything", domain: "voidtools.com", version: "1.4.1", size: "1.5 MB" },
        ]
    },
    {
        name: "Imaging",
        apps: [
            { id: "krita", name: "Krita", domain: "krita.org", version: "5.2.2", size: "124 MB" },
            { id: "blender", name: "Blender", domain: "blender.org", version: "4.0.2", size: "312 MB" },
            { id: "paint-net", name: "Paint.NET", domain: "getpaint.net", version: "5.0.11", size: "62 MB" },
            { id: "gimp", name: "GIMP", domain: "gimp.org", version: "2.10.36", size: "285 MB" },
        ]
    },
    {
        name: "Documents",
        apps: [
            { id: "foxit-reader", name: "Foxit Reader", domain: "foxit.com", version: "2023.3", size: "158 MB" },
            { id: "libreoffice", name: "LibreOffice", domain: "libreoffice.org", version: "7.6.4", size: "345 MB" },
            { id: "sumatrapdf", name: "SumatraPDF", domain: "sumatrapdfreader.org", version: "3.5.2", size: "12 MB" },
        ]
    },
    {
        name: "Security",
        apps: [
            { id: "malwarebytes", name: "Malwarebytes", domain: "malwarebytes.com", version: "4.6.6", size: "280 MB" },
            { id: "avast", name: "Avast", domain: "avast.com", version: "23.12", size: "712 MB" },
            { id: "avg", name: "AVG", domain: "avg.com", version: "23.12", size: "705 MB" },
        ]
    },
    {
        name: "Online Storage",
        apps: [
            { id: "dropbox", name: "Dropbox", domain: "dropbox.com", version: "188.4", size: "215 MB" },
            { id: "googledrive", name: "Google Drive", domain: "google.com", version: "84.0", size: "245 MB" },
            { id: "onedrive", name: "OneDrive", domain: "microsoft.com", version: "23.226", size: "198 MB" },
        ]
    },
    {
        name: "Compression",
        apps: [
            { id: "7zip", name: "7-Zip", domain: "7-zip.org", version: "23.01", size: "1.5 MB" },
            { id: "peazip", name: "PeaZip", domain: "peazip.github.io", version: "9.6.0", size: "10 MB" },
            { id: "winrar", name: "WinRAR", domain: "win-rar.com", version: "6.24", size: "3.5 MB" },
        ]
    },
    {
        name: "Runtime",
        apps: [
            { id: "dotnet-desktop-7", name: ".NET Desktop 7", domain: "microsoft.com", version: "7.0.14", size: "55 MB" },
            { id: "java-openjdk-17", name: "OpenJDK 17", domain: "oracle.com", version: "17.0.9", size: "185 MB" },
            { id: "vcredist-2015-2022", name: "VC++ 2015-2022", domain: "microsoft.com", version: "14.38", size: "24 MB" },
        ]
    },
    {
        name: "Developer Tools",
        apps: [
            { id: "vscode", name: "VS Code", domain: "code.visualstudio.com", version: "v1.85", size: "312 MB" },
            { id: "python", name: "Python 3.12", domain: "python.org", version: "3.12.1", size: "25 MB" },
            { id: "git", name: "Git", domain: "git-scm.com", version: "2.43.0", size: "58 MB" },
            { id: "docker", name: "Docker Desktop", domain: "docker.com", version: "v4.26", size: "580 MB" },
            { id: "cursor", name: "Cursor", domain: "cursor.com", version: "v0.15", size: "145 MB" },
        ]
    },
    {
        name: "Utilities",
        apps: [
            { id: "anydesk", name: "AnyDesk", domain: "anydesk.com", version: "7.1.13", size: "5 MB" },
            { id: "teamviewer", name: "TeamViewer", domain: "teamviewer.com", version: "15.48", size: "65 MB" },
            { id: "wiztree", name: "WizTree", domain: "diskanalyzer.com", version: "4.15", size: "6 MB" },
            { id: "ccleaner", name: "CCleaner", domain: "ccleaner.com", version: "6.19", size: "75 MB" },
        ]
    }
]

const allApps = categories.flatMap(c => c.apps)

export function DashboardApps() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')
    const [packs, setPacks] = useState<Pack[]>([])
    const [selectedPack, setSelectedPack] = useState<string | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newPackName, setNewPackName] = useState('')
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [upgradeReason, setUpgradeReason] = useState('')
    const [deletionCount, setDeletionCount] = useState(0)
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

    // Installation state: 'idle' | 'installing' | 'installed'
    const [appStatus, setAppStatus] = useState<Record<string, 'idle' | 'installing' | 'installed'>>({})

    // Load installation states from localStorage
    useEffect(() => {
        const savedStatus = localStorage.getItem('kliiq_installed_apps')
        if (savedStatus) {
            try {
                const parsed = JSON.parse(savedStatus)
                // We only care about 'installed' status for persistence
                const statusMap: Record<string, 'idle' | 'installing' | 'installed'> = {}
                Object.keys(parsed).forEach(id => {
                    if (parsed[id] === 'installed') statusMap[id] = 'installed'
                })
                setAppStatus(statusMap)
            } catch (e) {
                console.error("Failed to parse app status", e)
            }
        }
    }, [])

    // Save installation states to localStorage
    useEffect(() => {
        const installedApps: Record<string, string> = {}
        Object.keys(appStatus).forEach(id => {
            if (appStatus[id] === 'installed') installedApps[id] = 'installed'
        })
        localStorage.setItem('kliiq_installed_apps', JSON.stringify(installedApps))
    }, [appStatus])

    // Add to pack pending app (for create-and-add flow)
    const [pendingAppId, setPendingAppId] = useState<string | null>(null)

    const filteredApps = allApps.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === 'All' || categories.find(c => c.name === activeCategory)?.apps.some(a => a.id === app.id)
        return matchesSearch && matchesCategory
    })

    const createPack = () => {
        if (packs.length >= 3) {
            setUpgradeReason('You have reached the limit of 3 packs on your free plan.')
            setShowUpgradeModal(true)
            return
        }
        if (!newPackName.trim()) return

        const newPack = {
            id: 'p' + Math.random().toString(36).substr(2, 9),
            name: newPackName,
            apps: pendingAppId ? [pendingAppId] : [],
            color: ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500"][packs.length % 4]
        }

        setPacks([...packs, newPack])
        setNewPackName('')
        setShowCreateModal(false)
        setPendingAppId(null)
    }

    const deletePack = (id: string) => {
        if (deletionCount >= 4) {
            setUpgradeReason('You have reached the limit of 4 pack deletions on your free plan.')
            setShowUpgradeModal(true)
            return
        }
        setPacks(packs.filter(p => p.id !== id))
        setDeletionCount(prev => prev + 1)
        if (selectedPack === id) setSelectedPack(null)
    }

    const addAppToPack = (appId: string) => {
        if (packs.length === 0) {
            setPendingAppId(appId)
            setShowCreateModal(true)
            return
        }

        // Show selection if multiple packs exist, or just add to first for now
        // For simplicity in this demo, we'll add to the first pack or prompt to create
        const pack = packs[0]
        if (pack.apps.length >= 10) {
            setUpgradeReason('This pack has reached the limit of 10 apps on your free plan.')
            setShowUpgradeModal(true)
            return
        }

        if (!pack.apps.includes(appId)) {
            setPacks(packs.map(p => p.id === pack.id ? { ...p, apps: [...p.apps, appId] } : p))
        }
    }

    const handleInstall = (appId: string) => {
        setAppStatus(prev => ({ ...prev, [appId]: 'installing' }))

        // Mock the download logic from AppInstaller.tsx
        const app = allApps.find(a => a.id === appId)
        const scriptContent = `@echo off\necho Installing ${app?.name}...\nwinget install --id ${appId} -e\npause`
        const blob = new Blob([scriptContent], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Kliiq_${app?.name}_Installer.bat`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        setTimeout(() => {
            setAppStatus(prev => ({ ...prev, [appId]: 'installed' }))
        }, 3000)
    }

    const handleUninstall = (appId: string) => {
        setAppStatus(prev => ({ ...prev, [appId]: 'idle' }))
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Apps & Tools</h1>
                    <p className="text-gray-500 dark:text-text-muted text-sm">Manage software, dependencies, and deployment packs</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create New Pack
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Categories & Search */}
                <div className="flex-1 space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                className="h-[52px] px-6 rounded-2xl bg-white dark:bg-surface border border-gray-200 dark:border-white/10 flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-white hover:border-primary/50 transition-all min-w-[160px] justify-between shadow-sm"
                            >
                                {activeCategory}
                                <ChevronDown className={cn("w-4 h-4 transition-transform", showCategoryDropdown && "rotate-180")} />
                            </button>

                            {showCategoryDropdown && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                                    {['All', ...categories.map(c => c.name)].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setActiveCategory(cat)
                                                setShowCategoryDropdown(false)
                                            }}
                                            className={cn(
                                                "w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between",
                                                activeCategory === cat
                                                    ? "text-primary bg-primary/5 font-bold"
                                                    : "text-gray-600 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-white/5"
                                            )}
                                        >
                                            {cat}
                                            {activeCategory === cat && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative group flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search software, dependencies, or tools..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-[52px] bg-white dark:bg-surface border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredApps.map((app) => (
                            <div key={app.id} className="bg-white dark:bg-surface/40 hover:bg-white dark:hover:bg-surface border border-gray-200 dark:border-white/10 rounded-2xl p-5 transition-all group shadow-sm relative">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/10 shadow-inner flex-shrink-0">
                                        <img
                                            src={`https://www.google.com/s2/favicons?domain=${app.domain}&sz=128`}
                                            alt={app.name}
                                            className="w-9 h-9 object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{app.name}</div>
                                        <div className="text-[10px] font-bold text-gray-400 dark:text-text-muted uppercase tracking-wider mb-2">{(app as any).version || 'v1.0'} • {(app as any).size || '0 MB'}</div>

                                        <div className="flex flex-col gap-2 absolute right-5 top-5 z-10">
                                            {appStatus[app.id] === 'installed' ? (
                                                <>
                                                    <Button disabled className="h-8 bg-green-500/10 text-green-500 border-green-500/20 text-[10px] font-bold gap-2 px-3">
                                                        <Check className="w-3 h-3" />
                                                        Installed
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="h-8 px-3 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-bold"
                                                        onClick={() => handleUninstall(app.id)}
                                                    >
                                                        Uninstall
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        className="h-8 text-[10px] font-bold gap-2 px-4 whitespace-nowrap"
                                                        onClick={() => handleInstall(app.id)}
                                                        disabled={appStatus[app.id] === 'installing'}
                                                    >
                                                        <DownloadCloud className={cn("w-3 h-3", appStatus[app.id] === 'installing' && "animate-bounce")} />
                                                        {appStatus[app.id] === 'installing' ? "Installing..." : "Install"}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-[10px] font-bold gap-2 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                                        onClick={() => addAppToPack(app.id)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                        Add to Pack
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Packs */}
                <div className="w-full md:w-80 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-text-muted uppercase tracking-[0.2em]">Your Packs</h3>
                        <span className="text-[10px] font-mono text-gray-400">{packs.length}/3</span>
                    </div>

                    <div className="space-y-3">
                        {packs.map((pack) => (
                            <div
                                key={pack.id}
                                className={cn(
                                    "bg-white dark:bg-surface border rounded-2xl overflow-hidden transition-all shadow-sm",
                                    selectedPack === pack.id ? "border-primary shadow-lg shadow-primary/5 ring-1 ring-primary/20" : "border-gray-200 dark:border-white/10"
                                )}
                            >
                                <div
                                    className="p-4 cursor-pointer flex items-center justify-between group"
                                    onClick={() => setSelectedPack(selectedPack === pack.id ? null : pack.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-3 h-3 rounded-full shadow-inner", pack.color)} />
                                        <span className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">{pack.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold text-text-muted">{pack.apps.length}/10</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deletePack(pack.id); }}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {selectedPack === pack.id && (
                                    <div className="p-3 bg-gray-50/50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 space-y-2">
                                        {pack.apps.map((appId: string) => {
                                            const app = allApps.find(a => a.id === appId)
                                            return (
                                                <div key={appId} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white dark:bg-surface border border-gray-100 dark:border-white/10 group/item transition-all hover:border-primary/30">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={`https://www.google.com/s2/favicons?domain=${app?.domain}&sz=32`}
                                                            alt=""
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-[10px] font-bold text-gray-700 dark:text-text-secondary uppercase tracking-tight">{app?.name}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => setPacks(packs.map((p: Pack) => p.id === pack.id ? { ...p, apps: p.apps.filter((ia: string) => ia !== appId) } : p))}
                                                        className="opacity-0 group-hover/item:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )
                                        })}
                                        <Button className="w-full mt-2 h-9 text-[10px] font-bold uppercase tracking-widest gap-2 bg-gray-900 dark:bg-white text-white dark:text-black">
                                            <DownloadCloud className="w-3.5 h-3.5" />
                                            Install Pack
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

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
                                <Button className="flex-1 py-6 font-bold" onClick={createPack}>Create & Save</Button>
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
                            <Building2 className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Upgrade Required</h2>
                        <p className="text-gray-500 dark:text-text-muted mb-8 leading-relaxed">
                            {upgradeReason} Upgrade your plan to unlock unlimited packs and advanced deployment tools.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Link to="/dashboard/upgrade">
                                <Button className="w-full py-6 font-bold text-sm bg-primary hover:bg-primary/90">View Plans</Button>
                            </Link>
                            <Button variant="ghost" className="py-6" onClick={() => setShowUpgradeModal(false)}>Maybe Later</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

