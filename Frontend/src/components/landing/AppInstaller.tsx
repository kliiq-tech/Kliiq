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

            // Generate PowerShell script with Windows Forms GUI (base64 encoded to avoid escaping issues)
            const psScript = `Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$apps = @(
${selectedAppsData.map(app => `    @{ Name = "${app.name}"; Id = "${app.id}" }`).join(',\n')}
)

$form = New-Object System.Windows.Forms.Form
$form.Text = "Kliiq Installer"
$form.Size = New-Object System.Drawing.Size(600, 500)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false
$form.BackColor = [System.Drawing.Color]::FromArgb(15, 15, 20)

$headerLabel = New-Object System.Windows.Forms.Label
$headerLabel.Location = New-Object System.Drawing.Point(20, 20)
$headerLabel.Size = New-Object System.Drawing.Size(560, 40)
$headerLabel.Text = "Kliiq Software Installer"
$headerLabel.Font = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$headerLabel.ForeColor = [System.Drawing.Color]::White
$form.Controls.Add($headerLabel)

$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Location = New-Object System.Drawing.Point(20, 70)
$statusLabel.Size = New-Object System.Drawing.Size(560, 25)
$statusLabel.Text = "Installing ${selectedAppsData.length} application(s)..."
$statusLabel.Font = New-Object System.Drawing.Font("Segoe UI", 11)
$statusLabel.ForeColor = [System.Drawing.Color]::FromArgb(160, 160, 180)
$form.Controls.Add($statusLabel)

$progressBar = New-Object System.Windows.Forms.ProgressBar
$progressBar.Location = New-Object System.Drawing.Point(20, 105)
$progressBar.Size = New-Object System.Drawing.Size(560, 25)
$progressBar.Maximum = $apps.Count
$form.Controls.Add($progressBar)

$listBox = New-Object System.Windows.Forms.ListBox
$listBox.Location = New-Object System.Drawing.Point(20, 145)
$listBox.Size = New-Object System.Drawing.Size(560, 250)
$listBox.Font = New-Object System.Drawing.Font("Consolas", 10)
$listBox.BackColor = [System.Drawing.Color]::FromArgb(25, 25, 35)
$listBox.ForeColor = [System.Drawing.Color]::White
$listBox.BorderStyle = "None"
$form.Controls.Add($listBox)

$closeButton = New-Object System.Windows.Forms.Button
$closeButton.Location = New-Object System.Drawing.Point(480, 410)
$closeButton.Size = New-Object System.Drawing.Size(100, 35)
$closeButton.Text = "Close"
$closeButton.Enabled = $false
$closeButton.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$closeButton.Add_Click({ $form.Close() })
$form.Controls.Add($closeButton)

$form.Show()
$listBox.Items.Add("Checking for winget...")
$form.Refresh()
Start-Sleep -Milliseconds 500

try {
    $null = Get-Command winget -ErrorAction Stop
    $listBox.Items.Add("[OK] Winget is available")
    $listBox.Items.Add("")
    $form.Refresh()
} catch {
    $listBox.Items.Add("[ERROR] Winget not found!")
    $listBox.Items.Add("Install Windows App Installer from Microsoft Store")
    $statusLabel.Text = "Installation failed"
    $statusLabel.ForeColor = [System.Drawing.Color]::FromArgb(255, 100, 100)
    $closeButton.Enabled = $true
    $form.Refresh()
    [System.Windows.Forms.Application]::Run($form)
    exit
}

$successCount = 0
$failCount = 0

for ($i = 0; $i -lt $apps.Count; $i++) {
    $app = $apps[$i]
    $statusLabel.Text = "Installing " + $app.Name + "... (" + ($i + 1) + "/" + $apps.Count + ")"
    $listBox.Items.Add("[" + ($i + 1) + "/" + $apps.Count + "] Installing " + $app.Name + "...")
    $form.Refresh()
    
    try {
        winget install --id $app.Id --silent --accept-package-agreements --accept-source-agreements | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            $listBox.Items.Add("    ✓ " + $app.Name + " installed successfully")
            $successCount++
        } else {
            $listBox.Items.Add("    ✗ " + $app.Name + " installation failed")
            $failCount++
        }
    } catch {
        $listBox.Items.Add("    ✗ Error installing " + $app.Name)
        $failCount++
    }
    
    $progressBar.Value = $i + 1
    $listBox.Items.Add("")
    $form.Refresh()
}

$listBox.Items.Add("========================================")
$listBox.Items.Add("Installation Complete!")
$listBox.Items.Add("========================================")
$listBox.Items.Add("Successfully installed: " + $successCount + " app(s)")
$listBox.Items.Add("Failed: " + $failCount + " app(s)")

if ($failCount -eq 0) {
    $statusLabel.Text = "All applications installed successfully!"
    $statusLabel.ForeColor = [System.Drawing.Color]::FromArgb(100, 255, 100)
} else {
    $statusLabel.Text = "Installation completed with " + $failCount + " error(s)"
    $statusLabel.ForeColor = [System.Drawing.Color]::FromArgb(255, 200, 100)
}

$closeButton.Enabled = $true
$form.Refresh()
[System.Windows.Forms.Application]::Run($form)`;

            // Encode PowerShell script to base64
            const psScriptBase64 = btoa(unescape(encodeURIComponent(psScript)));

            // Create batch file that runs PowerShell with bypass
            const batchContent = `@echo off
:: Kliiq Installer - Generated ${new Date().toLocaleString()}
:: Apps: ${selectedAppsData.map(a => a.name).join(', ')}

powershell.exe -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${psScriptBase64}
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
                alert(`✅ Kliiq Installer downloaded!\n\nTo install your apps:\n1. Double-click KliiqInstaller.bat\n2. A GUI window will appear\n3. Watch your apps install!`);
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
