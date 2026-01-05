import ChannelItem from "./ChannelItem.tsx";
import type { Channel, Thread } from "@/shared/types/channel.ts";
import type { SearchResult } from "@/shared/utils/searchThreads.ts";

interface ChannelListProps {
  searchResults: SearchResult[];
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
  searchResults,
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

  // Message si aucun résultat
  if (searchResults.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gt-text-muted">Aucun résultat trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {searchResults.map((result) => {
        // Convertir SearchResult en Channel pour compatibilité avec ChannelItem
        const channel: Channel = {
          name: result.channelName,
          description: "", // Pas utilisé par ChannelItem
          threads: result.threads
        };

        return (
          <ChannelItem
            key={result.channelName}
            channel={channel}
            isSelected={selectedChannel === result.channelName}
            isExpanded={expandedChannels.has(result.channelName)}
            selectedThread={selectedThread}
            onSelectChannel={onSelectChannel}
            onSelectThread={onSelectThread}
            onToggleChannel={onToggleChannel}
          />
        );
      })}
    </div>
  );
}
