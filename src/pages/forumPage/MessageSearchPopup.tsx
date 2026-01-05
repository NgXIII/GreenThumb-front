import { useState, useMemo } from 'react';
import { Search, X, MessageCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import type { Message } from "@/shared/types/channel.ts";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MessageSearchPopupProps {
  messages: Message[];
  onMessageClick: (messageId: number) => void;
}

/**
 * Filtre les messages en fonction de la recherche
 * Cherche dans le texte du message et le nom d'utilisateur
 */
function filterMessages(messages: Message[], searchQuery: string): Message[] {
  if (!searchQuery.trim()) return [];

  const query = searchQuery.toLowerCase();

  return messages.filter(message =>
    message.text.toLowerCase().includes(query) ||
    message.author.toLowerCase().includes(query)
  );
}

/**
 * Met en évidence le texte recherché dans le message
 */
function highlightText(text: string, searchQuery: string): JSX.Element {
  if (!searchQuery.trim()) {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === searchQuery.toLowerCase() ? (
          <mark key={index} className="bg-gt-primary/30 text-gt-text rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

/**
 * Tronque le texte et ajoute ... si trop long
 */
function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export default function MessageSearchPopup({ messages, onMessageClick }: MessageSearchPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = useMemo(
    () => filterMessages(messages, searchQuery),
    [messages, searchQuery]
  );

  const handleMessageClick = (messageId: number) => {
    onMessageClick(messageId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="p-2.5 rounded-xl hover:bg-gt-surface/70 transition-all group"
          title="Rechercher dans les messages"
        >
          <Search className="w-5 h-5 text-gt-text-muted group-hover:text-gt-primary transition-colors"/>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-96 p-0"
        align="end"
        sideOffset={8}
      >
        <div className="flex flex-col h-full">
          {/* Header avec input de recherche */}
          <div className="p-4 border-b border-gt-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gt-text-muted" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un message..."
                className="pl-10 pr-10"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gt-text-muted hover:text-gt-text transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Liste des résultats */}
          <ScrollArea className="h-96">
            {!searchQuery.trim() ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <MessageCircle className="w-12 h-12 text-gt-text-muted/50 mb-3" />
                <p className="text-sm text-gt-text-muted">
                  Recherchez un message par son contenu ou par nom d'utilisateur
                </p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <MessageCircle className="w-12 h-12 text-gt-text-muted/50 mb-3" />
                <p className="text-sm text-gt-text-muted">
                  Aucun message trouvé pour "{searchQuery}"
                </p>
              </div>
            ) : (
              <div className="p-2">
                <p className="text-xs text-gt-text-muted px-2 py-2">
                  {filteredMessages.length} résultat{filteredMessages.length > 1 ? 's' : ''}
                </p>

                {filteredMessages.map((message) => (
                  <button
                    key={message.idMessage}
                    onClick={() => handleMessageClick(message.idMessage)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gt-surface/50 transition-colors mb-1"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gt-text truncate">
                            {message.author}
                          </span>
                          <span className="text-xs text-gt-text-muted">
                            {formatDistanceToNow(new Date(message.timestamp), {
                              addSuffix: true,
                              locale: fr
                            })}
                          </span>
                        </div>

                        <p className="text-sm text-gt-text-muted line-clamp-2">
                          {highlightText(truncateText(message.text, 150), searchQuery)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
