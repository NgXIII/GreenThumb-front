import { Hash, ChevronDown, MessageCircle, Pin, Lock } from 'lucide-react';
import type { Channel, Thread } from "@/shared/types/channel.ts";

interface ChannelItemProps {
  channel: Channel;
  isSelected: boolean;
  isExpanded: boolean;
  selectedThread: Thread | null;
  onSelectChannel: (channelName: string) => void;
  onSelectThread: (channel: string, thread: Thread) => void;
  onToggleChannel: (channelName: string) => void;
}

export default function ChannelItem({
  channel,
  isSelected,
  isExpanded,
  selectedThread,
  onSelectChannel,
  onSelectThread,
  onToggleChannel
}: ChannelItemProps) {
  return (
    <div className="space-y-1">
      {/* Channel Header */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onToggleChannel(channel.name)}
          className="p-1.5 rounded-lg hover:bg-gt-surface/50 transition-all"
        >
          <ChevronDown className={`w-4 h-4 text-gt-text-muted transition-transform ${
            isExpanded ? '' : '-rotate-90'
          }`}/>
        </button>
        <button
          onClick={() => onSelectChannel(channel.name)}
          className={`flex-1 flex items-center gap-2 px-2 py-2 rounded-xl text-left transition-all group ${
            isSelected
              ? 'bg-gradient-to-r from-gt-primary/15 to-gt-primary/5 text-gt-primary shadow-sm'
              : 'text-gt-text hover:bg-gt-surface/50'
          }`}
        >
          <div className={`p-1.5 rounded-lg transition-all ${
            isSelected ? 'bg-gt-primary/20' : 'bg-gt-surface/50 group-hover:bg-gt-primary/10'
          }`}>
            <Hash className="w-3.5 h-3.5 flex-shrink-0"/>
          </div>
          <span className="text-sm font-semibold truncate">{channel.name}</span>
          {channel.threads && channel.threads.length > 0 && (
            <span className="ml-auto text-xs text-gt-text-muted bg-gt-surface/50 px-1.5 py-0.5 rounded">
              {channel.threads.length}
            </span>
          )}
        </button>
      </div>

      {/* Threads List */}
      {isExpanded && channel.threads && (
        <div className="ml-6 space-y-0.5">
          {channel.threads.map((thread, idx) => (
            <button
              key={idx}
              onClick={() => onSelectThread(channel.name, thread)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition-all group text-xs ${
                selectedThread === thread
                  ? 'bg-gt-primary/10 text-gt-primary'
                  : 'text-gt-text-muted hover:bg-gt-surface/50 hover:text-gt-text'
              }`}
            >
              <MessageCircle className="w-3 h-3 flex-shrink-0"/>
              <span className="truncate flex-1">{thread.title}</span>
              {thread.isPinned && <Pin className="w-3 h-3 text-yellow-600"/>}
              {thread.isLocked && <Lock className="w-3 h-3 text-red-600"/>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
