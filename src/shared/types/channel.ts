import type {Reaction} from "@/shared/types/reaction.ts";

export type Channel = {
    name: string;
    description: string;
    threads: Thread[];
}

export type ChannelPost = {
    name: string;
    description: string;
}

export type Thread = {
    id: number;
    title: string;
    isPinned: boolean;
    isLocked: boolean;
    creator: string;
    messages: Message[];
}

export type ThreadPost = {
    title: string;
    creator: string;
}

export type Message = {
    idMessage: number;
    text: string;
    author: string;
    timestamp: string;
    mediaUrls?: string[];
    reactions?: Reaction[];
}

export type ChatMessage = {
    idMessage: number | null;
    idThread: number;
    username: string;
    text: string;
    timestamp: string;
    mediaUrls?: string[];
    reactions?: Reaction[];
}

let tempIdCounter = 0;

export function chatMessageToMessage(chatMessage: ChatMessage): Message {
    return {
        idMessage: chatMessage.idMessage ?? -(Date.now() + tempIdCounter++),
        text: chatMessage.text,
        author: chatMessage.username,
        timestamp: chatMessage.timestamp,
        mediaUrls: chatMessage.mediaUrls || [],
        reactions: chatMessage.reactions || [],
    }
}

export function messageToChatMessage(message: Message, threadId: number): ChatMessage {
    return {
        idMessage: message.idMessage,
        idThread: threadId,
        username: message.author,
        text: message.text,
        timestamp: message.timestamp,
        mediaUrls: message.mediaUrls || [],
        reactions: message.reactions || [],
    }
}