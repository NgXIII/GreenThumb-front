import type {Thread} from "@/shared/types/channel.ts";

export type SearchResult = {
    channelName: string;
    threads: Thread[];
    matchType: 'channel' | 'thread' | 'both';
}