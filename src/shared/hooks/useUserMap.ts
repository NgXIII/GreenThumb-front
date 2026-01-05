import { useState, useEffect } from 'react';
import type { Message } from "@/shared/types/channel.ts";
import type { UserAccount } from "@/shared/types/user.ts";
import { getUserByUsername } from "@/services/repos/getUserPublic.ts";

export function useUserMap(messages: Message[]) {
  const [userMap, setUserMap] = useState<Map<string, UserAccount>>(new Map());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsersInfo = async () => {
      setLoading(true);
      const uniqueUsernames = [...new Set(messages.map(msg => msg.author))];
      const newUserMap = new Map<string, UserAccount>();

      await Promise.all(
        uniqueUsernames.map(async (username) => {
          try {
            const userInfo = await getUserByUsername(username);
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
