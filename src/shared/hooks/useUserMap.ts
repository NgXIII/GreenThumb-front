import { useState, useEffect } from 'react';
import type { Message } from "@/shared/types/channel.ts";
import type {UserPrivateAccount} from "@/shared/types/user.ts";
import {getUserWithPrivateCount} from "@/services/repos/getUserPublic.ts";

export function useUserMap(messages: Message[]) {
  const [userMap, setUserMap] = useState<Map<string, UserPrivateAccount>>(new Map());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsersInfo = async () => {
      setLoading(true);
      const uniqueUsernames = [...new Set(messages.map(msg => msg.author))];
      const newUserMap = new Map<string, UserPrivateAccount>();

      await Promise.all(
        uniqueUsernames.map(async (username) => {
          try {
            const userInfo = await getUserWithPrivateCount(username);
            newUserMap.set(username, userInfo);
          } catch (error) {
            console.error(`Erreur lors de la récupération de l'utilisateur ${username}:`, error);
          }
        })
      );

      setUserMap(newUserMap);
      setLoading(false);
    };

    if (messages.length > 0) {
      fetchUsersInfo();
    } else {
      setUserMap(new Map());
      setLoading(false);
    }
  }, [messages]);

  return { userMap, loading };
}
