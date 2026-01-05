import type {Reaction, ReactionGroup} from "@/shared/types/reaction.ts";

export function groupReactions(
    reactions: Reaction[] | undefined,
    currentUsername: string | undefined,
): ReactionGroup[] {
    if (!reactions || reactions.length === 0) {
        return [];
    }

    const grouped = new Map<string, ReactionGroup>();

    reactions.forEach(reaction => {
        const existing = grouped.get(reaction.emoji);

        if (existing) {
            existing.count++;
            existing.users.push(reaction.username);
            if (reaction.username === currentUsername) {
                existing.userReacted = true;
            }
        } else {
            grouped.set(reaction.emoji, {
                emoji: reaction.emoji,
                count: 1,
                users: [reaction.username],
                userReacted: reaction.username === currentUsername
            });
        }
    });

    return Array.from(grouped.values()).sort((a, b) => b.count - a.count);
}

export function getUsersTooltip(users: string[]): string {
    if (users.length === 0) return '';
    if (users.length === 1) return users[0];
    if (users.length === 2) return `${users[0]} et ${users[1]}`;
    if (users.length <= 5) {
        const last = users[users.length - 1];
        const others = users.slice(0, -1).join(', ');
        return `${others} et ${last}`;
    }

    const displayed = users.slice(0, 3).join(', ');
    const remaining = users.length - 3;
    return `${displayed} et ${remaining} autre${remaining > 1 ? 's' : ''}`;
}