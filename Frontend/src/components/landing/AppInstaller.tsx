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

        try {
            const selectedAppsData = categories
                .flatMap(c => c.apps)
                .filter(a => selectedApps.includes(a.id));

            if (selectedAppsData.length === 0) {
                alert('Please select at least one app to install.');
                setIsGenerating(false);
                return;
            }

            // Create batch file that generates and runs PowerShell script
            const batchContent = `@echo off
title Kliiq Installer
echo Kliiq Installer - Starting...
echo.

:: Create PowerShell script in temp folder
set "PS_SCRIPT=%TEMP%\\KliiqInstaller_%RANDOM%.ps1"

:: Write PowerShell script
(
echo Add-Type -AssemblyName System.Windows.Forms
echo Add-Type -AssemblyName System.Drawing
echo.
echo $apps = @^(
${selectedAppsData.map((app, index) =>
                `echo     @{ Name = "${app.name}"; Id = "${app.id}" }${index < selectedAppsData.length - 1 ? ',' : ''}`
            ).join('\n')}
echo ^)
echo.
echo $form = New-Object System.Windows.Forms.Form
echo $form.Text = "Kliiq Installer"
echo $form.Size = New-Object System.Drawing.Size^(600, 500^)
echo $form.StartPosition = "CenterScreen"
echo $form.FormBorderStyle = "FixedDialog"
echo $form.MaximizeBox = $false
echo $form.BackColor = [System.Drawing.Color]::FromArgb^(15, 15, 20^)
echo.
echo $headerLabel = New-Object System.Windows.Forms.Label
echo $headerLabel.Location = New-Object System.Drawing.Point^(20, 20^)
echo $headerLabel.Size = New-Object System.Drawing.Size^(560, 40^)
echo $headerLabel.Text = "Kliiq Software Installer"
echo $headerLabel.Font = New-Object System.Drawing.Font^("Segoe UI", 18, [System.Drawing.FontStyle]::Bold^)
echo $headerLabel.ForeColor = [System.Drawing.Color]::White
echo $form.Controls.Add^($headerLabel^)
echo.
echo $statusLabel = New-Object System.Windows.Forms.Label
echo $statusLabel.Location = New-Object System.Drawing.Point^(20, 70^)
echo $statusLabel.Size = New-Object System.Drawing.Size^(560, 25^)
echo $statusLabel.Text = "Installing ${selectedAppsData.length} application(s)..."
echo $statusLabel.Font = New-Object System.Drawing.Font^("Segoe UI", 11^)
echo $statusLabel.ForeColor = [System.Drawing.Color]::FromArgb^(160, 160, 180^)
echo $form.Controls.Add^($statusLabel^)
echo.
echo $progressBar = New-Object System.Windows.Forms.ProgressBar
echo $progressBar.Location = New-Object System.Drawing.Point^(20, 105^)
echo $progressBar.Size = New-Object System.Drawing.Size^(560, 25^)
echo $progressBar.Maximum = $apps.Count
echo $form.Controls.Add^($progressBar^)
echo.
echo $listBox = New-Object System.Windows.Forms.ListBox
echo $listBox.Location = New-Object System.Drawing.Point^(20, 145^)
echo $listBox.Size = New-Object System.Drawing.Size^(560, 250^)
echo $listBox.Font = New-Object System.Drawing.Font^("Consolas", 10^)
echo $listBox.BackColor = [System.Drawing.Color]::FromArgb^(25, 25, 35^)
echo $listBox.ForeColor = [System.Drawing.Color]::White
echo $listBox.BorderStyle = "None"
echo $form.Controls.Add^($listBox^)
echo.
echo $closeButton = New-Object System.Windows.Forms.Button
echo $closeButton.Location = New-Object System.Drawing.Point^(480, 410^)
echo $closeButton.Size = New-Object System.Drawing.Size^(100, 35^)
echo $closeButton.Text = "Close"
echo $closeButton.Enabled = $false
echo $closeButton.Font = New-Object System.Drawing.Font^("Segoe UI", 10^)
echo $closeButton.Add_Click^({ $form.Close^(^) }^)
echo $form.Controls.Add^($closeButton^)
echo.
echo $form.Show^(^)
echo $listBox.Items.Add^("Checking for winget..."^)
echo $form.Refresh^(^)
echo Start-Sleep -Milliseconds 500
echo.
echo try {
echo     $null = Get-Command winget -ErrorAction Stop
echo     $listBox.Items.Add^("[OK] Winget is available"^)
echo     $listBox.Items.Add^(""^)
echo     $form.Refresh^(^)
echo } catch {
echo     $listBox.Items.Add^("[ERROR] Winget not found!"^)
echo     $listBox.Items.Add^("Install from Microsoft Store"^)
echo     $statusLabel.Text = "Installation failed"
echo     $statusLabel.ForeColor = [System.Drawing.Color]::FromArgb^(255, 100, 100^)
echo     $closeButton.Enabled = $true
echo     $form.Refresh^(^)
echo     [System.Windows.Forms.Application]::Run^($form^)
echo     exit
echo }
echo.
echo $successCount = 0
echo $failCount = 0
echo.
echo for ^($i = 0; $i -lt $apps.Count; $i++^) {
echo     $app = $apps[$i]
echo     $statusLabel.Text = "Installing " + $app.Name + "... ^(" + ^($i + 1^) + "/" + $apps.Count + "^)"
echo     $listBox.Items.Add^("[" + ^($i + 1^) + "/" + $apps.Count + "] Installing " + $app.Name + "..."^)
echo     $form.Refresh^(^)
echo     try {
echo         winget install --id $app.Id --silent --accept-package-agreements --accept-source-agreements ^| Out-Null
echo         if ^($LASTEXITCODE -eq 0^) {
echo             $listBox.Items.Add^("    ✓ " + $app.Name + " installed"^)
echo             $successCount++
echo         } else {
echo             $listBox.Items.Add^("    ✗ " + $app.Name + " failed"^)
echo             $failCount++
echo         }
echo     } catch {
echo         $listBox.Items.Add^("    ✗ Error: " + $app.Name^)
echo         $failCount++
echo     }
echo     $progressBar.Value = $i + 1
echo     $listBox.Items.Add^(""^)
echo     $form.Refresh^(^)
echo }
echo.
echo $listBox.Items.Add^("========================================"^)
echo $listBox.Items.Add^("Installation Complete!"^)
echo $listBox.Items.Add^("========================================"^)
echo $listBox.Items.Add^("Successfully installed: " + $successCount + " app(s)"^)
echo $listBox.Items.Add^("Failed: " + $failCount + " app(s)"^)
echo.
echo if ^($failCount -eq 0^) {
echo     $statusLabel.Text = "All apps installed successfully!"
echo     $statusLabel.ForeColor = [System.Drawing.Color]::FromArgb^(100, 255, 100^)
echo } else {
echo     $statusLabel.Text = "Completed with " + $failCount + " error(s)"
echo     $statusLabel.ForeColor = [System.Drawing.Color]::FromArgb^(255, 200, 100^)
echo }
echo.
echo $closeButton.Enabled = $true
echo $form.Refresh^(^)
echo [System.Windows.Forms.Application]::Run^($form^)
) > "%PS_SCRIPT%"

:: Run PowerShell script
echo Starting installer window...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%"

:: Clean up
del "%PS_SCRIPT%" 2>nul
exit
`;

            // Create blob and download as .bat file
            const blob = new Blob([batchContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'KliiqInstaller.bat';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            // Show success message
            setTimeout(() => {
                alert(`✅ Kliiq Installer downloaded!\n\nTo install your apps:\n1. Double-click KliiqInstaller.bat\n2. A GUI window will appear\n3. Watch your apps install!\n\nNote: Windows may show a SmartScreen warning - click "More info" then "Run anyway"`);
            }, 500);

        } catch (err: any) {
            console.error('Error generating installer:', err);
            alert('Failed to generate installer. Please try again.');
        } finally {
            setIsGenerating(false);
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
