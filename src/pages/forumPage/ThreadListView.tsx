import { MessageCircle, Pin, Lock, Users } from 'lucide-react';
import type { Thread } from "@/shared/types/channel.ts";

interface ThreadListViewProps {
  threads: Thread[];
  onSelectThread: (thread: Thread) => void;
}

export default function ThreadListView({ threads, onSelectThread }: ThreadListViewProps) {
  if (threads.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gt-text-muted mx-auto mb-4 opacity-50"/>
        <p className="text-gt-text-muted">Aucun fil de discussion dans ce channel</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread, index) => (
        <div
          key={index}
          onClick={() => onSelectThread(thread)}
          className="flex gap-4 p-5 rounded-2xl hover:bg-gt-surface-elevated/60 transition-all group border border-gt-border/30 hover:border-gt-primary/30 hover:shadow-lg backdrop-blur-sm cursor-pointer"
          style={{animationDelay: `${index * 50}ms`}}
        >
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gt-primary/20 to-gt-primary/10 flex items-center justify-center text-gt-primary shadow-md">
              <MessageCircle className="w-6 h-6"/>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-gt-text text-base hover:text-gt-primary transition-colors">
                  {thread.title}
                </h3>
                {thread.isPinned && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-lg text-xs font-medium">
                    <Pin className="w-3 h-3"/>
                    Épinglé
                  </span>
                )}
                {thread.isLocked && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium">
                    <Lock className="w-3 h-3"/>
                    Verrouillé
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gt-text-muted">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5"/>
                Par {thread.creator}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5"/>
                {thread.messages?.length || 0} message{(thread.messages?.length || 0) > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
