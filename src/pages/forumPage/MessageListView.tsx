import { MessageCircle } from 'lucide-react';
import type { Message } from "@/shared/types/channel.ts";

interface MessageListViewProps {
  messages: Message[];
}

export default function MessageListView({ messages }: MessageListViewProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gt-text-muted mx-auto mb-4 opacity-50"/>
        <p className="text-gt-text-muted">Aucun message dans ce fil de discussion</p>
        <p className="text-xs text-gt-text-muted mt-2">Soyez le premier à répondre !</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className="flex gap-4 p-4 rounded-2xl hover:bg-gt-surface-elevated/60 transition-all group border border-transparent hover:border-gt-border/30 hover:shadow-md backdrop-blur-sm"
          style={{animationDelay: `${index * 50}ms`}}
        >
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gt-primary to-gt-primary-dark flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/20">
              {message.author.substring(0, 2).toUpperCase()}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-bold text-gt-text text-base">{message.author}</span>
              <span className="text-xs text-gt-text-muted bg-gt-surface/50 px-2 py-1 rounded-lg">
                {new Date(message.createdAt).toLocaleString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <p className="text-sm text-gt-text leading-relaxed whitespace-pre-wrap">
              {message.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
