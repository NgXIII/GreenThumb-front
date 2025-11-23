import useTopMessages from "../../shared/hooks/useTopMessages.ts";
import type {Message} from "@/shared/types/message.ts";
import Tag from "../../shared/components/ui/customs/Tag.tsx";
import CardBase from "./CardBase.tsx";
import {formatTimeAgo} from "@/shared/utils/date.ts";

export default function CommunitySection() {
    const { messages, error, loading } = useTopMessages();

    return (
        <section className="bg-gradient-to-b py-12 px-4 sm:px-6 md:px-10 text-center">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Rejoignez la conversion
                </h2>

                <p className="text-gray-600 text-sm sm:text-base mb-10">
                    Découvrez ce que la communauté partage en ce moment
                </p>

                {loading && <p>Chargement...</p>}
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

function CommunityCard({tags, title, author, likeCount, date}: Message) {
    return (
        <CardBase>
            <div className="p-3 sm:p-4">
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {
                        tags.map((tag, index) => (
                            <Tag key={index} tag={tag} color="green" />
                        ))
                    }
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 line-clamp-2">
                    {title}
                </h3>

                <CommunityCardFooter author={author} commentsCount={likeCount} time={date} />
            </div>
        </CardBase>
    );
}

function CommunityCardFooter({author, commentsCount, time}: {author: string, commentsCount: number, time: string}) {
    return (
        <footer className="flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
            <span>{author}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
                 <svg
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     fill="currentColor"
                     className="w-5 h-5 text-green-600 hover:text-green-700 transition-colors duration-200"
                 >
                    <path d="M12 2a1 1 0 0 1 1 1v3c1.933 0 3.5 1.567 3.5 3.5S14.933 13 13 13h-2v8a1 1 0 1 1-2 0v-8H7c-1.933 0-3.5-1.567-3.5-3.5S5.067 6 7 6V3a1 1 0 0 1 1-1h4zm0 2h-2v2h2V4zM7 8C6.172 8 5.5 8.672 5.5 9.5S6.172 11 7 11h6c.828 0 1.5-.672 1.5-1.5S13.828 8 13 8H7z" />
                </svg>
                <span>{commentsCount}</span>
                </span>
            <span>•</span>
            <span>{formatTimeAgo(time)}</span>
        </footer>
    );
}