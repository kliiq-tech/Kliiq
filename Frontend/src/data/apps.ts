
export interface AppData {
    id: string; // Winget ID or unique identifier
    name: string;
    domain: string;
    icon?: string;
    version?: string;
    size?: string;
    category: string;
    manualUrl?: string; // For things like APKs
}

export const APP_CATEGORIES = [
    "Web Browsers",
    "Messaging",
    "Development",
    "Media",
    "Utilities",
    "Imaging",
    "Documents",
    "Security",
    "Online Storage",
    "Compression",
    "Runtime",
    "Games (Mobile)"
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
    { id: "Zoom.Zoom", name: "Zoom", domain: "zoom.us", category: "Messaging", version: "v5.17", size: "82 MB" },
    { id: "Discord.Discord", name: "Discord", domain: "discord.com", category: "Messaging", version: "v1.0.9031", size: "156 MB" },
    { id: "Microsoft.Teams", name: "Teams", domain: "teams.microsoft.com", category: "Messaging", version: "v24004", size: "210 MB" },
    { id: "SlackTechnologies.Slack", name: "Slack", domain: "slack.com", category: "Messaging", version: "v4.36", size: "185 MB" },
    { id: "WhatsApp.WhatsApp", name: "WhatsApp", domain: "whatsapp.com", category: "Messaging", version: "v2.23", size: "92 MB" },

    // Development
    { id: "Microsoft.VisualStudioCode", name: "VS Code", domain: "code.visualstudio.com", category: "Development", version: "v1.85", size: "312 MB" },
    { id: "Python.Python.3.12", name: "Python 3.12", domain: "python.org", category: "Development", version: "3.12.1", size: "25 MB" },
    { id: "Git.Git", name: "Git", domain: "git-scm.com", category: "Development", version: "2.43.0", size: "58 MB" },
    { id: "Docker.DockerDesktop", name: "Docker", domain: "docker.com", category: "Development", version: "v4.26", size: "580 MB" },
    { id: "Anysphere.Cursor", name: "Cursor", domain: "cursor.com", category: "Development", version: "v0.15", size: "145 MB" },

    // Media
    { id: "VideoLAN.VLC", name: "VLC", domain: "videolan.org", category: "Media", version: "3.0.20", size: "42 MB" },
    { id: "Spotify.Spotify", name: "Spotify", domain: "spotify.com", category: "Media", version: "1.2.25", size: "82 MB" },
    { id: "OBSProject.OBSStudio", name: "OBS Studio", domain: "obsproject.com", category: "Media", version: "v29.1", size: "120 MB" },
    { id: "Audacity.Audacity", name: "Audacity", domain: "audacityteam.org", category: "Media", version: "v3.4", size: "35 MB" },

    // Utilities
    { id: "7zip.7zip", name: "7-Zip", domain: "7-zip.org", category: "Compression", version: "23.01", size: "1.5 MB" },
    { id: "AntibodySoftware.WizTree", name: "WizTree", domain: "diskanalyzer.com", category: "Utilities", version: "4.15", size: "6 MB" },
    { id: "AnyDeskSoftwareGmbH.AnyDesk", name: "AnyDesk", domain: "anydesk.com", category: "Utilities", version: "7.1.13", size: "5 MB" },
    { id: "Piriform.CCleaner", name: "CCleaner", domain: "ccleaner.com", category: "Utilities", version: "6.19", size: "75 MB" },

    // Imaging
    { id: "GIMP.GIMP", name: "GIMP", domain: "gimp.org", category: "Imaging", version: "2.10.36", size: "285 MB" },
    { id: "BlenderFoundation.Blender", name: "Blender", domain: "blender.org", category: "Imaging", version: "4.0.2", size: "312 MB" },
    { id: "KDE.Krita", name: "Krita", domain: "krita.org", category: "Imaging", version: "5.2.2", size: "124 MB" },
    { id: "Figma.Figma", name: "Figma", domain: "figma.com", category: "Imaging", version: "Latest", size: "Web/Electron" },

    // Mobile Games (Special case)
    { id: "Local.FizzFazz", name: "Fizz Fazz", domain: "local", category: "Games (Mobile)", version: "v1.0", size: "45 MB", manualUrl: "/games/FizzFazz_Port.apk" }
];
