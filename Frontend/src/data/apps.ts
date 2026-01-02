
export interface AppData {
    id: string; // Winget ID or unique identifier
    name: string;
    domain: string;
    icon?: string;
    version?: string;
    size?: string;
    category: string;
    manualUrl?: string; // For things like APKs
    platform?: 'windows' | 'mobile' | 'both';
}

export const APP_CATEGORIES = [
    "Web Browsers",
    "Messaging",
    "Media",
    "Imaging",
    "Documents",
    "Security",
    "Online Storage",
    "Compression",
    "Developer Tools",
    "Runtimes",
    "Utilities",
    "File Sharing",
    "Other"
] as const;

export type CategoryName = typeof APP_CATEGORIES[number];

export const ALL_APPS: AppData[] = [
    // Web Browsers
    { id: "Google.Chrome", name: "Chrome", domain: "chrome.com", category: "Web Browsers", version: "v120.0", size: "95 MB" },
    { id: "Mozilla.Firefox", name: "Firefox", domain: "mozilla.org", category: "Web Browsers", version: "v121.0", size: "112 MB" },
    { id: "Brave.Brave", name: "Brave", domain: "brave.com", category: "Web Browsers", version: "v1.61", size: "98 MB" },
    { id: "Microsoft.Edge", name: "Edge", domain: "microsoftedge.com", category: "Web Browsers", version: "v120.0", size: "145 MB" },
    { id: "Opera.Opera", name: "Opera", domain: "opera.com", category: "Web Browsers", version: "v106.0", size: "105 MB" },

    // Messaging
    { id: "Discord.Discord", name: "Discord", domain: "discord.com", category: "Messaging", version: "v1.0.9031", size: "156 MB" },
    { id: "Microsoft.Teams", name: "Teams", domain: "teams.microsoft.com", category: "Messaging", version: "v24004", size: "210 MB" },
    { id: "SlackTechnologies.Slack", name: "Slack", domain: "slack.com", category: "Messaging", version: "v4.36", size: "185 MB" },
    { id: "Zoom.Zoom", name: "Zoom", domain: "zoom.us", category: "Messaging", version: "v5.17", size: "82 MB" },
    { id: "WhatsApp.WhatsApp", name: "WhatsApp", domain: "whatsapp.com", category: "Messaging", version: "v2.23", size: "92 MB" },
    { id: "Telegram.TelegramDesktop", name: "Telegram", domain: "telegram.org", category: "Messaging", version: "v4.11", size: "45 MB" },

    // Media
    { id: "VideoLAN.VLC", name: "VLC", domain: "videolan.org", category: "Media", version: "3.0.20", size: "42 MB" },
    { id: "Spotify.Spotify", name: "Spotify", domain: "spotify.com", category: "Media", version: "1.2.25", size: "82 MB" },
    { id: "Audacity.Audacity", name: "Audacity", domain: "audacityteam.org", category: "Media", version: "v3.4", size: "35 MB" },
    { id: "Apple.iTunes", name: "iTunes", domain: "apple.com", category: "Media", version: "v12.13", size: "250 MB" },
    { id: "HandBrake.HandBrake", name: "HandBrake", domain: "handbrake.fr", category: "Media", version: "v1.7.2", size: "22 MB" },

    // Imaging
    { id: "KDE.Krita", name: "Krita", domain: "krita.org", category: "Imaging", version: "5.2.2", size: "124 MB" },
    { id: "BlenderFoundation.Blender", name: "Blender", domain: "blender.org", category: "Imaging", version: "4.0.2", size: "312 MB" },
    { id: "GIMP.GIMP", name: "GIMP", domain: "gimp.org", category: "Imaging", version: "2.10.36", size: "285 MB" },
    { id: "Inkscape.Inkscape", name: "Inkscape", domain: "inkscape.org", category: "Imaging", version: "v1.3", size: "115 MB" },
    { id: "ShareX.ShareX", name: "ShareX", domain: "getsharex.com", category: "Imaging", version: "v15.0", size: "15 MB" },

    // Documents
    { id: "Foxit.FoxitReader", name: "Foxit Reader", domain: "foxit.com", category: "Documents", version: "v2023.3", size: "125 MB" },
    { id: "LibreOffice.LibreOffice", name: "LibreOffice", domain: "libreoffice.org", category: "Documents", version: "v7.6", size: "345 MB" },
    { id: "SumatraPDF.SumatraPDF", name: "SumatraPDF", domain: "sumatrapdfreader.org", category: "Documents", version: "v3.5", size: "12 MB" },

    // Security
    { id: "Malwarebytes.Malwarebytes", name: "Malwarebytes", domain: "malwarebytes.com", category: "Security", version: "v4.6", size: "245 MB" },
    { id: "Avast.AvastFreeAntivirus", name: "Avast", domain: "avast.com", category: "Security", version: "v23.11", size: "280 MB" },
    { id: "AVG.AVGAntiFree", name: "AVG", domain: "avg.com", category: "Security", version: "v23.11", size: "275 MB" },

    // Online Storage
    { id: "Dropbox.Dropbox", name: "Dropbox", domain: "dropbox.com", category: "Online Storage", version: "v188.4", size: "115 MB" },
    { id: "Google.Drive", name: "Google Drive", domain: "google.com", category: "Online Storage", version: "v84.0", size: "185 MB" },
    { id: "Microsoft.OneDrive", name: "OneDrive", domain: "microsoft.com", category: "Online Storage", version: "v23.226", size: "55 MB" },

    // Compression
    { id: "7zip.7zip", name: "7-Zip", domain: "7-zip.org", category: "Compression", version: "23.01", size: "1.5 MB" },
    { id: "PeaZip.PeaZip", name: "PeaZip", domain: "peazip.github.io", category: "Compression", version: "v9.6", size: "12 MB" },
    { id: "WinRAR.WinRAR", name: "WinRAR", domain: "win-rar.com", category: "Compression", version: "v6.24", size: "3.5 MB" },

    // Developer Tools
    { id: "Microsoft.VisualStudioCode", name: "VS Code", domain: "code.visualstudio.com", category: "Developer Tools", version: "v1.85", size: "312 MB" },
    { id: "Anysphere.Cursor", name: "Cursor", domain: "cursor.com", category: "Developer Tools", version: "v0.15", size: "145 MB" },
    { id: "Python.Python.3.12", name: "Python 3.12", domain: "python.org", category: "Developer Tools", version: "3.12.1", size: "25 MB" },
    { id: "Git.Git", name: "Git", domain: "git-scm.com", category: "Developer Tools", version: "2.43.0", size: "58 MB" },
    { id: "Postman.Postman", name: "Postman", domain: "postman.com", category: "Developer Tools", version: "v10.15", size: "145 MB" },
    { id: "Flashlight.Figma", name: "Figma", domain: "figma.com", category: "Developer Tools", version: "Latest", size: "Web/Electron" },

    // Runtimes
    { id: "Oracle.JavaRuntimeEnvironment", name: "Java JRE", domain: "oracle.com", category: "Runtimes", version: "v8u391", size: "85 MB" },
    { id: "Microsoft.DotNet.DesktopRuntime.8", name: ".NET Desktop 8", domain: "microsoft.com", category: "Runtimes", version: "v8.0", size: "55 MB" },

    // Utilities
    { id: "AnyDeskSoftwareGmbH.AnyDesk", name: "AnyDesk", domain: "anydesk.com", category: "Utilities", version: "7.1.13", size: "5 MB" },
    { id: "Piriform.CCleaner", name: "CCleaner", domain: "ccleaner.com", category: "Utilities", version: "6.19", size: "75 MB" },
    { id: "AntibodySoftware.WizTree", name: "WizTree", domain: "diskanalyzer.com", category: "Utilities", version: "4.15", size: "6 MB" },
    { id: "TeamViewer.TeamViewer", name: "TeamViewer", domain: "teamviewer.com", category: "Utilities", version: "v15.48", size: "35 MB" },

    // File Sharing
    { id: "qBittorrent.qBittorrent", name: "qBittorrent", domain: "qbittorrent.org", category: "File Sharing", version: "v4.6", size: "28 MB" },

    // Other
    { id: "Valve.Steam", name: "Steam", domain: "steampowered.com", category: "Other", version: "Latest", size: "1.5 MB", platform: "windows" },
    { id: "EpicGames.EpicGamesLauncher", name: "Epic Games", domain: "epicgames.com", category: "Other", version: "Latest", size: "45 MB", platform: "windows" },
    { id: "Evernote.Evernote", name: "Evernote", domain: "evernote.com", category: "Other", version: "v10.65", size: "156 MB", platform: "windows" }
];
