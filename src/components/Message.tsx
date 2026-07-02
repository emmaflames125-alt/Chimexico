import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Message({ message, currentUserId }: { 
  message: any; 
  currentUserId?: string;
}) {
  const isOwn = message.uid === currentUserId;

  const deleteMessage = async () => {
    if (confirm("Delete this message?")) {
      await deleteDoc(doc(db, "messages", message.id));
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group relative`}>
      <div className={`max-w-[75%] ${isOwn ? 'bg-red-600' : 'bg-gray-800'} rounded-3xl px-5 py-3 shadow-md`}>
        {!isOwn && <p className="text-xs opacity-75 mb-1">{message.displayName}</p>}
        
        {message.imageUrl ? (
          <img src={message.imageUrl} className="max-w-full rounded-2xl my-1" alt="" />
        ) : (
          <p className="text-[17px] leading-relaxed break-words">{message.text}</p>
        )}

        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="flex gap-1 mt-2">
            {Object.entries(message.reactions).map(([emoji, count]: [string, any]) => 
              count > 0 && <span key={emoji} className="text-sm bg-black/30 px-2 py-0.5 rounded-full">{emoji} {count}</span>
            )}
          </div>
        )}

        <p className="text-[10px] opacity-60 text-right mt-1">
          {message.createdAt ? format(message.createdAt.toDate?.() || new Date(), 'HH:mm') : ''}
        </p>
      </div>

      {isOwn && (
        <button 
          onClick={deleteMessage} 
          className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 text-red-400 p-1"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
  }
