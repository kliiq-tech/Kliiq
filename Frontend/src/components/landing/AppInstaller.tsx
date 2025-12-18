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

        // Find the names of selected apps for the script
        const selectedAppData = categories
            .flatMap(c => c.apps)
            .filter(a => selectedApps.includes(a.id))
            .map(a => `@{id="${a.id}"; name="${a.name}"}`);

        // Define the Native PowerShell GUI Script (Windows Forms)
        // Wrapped in a Hybrid Polyglot CMD wrapper to prevent crashes.
        const scriptContent = `<# :
@echo off
setlocal
title Kliiq Installer Setup
cd /d "%~dp0"

:: Elevation Check
fsutil dirty query %systemdrive% >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting Administrator permissions...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:: Run self as PowerShell
powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command "IEX ([System.IO.File]::ReadAllText('%~f0'))"
exit /b
#>

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$apps = @(
    ${selectedAppData.join(',\n    ')}
)

# --- Theme Colors ---
$bgColor = [System.Drawing.Color]::FromArgb(240, 240, 240)
$headerColor = [System.Drawing.Color]::FromArgb(0, 88, 216)
$borderColor = [System.Drawing.Color]::FromArgb(204, 204, 204)
$textColor = [System.Drawing.Color]::FromArgb(51, 51, 51)

# --- Form Setup ---
$form = New-Object System.Windows.Forms.Form
$form.Text = "Kliiq Installer"
$form.Size = New-Object System.Drawing.Size(500, 480)
$form.BackColor = $bgColor
$form.FormBorderStyle = 'FixedDialog'
$form.MaximizeBox = $false
$form.StartPosition = 'CenterScreen'
$form.TopMost = $true

# --- Header ---
$header = New-Object System.Windows.Forms.Panel
$header.Size = New-Object System.Drawing.Size(500, 40)
$header.BackColor = $headerColor
$header.Dock = 'Top'

$headerLabel = New-Object System.Windows.Forms.Label
$headerLabel.Text = "Kliiq Installer"
$headerLabel.ForeColor = [System.Drawing.Color]::White
$headerLabel.Font = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Bold)
$headerLabel.AutoSize = $true
$headerLabel.Location = New-Object System.Drawing.Point(10, 10)
$header.Controls.Add($headerLabel)

# --- Padding Container ---
$container = New-Object System.Windows.Forms.Panel
$container.Dock = 'Fill'
$container.Padding = New-Object System.Windows.Forms.Padding(25)
$container.BackColor = [System.Drawing.Color]::White

# --- Status Label ---
$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Text = "Initializing..."
$statusLabel.Size = New-Object System.Drawing.Size(430, 25)
$statusLabel.Location = New-Object System.Drawing.Point(25, 20)
$statusLabel.Font = New-Object System.Drawing.Font("Segoe UI", 11)
$statusLabel.ForeColor = $textColor

# --- Progress Bar ---
$progressBar = New-Object System.Windows.Forms.ProgressBar
$progressBar.Size = New-Object System.Drawing.Size(430, 25)
$progressBar.Location = New-Object System.Drawing.Point(25, 55)
$progressBar.Style = 'Blocks'
$progressBar.Minimum = 0
$progressBar.Maximum = 100

# --- App List (ListView) ---
$listView = New-Object System.Windows.Forms.ListView
$listView.Size = New-Object System.Drawing.Size(430, 220)
$listView.Location = New-Object System.Drawing.Point(25, 100)
$listView.View = 'Details'
$listView.FullRowSelect = $true
$listView.GridLines = $true
$listView.Columns.Add("Application", 260) | Out-Null
$listView.Columns.Add("Status", 150) | Out-Null
$listView.HeaderStyle = 'Nonclickable'
$listView.Font = New-Object System.Drawing.Font("Segoe UI", 9)

foreach ($app in $apps) {
    $item = New-Object System.Windows.Forms.ListViewItem($app.name)
    $item.SubItems.Add("Waiting") | Out-Null
    $item.Name = $app.id
    $listView.Items.Add($item) | Out-Null
}

# --- Footer Buttons ---
$footerPanel = New-Object System.Windows.Forms.Panel
$footerPanel.Dock = 'Bottom'
$footerPanel.Size = New-Object System.Drawing.Size(500, 60)
$footerPanel.BackColor = $bgColor

$cancelBtn = New-Object System.Windows.Forms.Button
$cancelBtn.Text = "Cancel"
$cancelBtn.Size = New-Object System.Drawing.Size(80, 30)
$cancelBtn.Location = New-Object System.Drawing.Point(390, 15)
$cancelBtn.FlatStyle = 'System'
$cancelBtn.Add_Click({ $form.Close() })

$footerPanel.Controls.Add($cancelBtn)

# --- Assemble ---
$form.Controls.Add($container)
$container.Controls.Add($statusLabel)
$container.Controls.Add($progressBar)
$container.Controls.Add($listView)
$form.Controls.Add($header)
$form.Controls.Add($footerPanel)

# --- Installation Logic ---
$form.Add_Shown({
    $form.Focus()
    $total = $apps.Count
    $index = 0

    foreach ($app in $apps) {
        # Update Status to Downloading
        $statusLabel.Text = "Installing $($app.name)..."
        $targetItem = $listView.Items | Where-Object { $_.Name -eq $app.id }
        if ($targetItem) { $targetItem.SubItems[1].Text = "Downloading" }
        [System.Windows.Forms.Application]::DoEvents()

        # Start Winget as a background process
        $proc = Start-Process "winget" -ArgumentList "install --id $($app.id) -e --accept-source-agreements --accept-package-agreements --source winget --silent" -PassThru -NoNewWindow
        
        # Keep window responsive while process runs
        while (!$proc.HasExited) {
            [System.Windows.Forms.Application]::DoEvents()
            Start-Sleep -Milliseconds 100
        }

        # Update Status based on exit code
        if ($proc.ExitCode -eq 0) {
            if ($targetItem) { $targetItem.SubItems[1].Text = "OK" }
        } else {
            if ($targetItem) { $targetItem.SubItems[1].Text = "Failed" }
        }

        $index++
        $progressBar.Value = [Math]::Max(0, [Math]::Min(100, [Math]::Floor(($index / $total) * 100)))
        [System.Windows.Forms.Application]::DoEvents()
    }

    $statusLabel.Text = "Installation Complete!"
    [System.Windows.Forms.Application]::DoEvents()
    Start-Sleep -Seconds 3
    $form.Close()
})

$form.ShowDialog()
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
                        Kliiq works on Windows 11, 10, 8.x, 7, and equivalent Server versions.
                    </p>
                </motion.div>

            </div>
        </section>
    )
}
