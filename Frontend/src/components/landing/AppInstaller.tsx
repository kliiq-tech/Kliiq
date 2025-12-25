import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Download } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'
import fizzFazzIcon from '../../assets/games/FizzFazz/FizzFazz.jpg'

// Data for apps using Winget IDs
const categories = [
    {
        name: "Web Browsers",
        apps: [
            { id: "Google.Chrome", name: "Chrome", icon: "https://www.google.com/s2/favicons?domain=chrome.com&sz=128" },
            { id: "Mozilla.Firefox", name: "Firefox", icon: "https://www.google.com/s2/favicons?domain=mozilla.org&sz=128" },
            { id: "Brave.Brave", name: "Brave", icon: "https://www.google.com/s2/favicons?domain=brave.com&sz=128" },
            { id: "Microsoft.Edge", name: "Edge", icon: "https://www.google.com/s2/favicons?domain=microsoftedge.com&sz=128" },
        ]
    },
    {
        name: "Messaging",
        apps: [
            { id: "Discord.Discord", name: "Discord", icon: "https://www.google.com/s2/favicons?domain=discord.com&sz=128" },
            { id: "SlackTechnologies.Slack", name: "Slack", icon: "https://www.google.com/s2/favicons?domain=slack.com&sz=128" },
            { id: "Zoom.Zoom", name: "Zoom", icon: "https://www.google.com/s2/favicons?domain=zoom.us&sz=128" },
            { id: "Microsoft.Teams", name: "Teams", icon: "https://www.google.com/s2/favicons?domain=teams.microsoft.com&sz=128" },
        ]
    },
    {
        name: "Development",
        apps: [
            { id: "Microsoft.VisualStudioCode", name: "VS Code", icon: "https://www.google.com/s2/favicons?domain=code.visualstudio.com&sz=128" },
            { id: "Python.Python.3.12", name: "Python 3.12", icon: "https://www.google.com/s2/favicons?domain=python.org&sz=128" },
            { id: "Git.Git", name: "Git", icon: "https://www.google.com/s2/favicons?domain=git-scm.com&sz=128" },
            { id: "OpenJS.NodeJS", name: "Node.js", icon: "https://www.google.com/s2/favicons?domain=nodejs.org&sz=128" },
            { id: "Docker.DockerDesktop", name: "Docker", icon: "https://www.google.com/s2/favicons?domain=docker.com&sz=128" },
            { id: "Anysphere.Cursor", name: "Cursor", icon: "https://www.google.com/s2/favicons?domain=cursor.com&sz=128" },
        ]
    },
    {
        name: "Media",
        apps: [
            { id: "VideoLAN.VLC", name: "VLC", icon: "https://www.google.com/s2/favicons?domain=videolan.org&sz=128" },
            { id: "Spotify.Spotify", name: "Spotify", icon: "https://www.google.com/s2/favicons?domain=spotify.com&sz=128" },
            { id: "OBSProject.OBSStudio", name: "OBS Studio", icon: "https://www.google.com/s2/favicons?domain=obsproject.com&sz=128" },
            { id: "Audacity.Audacity", name: "Audacity", icon: "https://www.google.com/s2/favicons?domain=audacityteam.org&sz=128" },
        ]
    },
    {
        name: "Utilities",
        apps: [
            { id: "7zip.7zip", name: "7-Zip", icon: "https://www.google.com/s2/favicons?domain=7-zip.org&sz=128" },
            { id: "AntibodySoftware.WizTree", name: "WizTree", icon: "https://www.google.com/s2/favicons?domain=diskanalyzer.com&sz=128" },
            { id: "AnyDeskSoftwareGmbH.AnyDesk", name: "AnyDesk", icon: "https://www.google.com/s2/favicons?domain=anydesk.com&sz=128" },
            { id: "Piriform.CCleaner", name: "CCleaner", icon: "https://www.google.com/s2/favicons?domain=ccleaner.com&sz=128" },
        ]
    },
    {
        name: "Imaging",
        apps: [
            { id: "GIMP.GIMP", name: "GIMP", icon: "https://www.google.com/s2/favicons?domain=gimp.org&sz=128" },
            { id: "BlenderFoundation.Blender", name: "Blender", icon: "https://www.google.com/s2/favicons?domain=blender.org&sz=128" },
            { id: "KDE.Krita", name: "Krita", icon: "https://www.google.com/s2/favicons?domain=krita.org&sz=128" },
            { id: "Figma.Figma", name: "Figma", icon: "https://www.google.com/s2/favicons?domain=figma.com&sz=128" },
        ]
    },
    {
        name: "Games (Mobile)",
        apps: [
            { id: "Local.FizzFazz", name: "Fizz Fazz", icon: fizzFazzIcon, manualUrl: "/games/FizzFazz_Port.apk" },
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

        const selectedAppsData = categories
            .flatMap(c => c.apps)
            .filter(a => selectedApps.includes(a.id));

        if (selectedAppsData.length === 0) {
            alert('Please select at least one app to install.');
            setIsGenerating(false);
            return;
        }

        // Generate Hybrid Chimera script (.bat extension, PowerShell content)
        // 1. Batch wrapper bypasses PowerShell Execution Policy
        // 2. PowerShell block handles elevation and app installation
        const appsList = selectedAppsData.map(app =>
            `    @{ Name = "${app.name}"; Id = "${app.id}" }`
        ).join(',\n');

        const scriptContent = `<# :
@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((Get-Content -LiteralPath '%~f0' -Raw))"
exit /b
#>

# Kliiq Installer - Hybrid Script
# Generated: ${new Date().toLocaleString()}

Clear-Host
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "        Kliiq Installer Starting..." -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

$apps = @(
${appsList}
)

foreach ($app in $apps) {
    Write-Host "Installing $($app.Name)..." -ForegroundColor Yellow
    winget install --id $app.Id -e --accept-source-agreements --accept-package-agreements
    Write-Host ""
}

Write-Host "-------------------------------------------" -ForegroundColor Green
Write-Host "Installation Process Complete." -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
`
        // Create dynamic filename
        let filename = "Kliiq Installer"
        if (selectedAppsData.length === 1) {
            filename = `Kliiq ${selectedAppsData[0].name} Installer`
        } else if (selectedAppsData.length === 2) {
            filename = `Kliiq ${selectedAppsData[0].name} & ${selectedAppsData[1].name} Installer`
        } else if (selectedAppsData.length > 2) {
            filename = `Kliiq ${selectedAppsData[0].name} & ${selectedAppsData.length - 1} others Installer`
        }

        // Create blob and download link as .bat
        const blob = new Blob([scriptContent], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename}.bat`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        setTimeout(() => {
            setIsGenerating(false);
            alert(`✅ ${filename} downloaded!\n\nTo install your apps:\n1. Open your Downloads folder\n2. DOUBLE-CLICK the file\n3. Watch your apps install!`);
        }, 1000)
    }

    return (
        <section id="installer" className="py-24 bg-background relative overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* Header */}
                <div className="mb-20">
                    <div className="text-primary font-mono text-xs mb-4 uppercase tracking-[0.3em]">Deployment Pipeline</div>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                        1. Select Your Infrastructure
                    </h2>
                    <p className="text-xl text-text-secondary max-w-2xl leading-relaxed">
                        Set up your environment by selecting the core tools required for your workflow.
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
                                {category.apps.map((app) => {
                                    const isMobile = category.name === "Games (Mobile)";

                                    const handleAppClick = (e: React.MouseEvent) => {
                                        if (isMobile) {
                                            e.stopPropagation();
                                            const url = (app as any).manualUrl || '#';

                                            // Create temporary link to force download
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = app.name + '.apk';
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        } else {
                                            toggleApp(app.id);
                                        }
                                    };

                                    return (
                                        <div
                                            key={app.id}
                                            onClick={handleAppClick}
                                            className="flex flex-col space-y-2 p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center space-x-3 select-none">
                                                {!isMobile && (
                                                    <div className={cn(
                                                        "w-5 h-5 rounded border border-white/20 flex items-center justify-center transition-all duration-200 flex-shrink-0",
                                                        selectedApps.includes(app.id)
                                                            ? "bg-primary border-primary text-black"
                                                            : "bg-surface group-hover:border-primary/50"
                                                    )}>
                                                        {selectedApps.includes(app.id) && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 flex-grow">
                                                    {app.icon && (
                                                        <img
                                                            src={app.icon}
                                                            alt={app.name}
                                                            className={cn(
                                                                "w-5 h-5 object-contain rounded-sm transition-all duration-200",
                                                                (selectedApps.includes(app.id) || isMobile)
                                                                    ? "grayscale-0 opacity-100"
                                                                    : "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100"
                                                            )}
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    )}
                                                    <span className={cn(
                                                        "text-sm transition-colors",
                                                        (selectedApps.includes(app.id) || isMobile) ? "text-white font-medium" : "text-text-muted group-hover:text-text-secondary"
                                                    )}>
                                                        {app.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA - Fixed Bottom Bar or Just Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center space-y-8 text-center pt-16 border-t border-white/5 max-w-4xl mx-auto"
                >
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white sm:text-3xl">
                            2. Download And Run Your Custom Installer
                        </h3>
                        {selectedApps.length === 0 && (
                            <p className="text-red-500 font-medium max-w-xl mx-auto">
                                Please check off the apps you want above.
                            </p>
                        )}
                    </div>

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
                                Download Kliiq Installer
                            </>
                        )}
                    </Button>

                    <div className="space-y-2 text-sm text-text-muted">
                        <p className="text-xs">
                            Kliiq works on Windows 11, 10, 8.x, and 7
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
