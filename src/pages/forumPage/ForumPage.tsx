import { useState, useRef, useEffect } from 'react';
import useGetChannels from "@/shared/hooks/forum/useGetChannel.ts";
import type { Thread } from "@/shared/types/channel.ts";
import Sidebar from "./Sidebar.tsx";
import ForumHeader from "./ForumHeader.tsx";
import ThreadListView from "./ThreadListView.tsx";
import MessageListView from "./MessageListView.tsx";
import MessageInput from "./MessageInput.tsx";
import {useUserStore} from "@/app/stores/userStore.ts";

export default function ForumPage() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [expandedChannels, setExpandedChannels] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const hasInitialized = useRef(false);
  const { user } = useUserStore.getState();

  const { channels, error, loading, refetch } = useGetChannels();

  const currentChannel = channels?.find((c) => c.name === selectedChannel) || channels?.[0];

  const threads = currentChannel?.threads?.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  }) || [];

  useEffect(() => {
    if (channels && channels.length > 0 && !hasInitialized.current) {
      setSelectedChannel(channels[0].name);
      hasInitialized.current = true;
    }
  }, [channels]);

  useEffect(() => {
    setSelectedThread(null);
  }, [selectedChannel]);

  const toggleChannel = (channelName: string) => {
    const newExpanded = new Set(expandedChannels);
    if (newExpanded.has(channelName)) {
      newExpanded.delete(channelName);
    } else {
      newExpanded.add(channelName);
    }
    setExpandedChannels(newExpanded);
  };

  const handleSelectThread = (channel: string, thread: Thread) => {
    setSelectedChannel(channel);
    setSelectedThread(thread);
  };

  const handleBackToThreads = () => {
    setSelectedThread(null);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex bg-gradient-to-br from-gt-surface via-gt-surface to-gt-surface/95" style={{height: 'calc(100vh - 4rem)'}}>
      <Sidebar
          user={user}
          isOpen={isSidebarOpen}
          channels={channels}
          loading={loading}
          error={error}
          selectedChannel={selectedChannel}
          selectedThread={selectedThread}
          expandedChannels={expandedChannels}
          onSelectChannel={setSelectedChannel}
          onSelectThread={handleSelectThread}
          onToggleChannel={toggleChannel}
          onChannelCreated={refetch}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ForumHeader
          isSidebarOpen={isSidebarOpen}
          currentChannel={currentChannel}
          selectedThread={selectedThread}
          onToggleSidebar={handleToggleSidebar}
          onBackToThreads={handleBackToThreads}
        />

        <div className="flex-1 overflow-y-auto p-6">
          {selectedThread ? (
            <MessageListView messages={selectedThread.messages || []} />
          ) : (
            <ThreadListView threads={threads} onSelectThread={setSelectedThread} />
          )}
        </div>

        <div className="p-6 border-t border-gt-border/50 bg-gt-surface-elevated/80 backdrop-blur-sm shadow-lg">
          <div className="max-w-4xl mx-auto">
            <MessageInput
              selectedThread={selectedThread}
              role={user?.role}
              tier={user?.tier}
              channelName={currentChannel?.name}
              username={user?.username}
              countCreatedThread={user?.countCreatedThread}
              onThreadCreated={refetch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
