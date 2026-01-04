import { useState } from 'react';
import { Search, Plus, MessageCircle, TrendingUp, ChevronDown } from 'lucide-react';
import resolveAvatar from "@/shared/utils/resolveAvatar.ts";
import ChannelList from "./ChannelList.tsx";
import CreateChannelModal from "./CreateChannelModal.tsx";
import UserXPBar from "./UserXPBar.tsx";
import UserProfileModal from "./UserProfileModal.tsx";
import type { Channel, Thread } from "@/shared/types/channel.ts";
import useGetNextTier from "@/shared/hooks/forum/useGetNextTier.ts";
import type {UserAccount} from "@/shared/types/user.ts";

interface SidebarProps {
  user: UserAccount | null;
  isOpen: boolean;
  channels: Channel[] | null;
  loading: boolean;
  error: string | null;
  selectedChannel: string | null;
  selectedThread: Thread | null;
  expandedChannels: Set<string>;
  onSelectChannel: (channelName: string) => void;
  onSelectThread: (channel: string, thread: Thread) => void;
  onToggleChannel: (channelName: string) => void;
  onChannelCreated?: () => void;
}

export default function Sidebar({
    user,
    isOpen,
    channels,
    loading,
    error,
    selectedChannel,
    selectedThread,
    expandedChannels,
    onSelectChannel,
    onSelectThread,
    onToggleChannel,
    onChannelCreated
}: SidebarProps) {
    const { tier } = useGetNextTier(user?.tier)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    return (
      <div className={`bg-gt-surface-elevated/80 backdrop-blur-sm border-r border-gt-border/50 flex flex-col shadow-lg transition-all duration-300 ${
        isOpen ? 'w-72' : 'w-0 border-r-0'
      } overflow-hidden`}>
        {/* Header */}
        <div className="p-5 border-b border-gt-border/50 bg-gradient-to-r from-gt-primary/5 to-transparent">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gt-text flex items-center gap-2.5">
              <div className="p-2 bg-gt-primary/10 rounded-lg">
                <MessageCircle className="w-5 h-5 text-gt-primary"/>
              </div>
              <span className="bg-gradient-to-r from-gt-primary to-gt-primary-dark bg-clip-text text-transparent">
                Forum
              </span>
            </h2>
            <button className="p-2 rounded-lg hover:bg-gt-surface/50 transition-all hover:scale-105">
              <ChevronDown className="w-4 h-4 text-gt-text-muted"/>
            </button>
          </div>
          <p className="text-xs text-gt-text-muted">Communauté GreenThumb</p>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gt-text-muted group-hover:text-gt-primary transition-colors"/>
            <input
              type="text"
              placeholder="Rechercher dans le forum..."
              className="w-full pl-11 pr-4 py-2.5 bg-gt-surface/70 border border-gt-border/50 rounded-xl text-sm text-gt-text placeholder:text-gt-text-muted focus:outline-none focus:ring-2 focus:ring-gt-primary/50 focus:border-gt-primary/50 focus:bg-gt-surface transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="flex items-center justify-between px-3 py-2 mb-2">
            <h3 className="text-xs font-bold text-gt-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5"/>
              Channels
            </h3>
              {user?.role == "ADMIN" && (
                  <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="p-1 rounded-lg hover:bg-gt-primary/10 transition-all group"
                  >
                      <Plus className="w-4 h-4 text-gt-text-muted group-hover:text-gt-primary transition-colors"/>
                  </button>
              )}
          </div>

          <ChannelList
            channels={channels}
            loading={loading}
            error={error}
            selectedChannel={selectedChannel}
            selectedThread={selectedThread}
            expandedChannels={expandedChannels}
            onSelectChannel={onSelectChannel}
            onSelectThread={onSelectThread}
            onToggleChannel={onToggleChannel}
          />
        </div>

        {/* User Info */}
        <div className="border-t border-gt-border/50 bg-gradient-to-r from-gt-surface/30 to-transparent backdrop-blur-sm">
          <div className="p-4">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-gt-surface/40 hover:bg-gt-surface/60 transition-all cursor-pointer group"
            >
              <img
                src={resolveAvatar(user?.avatar)}
                alt="avatar"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-gt-primary to-gt-primary-dark flex items-center justify-center text-white text-sm font-bold shadow-md"
              />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-gt-text truncate group-hover:text-gt-primary transition-colors">{user?.username}</p>
                <p className="text-xs text-gt-text-muted">{user?.tier.name}</p>
              </div>
            </button>
          </div>

          {/* XP Bar */}
          {user && (
            <UserXPBar
              currentMessages={user.messageCount}
              currentTier={user.tier}
              nextTier={tier}
            />
          )}
        </div>

        {/* Create Channel Modal */}
        <CreateChannelModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onChannelCreated={onChannelCreated}
        />

        {/* User Profile Modal */}
        {user && (
          <UserProfileModal
            open={isProfileModalOpen}
            onOpenChange={setIsProfileModalOpen}
            user={user}
            nextTier={tier}
          />
        )}
      </div>
    );
}
