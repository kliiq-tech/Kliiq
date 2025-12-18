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

        // Define the Native PowerShell GUI Script (WPF)
        const psScript = `
Add-Type -AssemblyName PresentationFramework
Add-Type -AssemblyName System.Windows.Forms

$apps = @(
    ${selectedAppData.join(',\n    ')}
)

$xaml = @"
<Window xmlns="http://schemas.microsoft.com/winfx/2000/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2000/xaml"
        Title="Kliiq Installer" Height="450" Width="500" Background="#F0F0F0"
        WindowStartupLocation="CenterScreen" ResizeMode="NoResize" Topmost="True">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>
        
        <!-- Header -->
        <Border Grid.Row="0" Background="LinearGradient 0,0 1,1">
            <Border.Background>
                <LinearGradientBrush StartPoint="0,0" EndPoint="1,0">
                    <GradientStop Color="#0058d8" Offset="0.0" />
                    <GradientStop Color="#0096ff" Offset="1.0" />
                </LinearGradientBrush>
            </Border.Background>
            <StackPanel Orientation="Horizontal" Padding="10">
                <Ellipse Width="16" Height="16" Fill="White" Margin="0,0,10,0"/>
                <TextBlock Text="Kliiq Installer" Foreground="White" FontWeight="Bold" VerticalAlignment="Center"/>
            </StackPanel>
        </Border>

        <!-- Main Content -->
        <StackPanel Grid.Row="1" Padding="25" Background="White">
            <TextBlock Name="CurrentStatus" Text="Initializing..." FontSize="15" Margin="0,0,0,15" Foreground="#333333"/>
            
            <Border BorderBrush="#CCCCCC" BorderThickness="1" Height="25" CornerRadius="2" ClipToBounds="True">
                <ProgressBar Name="OverallProgress" Minimum="0" Maximum="100" Value="0" Height="25" BorderThickness="0">
                    <ProgressBar.Foreground>
                        <LinearGradientBrush StartPoint="0,0" EndPoint="0,1">
                            <GradientStop Color="#28e028" Offset="0.0" />
                            <GradientStop Color="#1cb81c" Offset="1.0" />
                        </LinearGradientBrush>
                    </ProgressBar.Foreground>
                </ProgressBar>
            </Border>

            <Grid Margin="0,15,0,0">
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="*"/>
                    <ColumnDefinition Width="Auto"/>
                </Grid.ColumnDefinitions>
                <Button Name="ToggleDetails" Content="Hide details ▲" Background="Transparent" BorderThickness="0" Foreground="#0066CC" HorizontalAlignment="Left" Cursor="Hand"/>
                <StackPanel Grid.Column="1" Orientation="Horizontal">
                    <Button Name="WriteFeedback" Content="Write feedback" Background="Transparent" BorderThickness="0" Foreground="#0066CC" Margin="0,0,20,0" Cursor="Hand"/>
                    <Button Name="CancelBtn" Content="Cancel" Width="80" Padding="5" Background="#E1E1E1" BorderBrush="#AAAAAA" BorderThickness="1"/>
                </StackPanel>
            </Grid>

            <ScrollViewer Name="DetailPanel" Margin="0,15,0,0" Height="180" VerticalScrollBarVisibility="Auto" BorderBrush="#EEEEEE" BorderThickness="1">
                <ItemsControl Name="AppItems">
                    <ItemsControl.ItemTemplate>
                        <DataTemplate>
                            <Grid Margin="0,0,0,2">
                                <Grid.ColumnDefinitions>
                                    <ColumnDefinition Width="*"/>
                                    <ColumnDefinition Width="150"/>
                                </Grid.ColumnDefinitions>
                                <Border BorderBrush="#F9F9F9" BorderThickness="0,0,1,1" Padding="8,4">
                                    <TextBlock Text="{Binding name}" FontSize="12"/>
                                </Border>
                                <Border Grid.Column="1" BorderBrush="#F9F9F9" BorderThickness="0,0,0,1" Padding="8,4">
                                    <TextBlock Text="{Binding status}" FontSize="12" Name="StatusText"/>
                                </Border>
                            </Grid>
                        </DataTemplate>
                    </ItemsControl.ItemTemplate>
                </ItemsControl>
            </ScrollViewer>
        </StackPanel>

        <!-- Footer -->
        <Border Grid.Row="2" Background="#F0F0F0" Padding="5" BorderBrush="#CCCCCC" BorderThickness="0,1,0,0">
            <TextBlock Text="Kliiq Installer v1.0" HorizontalAlignment="Right" FontSize="9" Foreground="#999999" FontStyle="Italic"/>
        </Border>
    </Grid>
</Window>
"@

$reader = [XML.XmlReader]::Create([System.IO.StringReader] $xaml)
$window = [Windows.Markup.XamlReader]::Load($reader)

# Get UI Elements
$currentStatus = $window.FindName("CurrentStatus")
$progressBar = $window.FindName("OverallProgress")
$appItems = $window.FindName("AppItems")
$detailPanel = $window.FindName("DetailPanel")
$toggleDetails = $window.FindName("ToggleDetails")
$cancelBtn = $window.FindName("CancelBtn")

# Setup App Data
$observableApps = New-Object System.Collections.ObjectModel.ObservableCollection[PSObject]
foreach($app in $apps) {
    $observableApps.Add([PSCustomObject]@{id=$app.id; name=$app.name; status="Waiting"})
}
$appItems.ItemsSource = $observableApps

# Toggle Details Logic
$toggleDetails.Add_Click({
    if ($detailPanel.Visibility -eq "Visible") {
        $detailPanel.Visibility = "Collapsed"
        $toggleDetails.Content = "Show details ▼"
        $window.Height = 250
    } else {
        $detailPanel.Visibility = "Visible"
        $toggleDetails.Content = "Hide details ▲"
        $window.Height = 450
    }
})

$cancelBtn.Add_Click({ $window.Close() })

# Background Installation Thread
$window.Add_Loaded({
    $scriptBlock = {
        param($appsToInstall, $control)
        
        $count = 0
        foreach ($app in $appsToInstall) {
            $control.Dispatcher.Invoke([Action]{ 
                $currentStatus.Text = "Installing $($app.name)..."
            })

            # Simulate Download
            $control.Dispatcher.Invoke([Action]{ 
                $observableApps | Where-Object { $_.id -eq $app.id } | ForEach-Object { $_.status = "Downloading" }
                $appItems.Items.Refresh()
            })
            Start-Sleep -Milliseconds 800

            # Real Installation
            $control.Dispatcher.Invoke([Action]{ 
                $observableApps | Where-Object { $_.id -eq $app.id } | ForEach-Object { $_.status = "Installing" }
                $appItems.Items.Refresh()
            })

            try {
                winget install --id $app.id -e --accept-source-agreements --accept-package-agreements --source winget --silent
                $status = "OK"
            } catch {
                $status = "Failed"
            }

            $control.Dispatcher.Invoke([Action]{ 
                $observableApps | Where-Object { $_.id -eq $app.id } | ForEach-Object { $_.status = $status }
                $appItems.Items.Refresh()
                $count++
                $progressBar.Value = ($count / $appsToInstall.Count) * 100
            })
        }

        $control.Dispatcher.Invoke([Action]{ 
            $currentStatus.Text = "Installation Complete!"
            $progressBar.Value = 100
        })
        
        Start-Sleep -Seconds 3
        $control.Dispatcher.Invoke([Action]{ $window.Close() })
    }

    $thread = [System.Threading.Thread]::new($scriptBlock)
    $thread.SetApartmentState([System.Threading.ApartmentState]::STA)
    $thread.Start($apps, $window)
})

$window.ShowDialog()
`
        // 2. Encode to Base64 UTF-16LE
        const toBase64 = (str: string) => {
            const codeUnits = new Uint16Array(str.length);
            for (let i = 0; i < codeUnits.length; i++) {
                codeUnits[i] = str.charCodeAt(i);
            }
            const charCodes = new Uint8Array(codeUnits.buffer);
            let result = "";
            for (let i = 0; i < charCodes.length; i += 8192) {
                result += String.fromCharCode.apply(null, Array.from(charCodes.subarray(i, i + 8192)));
            }
            return btoa(result);
        }

        const encodedPs = toBase64(psScript)

        // 3. Generate the Batch Wrapper
        const scriptContent = `@echo off
set "params=%*"
cd /d "%~dp0" && ( if exist "%temp%\\getadmin.vbs" del "%temp%\\getadmin.vbs" ) && fsutil dirty query %systemdrive% 1>nul 2>nul || (  echo Set UAC = CreateObject^("Shell.Application"^) : UAC.ShellExecute "cmd.exe", "/k cd ""%~sdp0"" && %~s0 %params%", "", "runas", 1 >> "%temp%\\getadmin.vbs" && "%temp%\\getadmin.vbs" && exit /B )

:: Running Kliiq Installer with Hidden Backdrop...
powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -EncodedCommand ${encodedPs}
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
                        Kliiq works on Windows 11, 10, 8.x, 7, and equivalent Server versions.
                    </p>
                </motion.div>

            </div>
        </section>
    )
}
