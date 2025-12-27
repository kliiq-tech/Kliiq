
/**
 * Utility to generate and trigger download of a Kliiq .bat installer
 */
export function downloadInstaller(selectedApps: { id: string, name: string }[]) {
    if (selectedApps.length === 0) return;

    const appsList = selectedApps.map(app =>
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
    if (selectedApps.length === 1) {
        filename = `Kliiq ${selectedApps[0].name} Installer`
    } else if (selectedApps.length === 2) {
        filename = `Kliiq ${selectedApps[0].name} & ${selectedApps[1].name} Installer`
    } else if (selectedApps.length > 2) {
        filename = `Kliiq ${selectedApps[0].name} & ${selectedApps.length - 1} others Installer`
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

    return filename;
}
