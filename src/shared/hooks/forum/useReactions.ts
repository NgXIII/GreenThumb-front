import {useCallback, useEffect} from "react";
import type {ReactionAction, ReactionBroadcast} from "@/shared/types/reaction.ts";
import {websocketService} from "@/services/notifications/websocketService.ts";
import type {Message} from "@/shared/types/channel.ts";

interface UseReactionsProps {
     threadId: number | null;
     messages: Message[];
     setMessages: (messages: Message[]) => void;
}

export default function useReactions({
         threadId,
         messages,
         setMessages
}: UseReactionsProps) {
     const toggleReaction = useCallback((messageId: number, emoji: string) => {
          const reactionAction: ReactionAction = {
               idMessage: messageId,
               emoji: emoji
          };

          websocketService.sendReactionToggle(reactionAction);
     }, []);

     useEffect(() => {
          if (!threadId) return;

          const unsubscribe = websocketService.subscribeToThreadReactions(
              threadId,
              (broadcast: ReactionBroadcast) => {
                   const { action, idMessage, reaction } = broadcast;

                   setMessages(messages.map(message => {
                        if (message.idMessage !== idMessage) {
                             return message;
                        }

                        const currentReactions = message.reactions || [];

                        if (action === 'ADD') {
                             return {
                                  ...message,
                                  reactions: [...currentReactions, reaction]
                             };
                        } else {
                             return {
                                  ...message,
                                  reactions: currentReactions.filter(
                                      r => r.idReaction !== reaction.idReaction
                                  )
                             };
                        }
                   }));
              }
          );

          return () => {
               unsubscribe();
          };
     }, [threadId, messages, setMessages]);

     return { toggleReaction }
}