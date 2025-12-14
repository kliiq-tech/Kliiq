import { Marquee } from './Marquee'
import { cn } from '../../lib/utils'

const reviews = [
    {
        name: "Jack",
        username: "@jack",
        body: "Setting up a new PC usually takes me hours. With Kliiq, I had everything ready in minutes.",
        img: "https://avatar.vercel.sh/jack",
    },
    {
        name: "Jill",
        username: "@jill",
        body: "This feels like the Figma of software setup. Clean, fast, and exactly what I needed.",
        img: "https://avatar.vercel.sh/jill",
    },
    {
        name: "John",
        username: "@john",
        body: "Finally, a way to manage all my development tools without fighting with the command line.",
        img: "https://avatar.vercel.sh/john",
    },
    {
        name: "Jane",
        username: "@jane",
        body: "I don't know how I lived without this. It's like Ninite but actually beautiful.",
        img: "https://avatar.vercel.sh/jane",
    },
    {
        name: "Jenny",
        username: "@jenny",
        body: "The auto-update feature is a lifesaver. I never have to worry about outdated apps again.",
        img: "https://avatar.vercel.sh/jenny",
    },
    {
        name: "James",
        username: "@james",
        body: "Clean, minimal, and just works. The way software management should be.",
        img: "https://avatar.vercel.sh/james",
    },
];

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) => {
    return (
        <figure
            className={cn(
                "relative w-72 cursor-pointer overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:scale-110 hover:z-10 hover:shadow-2xl hover:border-primary/50",
                // light styles
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                // dark styles
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                "border-white/10 bg-surface/50 backdrop-blur-md"
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <img className="rounded-full" width="40" height="40" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-base font-semibold dark:text-white text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40 text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-4 text-sm text-text-secondary leading-relaxed">"{body}"</blockquote>
        </figure>
    );
};

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-4">
                    What early users are saying
                </h2>
            </div>
            <div className="relative flex h-[300px] w-full flex-col items-center justify-center overflow-hidden">
                <Marquee pauseOnHover className="[--duration:40s]">
                    {reviews.map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent z-10"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent z-10"></div>
            </div>
        </section>
    )
}
