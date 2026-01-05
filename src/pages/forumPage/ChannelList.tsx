import ChannelItem from "./ChannelItem.tsx";
import type { Channel, Thread } from "@/shared/types/channel.ts";

interface ChannelListProps {
  channels: Channel[] | null;
  loading: boolean;
  error: string | null;
  selectedChannel: string | null;
  selectedThread: Thread | null;
  expandedChannels: Set<string>;
  onSelectChannel: (channelName: string) => void;
  onSelectThread: (channel: string, thread: Thread) => void;
  onToggleChannel: (channelName: string) => void;
}

export default function ChannelList({
  channels,
  loading,
  error,
  selectedChannel,
  selectedThread,
  expandedChannels,
  onSelectChannel,
  onSelectThread,
  onToggleChannel
}: ChannelListProps) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gt-text-muted">Chargement des channels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-red-500">Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {channels?.map((channel) => (
        <ChannelItem
          key={channel.name}
          channel={channel}
          isSelected={selectedChannel === channel.name}
          isExpanded={expandedChannels.has(channel.name)}
          selectedThread={selectedThread}
          onSelectChannel={onSelectChannel}
          onSelectThread={onSelectThread}
          onToggleChannel={onToggleChannel}
        />
      ))}
    </div>
  );
}
