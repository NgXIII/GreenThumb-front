import { Hash, Menu, X, ArrowLeft, MessageCircle, Pin, Lock, Search, Users } from 'lucide-react';
import type { Channel, Thread } from "@/shared/types/channel.ts";

interface ForumHeaderProps {
  isSidebarOpen: boolean;
  currentChannel: Channel | undefined;
  selectedThread: Thread | null;
  onToggleSidebar: () => void;
  onBackToThreads: () => void;
}

export default function ForumHeader({
  isSidebarOpen,
  currentChannel,
  selectedThread,
  onToggleSidebar,
  onBackToThreads
}: ForumHeaderProps) {
  return (
    <div className="h-16 border-b border-gt-border/50 bg-gt-surface-elevated/80 backdrop-blur-sm px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2.5 rounded-xl hover:bg-gt-surface/70 transition-all group"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-gt-text-muted group-hover:text-gt-primary transition-colors"/>
          ) : (
            <Menu className="w-5 h-5 text-gt-text-muted group-hover:text-gt-primary transition-colors"/>
          )}
        </button>

        {selectedThread ? (
          <>
            {/* Back Button */}
            <button
              onClick={onBackToThreads}
              className="p-2.5 rounded-xl hover:bg-gt-surface/70 transition-all group"
              title="Retour aux threads"
            >
              <ArrowLeft className="w-5 h-5 text-gt-text-muted group-hover:text-gt-primary transition-colors"/>
            </button>

            {/* Thread Info */}
            <div className="p-2.5 bg-gradient-to-br from-gt-primary/15 to-gt-primary/5 rounded-xl">
              <MessageCircle className="w-5 h-5 text-gt-primary"/>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gt-text">{selectedThread.title}</h1>
                {selectedThread.isPinned && <Pin className="w-4 h-4 text-yellow-600 dark:text-yellow-400"/>}
                {selectedThread.isLocked && <Lock className="w-4 h-4 text-red-600 dark:text-red-400"/>}
              </div>
              <p className="text-xs text-gt-text-muted flex items-center gap-1.5">
                <Users className="w-3 h-3"/>
                Créé par {selectedThread.creator}
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Channel Info */}
            <div className="p-2.5 bg-gradient-to-br from-gt-primary/15 to-gt-primary/5 rounded-xl">
              <Hash className="w-5 h-5 text-gt-primary"/>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gt-text">{currentChannel?.name || 'Sélectionner un channel'}</h1>
              <p className="text-xs text-gt-text-muted flex items-center gap-1.5">
                <Users className="w-3 h-3"/>
                {currentChannel?.description || 'Aucune description disponible'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="p-2.5 rounded-xl hover:bg-gt-surface/70 transition-all group">
          <Search className="w-5 h-5 text-gt-text-muted group-hover:text-gt-primary transition-colors"/>
        </button>
        <button className="p-2.5 rounded-xl hover:bg-gt-surface/70 transition-all group">
          <Users className="w-5 h-5 text-gt-text-muted group-hover:text-gt-primary transition-colors"/>
        </button>
      </div>
    </div>
  );
}
