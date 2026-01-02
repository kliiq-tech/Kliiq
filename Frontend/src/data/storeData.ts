export interface StoreApp {
    id: string;
    name: string;
    publisher: string;
    category: string;
    icon: string;
    rating?: number;
    price: number | 'free';
    originalPrice?: number;
    description: string;
    isFeatured?: boolean;
    tags?: string[];
    platform?: 'windows' | 'mobile' | 'both';
}

export interface HeroSlide {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    cta: string;
    link: string;
}

export const heroSlides: HeroSlide[] = [
    {
        id: '1',
        title: 'Save up to 50% on games',
        subtitle: 'Countdown Sale ends 1/7.',
        image: '/store/hero-games.jpg',
        cta: 'See details',
        link: '/store/games'
    },
    {
        id: '2',
        title: 'Save up to 50% on apps',
        subtitle: 'Limited time offer',
        image: '/store/hero-apps.jpg',
        cta: 'Browse apps',
        link: '/store/apps'
    }
];

export const trendingGames: StoreApp[] = [
    {
        id: 'roblox',
        name: 'Roblox - Windows',
        publisher: 'Roblox Corporation',
        category: 'Action & adventure',
        icon: 'https://store-images.s-microsoft.com/image/apps.45537.13850459746698427.f2d1b0a4-6d8e-4d7f-8d0e-4e0d5e0e0e0e',
        rating: 4.5,
        price: 'free',
        description: 'Everything you love, all in Roblox.',
        isFeatured: true
    },
    {
        id: 'fortnite',
        name: 'Fortnite',
        publisher: 'Epic Games',
        category: 'Action & adventure',
        icon: 'https://cdn2.unrealengine.com/Fortnite%2Ffnbr-17-00-launcher-icon-1024x1024-1024x1024-b1e8d4e3f5e5.png',
        rating: 4.6,
        price: 'free',
        description: 'Battle Royale, Creative, Save the World',
        tags: ['Game Pass Ultimate + PC', 'Multiplayer']
    },
    {
        id: 'minecraft',
        name: 'Minecraft: Java Edition',
        publisher: 'Mojang Studios',
        category: 'Action & adventure',
        icon: 'https://www.minecraft.net/content/dam/games/minecraft/key-art/Games_Subnav_Minecraft-300x465.jpg',
        rating: 4.5,
        price: 29.99,
        originalPrice: 29.99,
        description: 'Explore infinite worlds and build everything',
        tags: ['Game Pass']
    }
];

export const trendingApps: StoreApp[] = [
    {
        id: 'discord',
        name: 'Discord',
        publisher: 'Discord Inc.',
        category: 'Social',
        icon: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png',
        price: 'free',
        description: 'Your place to talk and hang out'
    },
    {
        id: 'spotify',
        name: 'Spotify - Music and Podcasts',
        publisher: 'Spotify AB',
        category: 'Music',
        icon: 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png',
        price: 'free',
        description: 'Listen to music and podcasts'
    },
    {
        id: 'netflix',
        name: 'Netflix',
        publisher: 'Netflix, Inc.',
        category: 'Entertainment',
        icon: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png',
        price: 'free',
        description: 'Watch TV shows and movies'
    }
];

export const bestSellingGames: StoreApp[] = [
    {
        id: 'cod',
        name: 'Call of Duty®',
        publisher: 'Activision',
        category: 'Shooter',
        icon: 'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/kronos/common/social-share/social-share-image.jpg',
        price: 69.99,
        description: 'The iconic first-person shooter'
    },
    {
        id: 'arc-raiders',
        name: 'ARC Raiders',
        publisher: 'Embark Studios',
        category: 'Action',
        icon: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1369620/header.jpg',
        price: 39.99,
        originalPrice: 49.99,
        description: 'Cooperative third-person shooter'
    }
];

export const popularApps: StoreApp[] = [
    {
        id: 'pdf-x',
        name: 'PDF X: PDF Editor & PDF Reader',
        publisher: 'Kdan Mobile',
        category: 'Productivity',
        icon: 'https://play-lh.googleusercontent.com/9XKD5S7rwQ-Uu9Y7f_9H8rJYvLLqg5wT5zCqJZ5Z5Z5',
        price: 'free',
        description: 'View & Edit PDF files'
    },
    {
        id: 'nitrado',
        name: 'Nitrado',
        publisher: 'marbis GmbH',
        category: 'Utilities',
        icon: 'https://nitrado.net/images/nitrado-logo.png',
        price: 'free',
        description: 'Gameserver hosting'
    },
    {
        id: 'ibis-paint',
        name: 'ibis Paint',
        publisher: 'ibis inc.',
        category: 'Photo & video',
        icon: 'https://ssl.ibisstatic.com/webimage/icon/app_icon.png',
        price: 'free',
        description: 'Drawing and painting app'
    },
    {
        id: 'doc-scan',
        name: 'Doc Scan PDF Scanner',
        publisher: 'Indy Mobile App',
        category: 'Productivity',
        icon: 'https://play-lh.googleusercontent.com/doc-scan-icon.png',
        price: 'free',
        description: 'Scan documents to PDF'
    }
];
