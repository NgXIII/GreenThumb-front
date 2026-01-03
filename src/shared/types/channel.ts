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
    title: string;
    isPinned: boolean;
    isLocked: boolean;
    creator: string;
    messages: Message[];
}

export type ThreadPost = {
    title: string;
    channelName: string;
    creator: string;
}

export type Message = {
    id: number;
    text: string;
    author: string;
    createdAt: string;
    updatedAt?: string;
}
