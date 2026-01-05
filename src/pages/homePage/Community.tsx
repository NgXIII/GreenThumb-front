import useTopMessages from "../../shared/hooks/useTopMessages.ts";
import CardBase from "./CardBase.tsx";
import {formatTimeAgo} from "@/shared/utils/date.ts";
import type {Message} from "@/shared/types/channel.ts";

export default function CommunitySection() {
    const { messages, error, loading } = useTopMessages();

    return (
        <section className="w-full bg-gt-surface py-12 px-4 sm:px-6 md:px-10 text-center transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gt-text mb-2">
                    Rejoignez la conversation
                </h2>

                <p className="text-gt-text-muted text-sm sm:text-base mb-10">
                    Découvrez ce que la communauté partage en ce moment
                </p>

                {loading && <p className="text-gt-text-muted">Chargement...</p>}
                {error && <p className="text-red-500">Erreur : {error}</p>}
                {!loading && !error && <CommunityCards data={messages} />}
            </div>
        </section>
    );
}

function CommunityCards({ data }: { data: Message[]}) {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {data.map((item, index) => (
                <CommunityCard key={index} {...item} />
            ))}
        </section>
    );
}

function CommunityCard({text, author, timestamp}: Message) {
    return (
        <CardBase>
            <div className="p-3 sm:p-4">

                <h3 className="text-base sm:text-lg font-semibold text-gt-text mb-4 line-clamp-2">
                    {text}
                </h3>

                <CommunityCardFooter author={author} time={timestamp} />
            </div>
        </CardBase>
    );
}

function CommunityCardFooter({author, time}: {author: string, time: string}) {
    return (
        <footer className="flex flex-wrap items-center gap-x-2 text-sm text-gt-text-muted justify-between">
            <span>{author}</span>
            <span>{formatTimeAgo(time)}</span>
        </footer>
    );
}