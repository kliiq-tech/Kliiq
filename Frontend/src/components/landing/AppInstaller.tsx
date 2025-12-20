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
            { id: "BraveSoftware.BraveBrowser", name: "Brave" },
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
            { id: "Anysphere.Cursor", name: "Cursor" },
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

        // Generate PowerShell script (Pure .ps1)
        // Includes -Force to silent Execution Policy prompt
        const scriptContent = `# Kliiq Installer Function
# Generated: ${new Date().toLocaleString()}

# Suppress "Execution Policy Change" prompt and allow running
try {
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force -ErrorAction SilentlyContinue
} catch {}

Clear-Host
Write-Host "============================" -ForegroundColor Cyan
Write-Host "   Kliiq Software Installer" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

$apps = @(
${selectedApps.map(id => `    "${id}"`).join(',\n')}
)

$successCount = 0
$failCount = 0

foreach ($app in $apps) {
    Write-Host "Installing $app..." -ForegroundColor Yellow
    
    try {
        # Install using winget with robust error handling
        # --force prevents some 'already installed' errors from hanging
        # --disable-interactivity prevents blocking on prompts
        $installResult = winget install --id $app -e --accept-source-agreements --accept-package-agreements --silent --force --disable-interactivity 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Successfully installed $app" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "Failed to install $app (Exit Code: $LASTEXITCODE)" -ForegroundColor Red
            # Optional: Write detailed error if needed
            # Write-Host $installResult
            $failCount++
        }
    } catch {
        Write-Host "Error installing $app : $_" -ForegroundColor Red
        $failCount++
    }
    Write-Host ""
}

Write-Host "============================" -ForegroundColor Cyan
Write-Host "Installation Summary" -ForegroundColor Cyan
Write-Host "Installed: $successCount" -ForegroundColor Green
Write-Host "Failed:    $failCount" -ForegroundColor Red
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Enter to exit..."
Read-Host
`

        // Create blob and download link
        try {
            const blob = new Blob([scriptContent], { type: 'text/plain' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'KliiqInstaller.ps1'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)

            setTimeout(() => {
                setIsGenerating(false)
                alert(`✅ Kliiq Installer downloaded!\n\nTo install your apps:\n1. Right-click "KliiqInstaller.ps1"\n2. Select "Run with PowerShell"`)
            }, 1000)
        } catch (err) {
            console.error('Download failed:', err)
            setIsGenerating(false)
        }
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
                                {category.apps.map((app) => (
                                    <div
                                        key={app.id}
                                        onClick={() => toggleApp(app.id)}
                                        className="flex items-center space-x-3 cursor-pointer group select-none"
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded border border-white/20 flex items-center justify-center transition-all duration-200 flex-shrink-0",
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
                    className="flex flex-col items-center justify-center space-y-8 text-center pt-16 border-t border-white/5 max-w-4xl mx-auto"
                >
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white sm:text-3xl">
                            2. Download Your Custom Installer
                        </h3>
                        <p className="text-text-secondary max-w-xl mx-auto">
                            Get a personalized PowerShell script that will install all your selected apps automatically.
                        </p>
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
                        <p className="flex items-center justify-center gap-2">
                            <Terminal className="w-4 h-4" />
                            Right-click the downloaded file and select "Run with PowerShell"
                        </p>
                        <p className="text-xs">
                            Works on Windows 11, 10, 8.x, 7, and Server versions
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
