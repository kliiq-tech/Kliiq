export default function handler(req, res) {
    try {
        if (req.method === 'GET') {
            return res.status(200).json({ status: 'API is active' });
        }

        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        const body = req.body;
        const apps = body?.apps;

        if (!apps || !Array.isArray(apps)) {
            return res.status(400).json({
                error: 'Invalid app list',
                received: typeof body
            });
        }

        // Generate the App Data Array
        const selectedAppsList = apps.map(a => `@{id="${a.id}"; name="${a.name}"}`).join(',\n    ');

        // Professional Installer Payload
        // Using parts to avoid template literal interpolation errors
        const part1 = `<# :
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
    `;

        const part2 = `
)

# --- Theme Colors ---
$bgColor = [System.Drawing.Color]::FromArgb(240, 240, 240)
$headerColor = [System.Drawing.Color]::FromArgb(0, 88, 216)
$textColor = [System.Drawing.Color]::FromArgb(51, 51, 51)

# --- Form Setup ---
$form = New-Object System.Windows.Forms.Form
$form.Text = "Kliiq Installer"
$form.Size = New-Object System.Drawing.Size(500, 480)
$form.BackColor = $bgColor
$form.FormBorderStyle = 'FixedDialog'
$form.MaximizeBox = $false
$form.MinimizeBox = $true
$form.StartPosition = 'CenterScreen'
$form.TopMost = $true

# Force the window to handle its own messages frequently
$form.Add_Resize({ [System.Windows.Forms.Application]::DoEvents() })

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

# --- Footer Panel ---
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
\$form.Add_Shown({
    \$form.Focus()
    \$totalApps = \$apps.Count
    \$currentAppIndex = 0

    foreach (\$app in \$apps) {
        \$currentAppIndex++
        \$baseProgress = [Math]::Floor(((\$currentAppIndex - 1) / \$totalApps) * 100)
        \$segmentSize = [Math]::Floor(100 / \$totalApps)

        # --- Phase 1: Downloading ---
        \$statusLabel.Text = "Downloading \$(\$app.name)..."
        \$targetItem = \$listView.Items | Where-Object { \$_.Name -eq \$app.id }
        if (\$targetItem) { \$targetItem.SubItems[1].Text = "Downloading" }
        
        # Start a dummy 'tick' for downloading
        for (\$i = 1; \$i -le 40; \$i++) {
            \$progressBar.Value = [Math]::Min(99, \$baseProgress + [Math]::Floor(\$segmentSize * (\$i / 100)))
            [System.Windows.Forms.Application]::DoEvents()
            Start-Sleep -Milliseconds 20
        }

        # --- Phase 2: Installing ---
        \$statusLabel.Text = "Installing \$(\$app.name)..."
        if (\$targetItem) { \$targetItem.SubItems[1].Text = "Installing" }
        
        # Start Winget as a background process
        \$proc = Start-Process "winget" -ArgumentList "install --id \$(\$app.id) -e --accept-source-agreements --accept-package-agreements --source winget --silent" -PassThru -NoNewWindow -WindowStyle Hidden
        
        # Smooth progress while installing
        \$installProgress = 40
        while (!\$proc.HasExited) {
            if (\$installProgress -lt 95) {
                \$installProgress += 0.5
                \$progressBar.Value = [Math]::Min(99, \$baseProgress + [Math]::Floor(\$segmentSize * (\$installProgress / 100)))
            }
            [System.Windows.Forms.Application]::DoEvents()
            Start-Sleep -Milliseconds 200
        }

        # Update Status based on exit code
        if (\$proc.ExitCode -eq 0 -or \$proc.ExitCode -eq 0x8A150039 -or \$proc.ExitCode -eq 2316697657) {
            if (\$targetItem) { \$targetItem.SubItems[1].Text = "OK" }
        } else {
            if (\$targetItem) { \$targetItem.SubItems[1].Text = "Failed" }
        }

        # Snap to end of segment
        \$progressBar.Value = [Math]::Min(100, \$baseProgress + \$segmentSize)
        [System.Windows.Forms.Application]::DoEvents()
    }

    \$progressBar.Value = 100
    \$statusLabel.Text = "Installation Complete!"
    [System.Windows.Forms.Application]::DoEvents()
    Start-Sleep -Seconds 3
    \$form.Close()
})

$form.ShowDialog()
`;

        const scriptContent = part1 + selectedAppsList + part2;

        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=KliiqInstaller.cmd');
        res.send(scriptContent);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
