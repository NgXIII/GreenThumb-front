export type Reaction = {
    idReaction: number;
    emoji: string;
    username: string;
    createdAt: string;
}

export type ReactionAction = {
    idMessage: number;
    emoji: string;
}

export type ReactionBroadcast = {
    action: 'ADD' | 'REMOVE';
    idMessage: number;
    reaction: Reaction;
}

export type ReactionGroup = {
    emoji: string;
    count: number;
    users: string[];
    userReacted: boolean;
}