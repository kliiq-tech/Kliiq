import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
    size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
                    {
                        'bg-brand-gradient text-white hover:opacity-90 shadow-lg shadow-primary/25': variant === 'primary',
                        'bg-surface text-white border border-white/10 hover:bg-surface/80 hover:border-white/20': variant === 'secondary',
                        'border border-white/10 bg-transparent text-white hover:bg-white/5': variant === 'outline',
                        'bg-transparent text-text-secondary hover:text-white hover:bg-white/5': variant === 'ghost',
                        'h-9 px-4 text-sm': size === 'sm',
                        'h-12 px-6 text-base': size === 'md',
                        'h-14 px-8 text-lg': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button }
