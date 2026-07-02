import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const useTyping = (roomId: string) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!roomId) return;
    const typingRef = collection(db, `rooms/${roomId}/typing`);
    const unsubscribe = onSnapshot(typingRef, (snapshot) => {
      const users = snapshot.docs.map(doc => doc.data().displayName || "Someone");
      setTypingUsers(users);
    });
    return unsubscribe;
  }, [roomId]);

  return { typingUsers };
};
