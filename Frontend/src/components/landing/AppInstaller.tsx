import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Download } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'
import { ALL_APPS, APP_CATEGORIES } from '../../data/apps'
import { downloadInstaller } from '../../lib/installer'

// Group apps by category for display
const categories = APP_CATEGORIES.map(cat => ({
    name: cat,
    apps: ALL_APPS.filter(app => app.category === cat)
})).filter(cat => cat.apps.length > 0);

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

        const selectedAppsData = ALL_APPS.filter(a => selectedApps.includes(a.id));

        if (selectedAppsData.length === 0) {
            alert('Please select at least one app to install.');
            setIsGenerating(false);
            return;
        }

        const filename = downloadInstaller(selectedAppsData);

        setTimeout(() => {
            setIsGenerating(false);
            alert(`✅ ${filename} downloaded!\n\nTo install your apps:\n1. Open your Downloads folder\n2. DOUBLE-CLICK the file\n3. Watch your apps install!`);
        }, 1000)
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
                                {category.apps.map((app) => {
                                    const isMobile = category.name === "Games (Mobile)";

                                    const handleAppClick = (e: React.MouseEvent) => {
                                        if (isMobile) {
                                            e.stopPropagation();
                                            const url = (app as any).manualUrl || '#';

                                            // Create temporary link to force download
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.download = app.name + '.apk';
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        } else {
                                            toggleApp(app.id);
                                        }
                                    };

                                    return (
                                        <div
                                            key={app.id}
                                            onClick={handleAppClick}
                                            className="flex flex-col space-y-2 p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center space-x-3 select-none">
                                                {!isMobile && (
                                                    <div className={cn(
                                                        "w-5 h-5 rounded border border-white/20 flex items-center justify-center transition-all duration-200 flex-shrink-0",
                                                        selectedApps.includes(app.id)
                                                            ? "bg-primary border-primary text-black"
                                                            : "bg-surface group-hover:border-primary/50"
                                                    )}>
                                                        {selectedApps.includes(app.id) && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 flex-grow">
                                                    <img
                                                        src={isMobile ? (app as any).icon : `https://www.google.com/s2/favicons?domain=${app.domain}&sz=128`}
                                                        alt={app.name}
                                                        className={cn(
                                                            "w-5 h-5 object-contain rounded-sm transition-all duration-200",
                                                            (selectedApps.includes(app.id) || isMobile)
                                                                ? "grayscale-0 opacity-100"
                                                                : "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100"
                                                        )}
                                                        onError={(e) => {
                                                            const img = e.target as HTMLImageElement;
                                                            if (!img.src.includes('google.com')) {
                                                                img.src = `https://www.google.com/s2/favicons?domain=${app.domain}&sz=128`;
                                                            } else {
                                                                img.style.display = 'none';
                                                            }
                                                        }}
                                                    />
                                                    <span className={cn(
                                                        "text-sm transition-colors",
                                                        (selectedApps.includes(app.id) || isMobile) ? "text-white font-medium" : "text-text-muted group-hover:text-text-secondary"
                                                    )}>
                                                        {app.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
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
                            2. Download And Run Your Custom Installer
                        </h3>
                        {selectedApps.length === 0 && (
                            <p className="text-red-500 font-medium max-w-xl mx-auto">
                                Please check off the apps you want above.
                            </p>
                        )}
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
                        <p className="text-xs">
                            Kliiq works on Windows 11, 10, 8.x, and 7
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
