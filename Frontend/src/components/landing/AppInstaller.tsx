import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Check, Download, Terminal, X, Minus, Square, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

// Data for apps using Winget IDs
const categories = [
    {
        name: "Web Browsers",
        apps: [
            { id: "Google.Chrome", name: "Chrome" },
            { id: "Mozilla.Firefox", name: "Firefox" },
            { id: "Brave.Brave", name: "Brave" },
            { id: "Microsoft.Edge", name: "Edge" },
        ]
    },
    {
        name: "Messaging",
        apps: [
            { id: "Discord.Discord", name: "Discord" },
            { id: "SlackTechnologies.Slack", name: "Slack" },
            { id: "Zoom.Zoom", name: "Zoom" },
            { id: "Microsoft.Teams", name: "Teams" },
        ]
    },
    {
        name: "Development",
        apps: [
            { id: "Microsoft.VisualStudioCode", name: "VS Code" },
            { id: "Python.Python.3", name: "Python 3" },
            { id: "Git.Git", name: "Git" },
            { id: "OpenJS.NodeJS", name: "Node.js" },
            { id: "Docker.DockerDesktop", name: "Docker" },
            { id: "Cursor.Cursor", name: "Cursor" },
        ]
    },
    {
        name: "Media",
        apps: [
            { id: "VideoLAN.VLC", name: "VLC" },
            { id: "Spotify.Spotify", name: "Spotify" },
            { id: "OBSProject.OBSStudio", name: "OBS Studio" },
            { id: "Audacity.Audacity", name: "Audacity" },
        ]
    },
    {
        name: "Utilities",
        apps: [
            { id: "7zip.7zip", name: "7-Zip" },
            { id: "AntibodySoftware.WizTree", name: "WizTree" },
            { id: "AnyDeskSoftwareGmbH.AnyDesk", name: "AnyDesk" },
            { id: "Piriform.CCleaner", name: "CCleaner" },
        ]
    },
    {
        name: "Imaging",
        apps: [
            { id: "GIMP.GIMP", name: "GIMP" },
            { id: "BlenderFoundation.Blender", name: "Blender" },
            { id: "KDE.Krita", name: "Krita" },
            { id: "Figma.Figma", name: "Figma" },
        ]
    }
]

interface AppStatus {
    id: string;
    name: string;
    status: 'Waiting' | 'Downloading' | 'Installing' | 'OK' | 'Skipped' | 'Failed';
}

