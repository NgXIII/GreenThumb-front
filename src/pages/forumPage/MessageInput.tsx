import { useRef, useState, useEffect, type ChangeEvent } from 'react';
import { Send, Smile, Image as ImageIcon, X, Lock, Plus } from 'lucide-react';
import EmojiPicker, { type EmojiClickData, Theme } from 'emoji-picker-react';
import CreateThreadModal from "./CreateThreadModal.tsx";
import type { Thread } from "@/shared/types/channel.ts";
import type {Tier} from "@/shared/types/user.ts";

interface MessageInputProps {
  selectedThread: Thread | null;
  role: string | undefined;
  tier: Tier | undefined;
  channelName?: string;
  username?: string;
  countCreatedThread?: number;
  onThreadCreated?: () => void;
  onSendMessage?: (text: string) => void;
}

export default function MessageInput(
    {
        selectedThread,
        role,
        tier,
        channelName,
        username,
        countCreatedThread,
        onThreadCreated,
        onSendMessage,
    }: MessageInputProps) {
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isCreateThreadModalOpen, setIsCreateThreadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessageInput(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = () => {
    if(!messageInput.trim() && !selectedImage) {
      return;
    }

    if(!onSendMessage) {
      return;
    }

    if(!messageInput.trim()) {
      return;
    }

    onSendMessage(messageInput.trim());

    setMessageInput('');
    handleRemoveImage();

    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
    }
  }

  if (!selectedThread) {
    if (role !== 'UTILISATEUR' ||
        (tier && countCreatedThread !== undefined && countCreatedThread < tier.threadUnlocked)
    ) {
      return (
          <>
            <button
              onClick={() => setIsCreateThreadModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-gt-primary to-gt-primary-dark hover:shadow-lg text-white rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 shadow-md"
            >
              <Plus className="w-5 h-5"/>
              Créer un nouveau fil de discussion
            </button>

            {channelName && username && (
              <CreateThreadModal
                open={isCreateThreadModalOpen}
                onOpenChange={setIsCreateThreadModalOpen}
                channelName={channelName}
                username={username}
                onThreadCreated={onThreadCreated}
              />
            )}
          </>
      );
    } else
      return (
          <div className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-gt-primary to-gt-primary-dark hover:shadow-lg text-white rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 shadow-md">
            Vous ne pouvez pas crée de file pour l'instant
          </div>
      );
  }

  if (selectedThread.isLocked) {
    return (
      <div className="text-center py-4">
        <Lock className="w-8 h-8 text-red-500 mx-auto mb-2"/>
        <p className="text-sm text-gt-text-muted">Ce fil de discussion est verrouillé</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gt-surface via-gt-surface to-gt-surface/95 border border-gt-border/50 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-gt-primary/50 focus-within:border-gt-primary/50 transition-all shadow-lg">
      {selectedImage && (
        <div className="mb-3 relative inline-block">
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gt-border/50 shadow-md">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Aperçu"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
            >
              <X className="w-4 h-4"/>
            </button>
          </div>
          <p className="text-xs text-gt-text-muted mt-1">{selectedImage.name}</p>
        </div>
      )}

      <textarea
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Écrire un message..."
        rows={1}
        className="w-full bg-transparent text-sm text-gt-text placeholder:text-gt-text-muted resize-none focus:outline-none leading-relaxed"
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = Math.min(target.scrollHeight, 200) + 'px';
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gt-border/30">
        <div className="flex items-center gap-2 relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg hover:bg-gt-primary/10 transition-all group"
            title="Ajouter une image"
          >
            <ImageIcon className="w-4 h-4 text-gt-text-muted group-hover:text-gt-primary transition-colors"/>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-lg hover:bg-gt-primary/10 transition-all group"
              title="Ajouter un emoji"
            >
              <Smile className="w-4 h-4 text-gt-text-muted group-hover:text-gt-primary transition-colors"/>
            </button>

            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute bottom-full left-0 mb-2">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme={Theme.AUTO}
                  searchPlaceHolder="Rechercher un emoji..."
                  previewConfig={{showPreview: false}}
                  height={400}
                  width={350}
                />
              </div>
            )}
          </div>
        </div>

        <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() && !selectedImage}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gt-primary to-gt-primary-dark hover:shadow-lg text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-md"
        >
          <Send className="w-4 h-4"/>
          Envoyer
        </button>
      </div>
    </div>
  );
}
