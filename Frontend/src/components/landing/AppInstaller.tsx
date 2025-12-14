import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Download, Terminal } from 'lucide-react'
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

export function AppInstaller() {
    const [selectedApps, setSelectedApps] = useState<string[]>([])
    const [isGenerating, setIsGenerating] = useState(false)

    const toggleApp = (id: string) => {
        setSelectedApps(prev =>
            prev.includes(id)
                ? prev.filter(appId => appId !== id)
                : [...prev, id]
        )
    }

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

        setTimeout(() => setIsGenerating(false), 1000)
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
                        Generates a PowerShell script compatible with Windows 10/11
                    </p>
                </motion.div>

            </div>
        </section>
    )
}
