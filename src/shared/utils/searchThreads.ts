import type {Channel} from "@/shared/types/channel.ts";
import type {SearchResult} from "@/shared/types/SearchResult.ts";

export function searchThreads(channels: Channel[] | null, searchTerm: string): SearchResult[] {
   if( channels === null || channels.length === 0 ) {
       return [] as SearchResult[];
   }

    const term = searchTerm.toLowerCase().trim();

    if (term === "") {
        return channels.map((channel: Channel): SearchResult => ({
            channelName: channel.name,
            threads: channel.threads || [],
            matchType: 'channel'
        }))
    }

    const results: SearchResult[] = [];

    channels.forEach((channel) => {
        const channelMatches = channel.name.toLowerCase().startsWith(term);

        const threadsMatches = channel.threads?.filter(
            thread => thread.title.toLowerCase().includes(term)
        ) || [];

        if (channelMatches || threadsMatches.length > 0) {
            let matchType: 'both' | 'channel' | 'thread';

            if (channelMatches && threadsMatches.length > 0) {
                matchType = 'both'
            } else if(channelMatches) {
                matchType = 'channel'
            } else {
                matchType = 'thread'
            }

            const threadsToInclude = channelMatches ? channel.threads : threadsMatches;

            const result: SearchResult = {
                channelName: channel.name,
                threads: threadsToInclude,
                matchType: matchType
            }

            results.push(result)
        }
    });

    return results;
}