import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const quickReactions = ["❤️", "🔥", "😂", "👏", "🌮"];

export default function Message({ message, currentUserId, roomId }: { 
  message: any; 
  currentUserId?: string; 
  roomId: string;
}) {
  const isOwn = message.uid === currentUserId;
  const [showReactions, setShowReactions] = useState(false);

  const addReaction = async (emoji: string) => {
    const msgRef = doc(db, "messages", message.id);
    const current = message.reactions || {};
    await updateDoc(msgRef, {
      [`reactions.${emoji}`]: (current[emoji] || 0) + 1
    });
    setShowReactions(false);
  };

  const deleteMessage = async () => {
    if (confirm("Delete this message?")) {
      await deleteDoc(doc(db, "messages", message.id));
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group relative`} onClick={() => setShowReactions(!showReactions)}>
      <div className={`max-w-[75%] ${isOwn ? 'bg-red-600' : 'bg-gray-800'} rounded-3xl px-5 py-3`}>
        {!isOwn && <p className="text-xs opacity-75">{message.displayName}</p>}
        
        {message.imageUrl ? (
          <img src={message.imageUrl} className="max-w-full rounded-2xl" alt="" />
        ) : (
          <p>{message.text}</p>
        )}

        {message.reactions && (
          <div className="flex gap-1 mt-2">
            {Object.entries(message.reactions).map(([emoji, count]) => count > 0 && <span key={emoji}>{emoji} {count}</span>)}
          </div>
        )}

        <p className="text-xs opacity-60 text-right mt-1">
          {message.createdAt ? format(message.createdAt.toDate(), 'HH:mm') : ''}
        </p>
      </div>

      {isOwn && <button onClick={deleteMessage} className="opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>}
    </div>
  );
}
