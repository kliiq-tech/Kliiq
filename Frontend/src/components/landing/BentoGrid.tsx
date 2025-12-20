import { cn } from "../../lib/utils";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "row-span-1 rounded-lg group/bento hover:shadow-2xl transition duration-500 shadow-input dark:shadow-none p-6 dark:bg-[#0F1318]/50 backdrop-blur-sm dark:border-white/5 border border-transparent justify-between flex flex-col space-y-4 relative overflow-hidden",
                className
            )}
        >
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/bento:opacity-30 transition-opacity">
                <div className="w-16 h-16 border-t border-r border-white/20 rounded-tr-lg" />
            </div>

            {header}
            <div className="group-hover/bento:translate-x-1 transition duration-300">
                <div className="flex items-center gap-2 mb-2">
                    {icon}
                    <div className="font-sans font-bold text-white text-lg tracking-tight">
                        {title}
                    </div>
                </div>
                <div className="font-sans font-normal text-text-secondary text-sm leading-relaxed">
                    {description}
                </div>
            </div>
        </div>
    );
};
