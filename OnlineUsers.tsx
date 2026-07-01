import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

export default function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersMap = new Map();
      
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.uid && data.displayName) {
          usersMap.set(data.uid, {
            uid: data.uid,
            displayName: data.displayName,
            photoURL: data.photoURL
          });
        }
      });

      setOnlineUsers(Array.from(usersMap.values()).slice(0, 10));
    });

    return unsubscribe;
  }, []);

  return (
    <div className="p-4 border-t border-gray-800">
      <div className="flex items-center gap-2 mb-4 text-green-400">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="uppercase text-xs tracking-widest font-medium">
          ONLINE NOW ({onlineUsers.length})
        </span>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {onlineUsers.map((user) => (
          <div key={user.uid} className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                className="w-9 h-9 rounded-full ring-2 ring-green-500/30" 
                alt="" 
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
            </div>
            <span className="text-sm truncate">{user.displayName}</span>
          </div>
        ))}
        {onlineUsers.length === 0 && (
          <p className="text-gray-500 text-sm">No recent activity</p>
        )}
      </div>
    </div>
  );
}