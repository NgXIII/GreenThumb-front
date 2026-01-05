import { useState } from 'react';
import { Smile } from 'lucide-react';
import EmojiPicker, {type EmojiClickData } from 'emoji-picker-react';
import type { Reaction } from "@/shared/types/reaction.ts";
import { groupReactions, getUsersTooltip } from "@/shared/utils/reactionUtils.ts";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover.tsx";

interface MessageReactionsProps {
  reactions: Reaction[] | undefined;
  currentUsername: string | undefined;
  onToggleReaction: (emoji: string) => void;
}

export default function MessageReactions({
  reactions,
  currentUsername,
  onToggleReaction
}: MessageReactionsProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const groupedReactions = groupReactions(reactions, currentUsername);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onToggleReaction(emojiData.emoji);
    setIsPickerOpen(false);
  };

  const handleReactionClick = (emoji: string) => {
    onToggleReaction(emoji);
  };

  return (
    <div className="flex items-center gap-1 mt-2 flex-wrap">
      {/* Afficher les réactions groupées */}
      {groupedReactions.map((group) => (
        <button
          key={group.emoji}
          onClick={() => handleReactionClick(group.emoji)}
          className={`
            inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs
            transition-all duration-200
            ${
              group.userReacted
                ? 'bg-gt-primary/20 border border-gt-primary text-gt-primary hover:bg-gt-primary/30'
                : 'bg-gt-surface border border-gt-border text-gt-text-muted hover:bg-gt-surface-elevated hover:border-gt-primary/50'
            }
          `}
          title={getUsersTooltip(group.users)}
        >
          <span className="text-base leading-none">{group.emoji}</span>
          <span className="font-medium">{group.count}</span>
        </button>
      ))}

      {/* Bouton pour ajouter une réaction */}
      <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
        <PopoverTrigger asChild>
          <button
            className="
              inline-flex items-center justify-center
              w-7 h-7 rounded-full
              bg-gt-surface border border-gt-border
              text-gt-text-muted
              hover:bg-gt-surface-elevated hover:border-gt-primary/50 hover:text-gt-primary
              transition-all duration-200
              opacity-0 group-hover:opacity-100
            "
            title="Ajouter une réaction"
            aria-label="Ajouter une réaction"
          >
            <Smile className="w-4 h-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 border-none shadow-xl"
          align="start"
          sideOffset={5}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
            lazyLoadEmojis
            width={320}
            height={400}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
