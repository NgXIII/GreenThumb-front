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
    id: number;
    text: string;
    author: string;
    createdAt: string;
}

export type ChatMessage = {
    idMessage: number | null;
    idThread: number;
    username: string;
    text: string;
    timestamp: string;
}

export function chatMessageToMessage(chatMessage: ChatMessage): Message {
    return {
        id: chatMessage.idMessage || Date.now(),
        text: chatMessage.text,
        author: chatMessage.username,
        createdAt: chatMessage.timestamp,
    }
}

export function messageToChatMessage(message: Message, threadId: number): ChatMessage {
    return {
        idMessage: message.id,
        idThread: threadId,
        username: message.author,
        text: message.text,
        timestamp: message.createdAt
    }
}