export function AppInstaller() {
    const [selectedApps, setSelectedApps] = useState<string[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [showGUI, setShowGUI] = useState(false)
    const [appStatuses, setAppStatuses] = useState<AppStatus[]>([])
    const [overallProgress, setOverallProgress] = useState(0)
    const [showDetails, setShowDetails] = useState(true)
    const [currentInstallingApp, setCurrentInstallingApp] = useState<string>("")
    const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null)

    const toggleApp = (id: string) => {
        if (showGUI) return // Prevent selection while installing
        setSelectedApps(prev =>
            prev.includes(id)
                ? prev.filter(appId => appId !== id)
                : [...prev, id]
        )
    }

    const startSimulation = (selectedAppIds: string[]) => {
        const initialStatuses: AppStatus[] = categories
            .flatMap(c => c.apps)
            .filter(a => selectedAppIds.includes(a.id))
            .map(a => ({ id: a.id, name: a.name, status: 'Waiting' }));

        setAppStatuses(initialStatuses);
        setOverallProgress(0);
        setShowGUI(true);

        let currentIndex = 0;
        let progress = 0;

        const runSimulation = () => {
            if (currentIndex >= initialStatuses.length) {
                if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
                setOverallProgress(100);
                setCurrentInstallingApp("Installation Complete!");
                return;
            }

            const currentApp = initialStatuses[currentIndex];
            setCurrentInstallingApp(`Installing ${currentApp.name}...`);

            // Simulate steps: Waiting -> Downloading -> Installing -> OK
            setAppStatuses(prev => prev.map((s, i) => {
                if (i === currentIndex) {
                    if (s.status === 'Waiting') return { ...s, status: 'Downloading' };
                    if (s.status === 'Downloading') return { ...s, status: 'Installing' };
                    if (s.status === 'Installing') {
                        currentIndex++;
                        return { ...s, status: 'OK' };
                    }
                }
                return s;
            }));

            progress = Math.min(100, (currentIndex / initialStatuses.length) * 100);
            setOverallProgress(progress);
        };

        simulationIntervalRef.current = setInterval(runSimulation, 1500);
    }

    useEffect(() => {
        return () => {
            if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
        };
    }, []);

    const generateInstaller = () => {
        setIsGenerating(true)

        // 1. Define the Clean PowerShell Logic (No escaping needed here)
        const psScript = `
$apps = @(
${selectedApps.map(id => `    "${id}"`).join(',\n')}
)

Clear-Host
$host.UI.RawUI.WindowTitle = "Kliiq Installer"
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "        Kliiq Installer Starting..." -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Checking for permissions..." -ForegroundColor Gray

foreach ($app in $apps) {
    Write-Host "Installing $app..." -ForegroundColor Yellow
    try {
        winget install --id $app -e --accept-source-agreements --accept-package-agreements --source winget
    } catch {
        Write-Host "Failed to install $app" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "-------------------------------------------" -ForegroundColor Green
Write-Host "Installation Complete! Window will close in 3 seconds..." -ForegroundColor Green
Start-Sleep -Seconds 3
`

        // 2. Encode to Base64 UTF-16LE (Required for PowerShell -EncodedCommand)
        // This makes the script bulletproof against special characters and 'batch' parsing errors.
        const toBase64 = (str: string) => {
            const codeUnits = new Uint16Array(str.length);
            for (let i = 0; i < codeUnits.length; i++) {
                codeUnits[i] = str.charCodeAt(i);
            }
            const charCodes = new Uint8Array(codeUnits.buffer);
            let result = "";
            // Process in chunks to avoid stack overflow on large strings
            for (let i = 0; i < charCodes.length; i += 8192) {
                result += String.fromCharCode.apply(null, Array.from(charCodes.subarray(i, i + 8192)));
            }
            return btoa(result);
        }

        const encodedPs = toBase64(psScript)

        // 3. Generate the Batch Wrapper
        // This simple wrapper just asks PowerShell to run the encoded string as Admin.
        const scriptContent = `@echo off
set "params=%*"
cd /d "%~dp0" && ( if exist "%temp%\\getadmin.vbs" del "%temp%\\getadmin.vbs" ) && fsutil dirty query %systemdrive% 1>nul 2>nul || (  echo Set UAC = CreateObject^("Shell.Application"^) : UAC.ShellExecute "cmd.exe", "/k cd ""%~sdp0"" && %~s0 %params%", "", "runas", 1 >> "%temp%\\getadmin.vbs" && "%temp%\\getadmin.vbs" && exit /B )

:: Running Kliiq Installer...
powershell -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${encodedPs}
exit
`
        // Create blob and download link
        const blob = new Blob([scriptContent], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'KliiqInstaller.cmd'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        setTimeout(() => {
            setIsGenerating(false);
            startSimulation(selectedApps);
        }, 1000)
    }

    const closeGUI = () => {
        if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
        setShowGUI(false);
    }

    return (
        <section className="py-24 bg-background relative overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-4 md:px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
                        1. Pick the apps you want
                    </h2>
                    <p className="text-text-secondary">
                        Select your favorite tools and generate a custom installer script instantly.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 mb-16 max-w-6xl mx-auto">
                    {categories.map((category) => (
                        <div key={category.name} className="space-y-4">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                                {category.name}
                            </h3>
                            <div className="space-y-2">
                                {category.apps.map((app) => (
                                    <div
                                        key={app.id}
                                        onClick={() => toggleApp(app.id)}
                                        className="flex items-center space-x-3 cursor-pointer group select-none"
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded border border-white/20 flex items-center justify-center transition-all duration-200",
                                            selectedApps.includes(app.id)
                                                ? "bg-primary border-primary text-black"
                                                : "bg-surface group-hover:border-primary/50"
                                        )}>
                                            {selectedApps.includes(app.id) && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                        </div>
                                        <span className={cn(
                                            "text-sm transition-colors",
                                            selectedApps.includes(app.id) ? "text-white font-medium" : "text-text-muted group-hover:text-text-secondary"
                                        )}>
                                            {app.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA - Fixed Bottom Bar or Just Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center space-y-6 text-center pt-8 border-t border-white/10 max-w-3xl mx-auto"
                >
                    <h3 className="text-2xl font-bold text-white">
                        2. Download and run your custom installer
                    </h3>

                    <Button
                        size="lg"
                        onClick={generateInstaller}
                        disabled={selectedApps.length === 0}
                        className={cn(
                            "h-14 px-8 text-lg shadow-xl shadow-primary/20",
                            selectedApps.length === 0 && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isGenerating ? (
                            "Generating..."
                        ) : (
                            <>
                                <Download className="mr-2 h-5 w-5" />
                                Get Your Kliiq Installer
                            </>
                        )}
                    </Button>

                    <p className="text-sm text-text-muted flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        Kliiq works on Windows 11, 10, 8.x, 7, and equivalent Server versions.
                    </p>

                </motion.div>

                {/* GUI Installer Modal */}
                {showGUI && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-[#f0f0f0] w-full max-w-[500px] rounded-sm shadow-2xl border border-white/20 text-black overflow-hidden font-sans"
                        >
                            {/* Windows-like Title Bar */}
                            <div className="bg-gradient-to-r from-[#0058d8] to-[#0096ff] p-2 flex items-center justify-between text-white">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-inner">
                                        <div className="w-1.5 h-1.5 bg-background rounded-full" />
                                    </div>
                                    <span className="text-xs font-semibold">Kliiq Installer</span>
                                </div>
                                <div className="flex items-center">
                                    <button onClick={closeGUI} className="p-1 hover:bg-white/20 transition-colors"><Minus className="w-3 h-3" /></button>
                                    <button onClick={closeGUI} className="p-1 hover:bg-white/20 transition-colors"><Square className="w-3 h-3" /></button>
                                    <button onClick={closeGUI} className="p-1 hover:bg-red-500 transition-colors"><X className="w-3 h-3" /></button>
                                </div>
                            </div>

                            <div className="p-6 bg-white border-b border-gray-200">
                                <h3 className="text-[15px] mb-4 text-gray-800">
                                    {currentInstallingApp || "Initializing..."}
                                </h3>

                                <div className="h-6 w-full bg-[#e1e1e1] border border-gray-300 rounded-[2px] overflow-hidden mb-6">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${overallProgress}%` }}
                                        transition={{ duration: 0.5 }}
                                        className="h-full bg-gradient-to-b from-[#28e028] to-[#1cb81c]"
                                    />
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-[#0066cc]">
                                    <button
                                        onClick={() => setShowDetails(!showDetails)}
                                        className="hover:underline flex items-center gap-1"
                                    >
                                        {showDetails ? "Hide details" : "Show details"}
                                        {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    </button>
                                    <div className="flex items-center gap-4">
                                        <button className="hover:underline">Write feedback</button>
                                        <button
                                            onClick={closeGUI}
                                            className="px-4 py-1 bg-[#e1e1e1] border border-gray-400 rounded-sm hover:bg-[#d4d4d4] text-black shadow-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Details Table */}
                            {showDetails && (
                                <div className="max-h-[200px] overflow-y-auto bg-white">
                                    <table className="w-full text-[11px] border-collapse">
                                        <thead className="sticky top-0 bg-white shadow-sm border-b border-gray-100">
                                            <tr>
                                                <th className="text-left px-4 py-1 font-normal text-gray-500 border-r border-gray-100 italic">Application</th>
                                                <th className="text-left px-4 py-1 font-normal text-gray-500 italic">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appStatuses.map((app) => (
                                                <tr key={app.id} className="hover:bg-blue-50/30">
                                                    <td className="px-4 py-1.5 border-r border-gray-50">{app.name}</td>
                                                    <td className={cn(
                                                        "px-4 py-1.5",
                                                        app.status === 'OK' ? "text-green-600 font-medium" :
                                                            app.status === 'Installing' ? "text-blue-600 animate-pulse" :
                                                                app.status === 'Downloading' ? "text-orange-600" :
                                                                    "text-gray-400"
                                                    )}>
                                                        {app.status}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Footer placeholder for 'Ninite' feel */}
                            <div className="p-2 bg-[#f0f0f0] border-t border-gray-200 flex justify-end">
                                <span className="text-[9px] text-gray-400 italic">Kliiq Installer v1.0</span>
                            </div>
                        </motion.div>
                    </div>
                )}

            </div>
        </section>
    )
}
