import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useProfile } from '../context/UserProfileContext';

export default function DMModal({ isOpen, onClose, users }: { isOpen: boolean; onClose: () => void; users: any[] }) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { profile } = useProfile();

  const startDM = async () => {
    if (!selectedUser) return;
    // Create chat ID (sorted uids)
    const chatId = [profile?.uid || '', selectedUser.uid].sort().join('_');
    // Navigate or open chat with this chatId
    alert(`DM started with ${selectedUser.displayName} (chatId: ${chatId})`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-3xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6">New Message</h2>
        {/* User search list */}
        <div className="max-h-96 overflow-auto">
          {users.map(user => (
            <div key={user.uid} onClick={() => setSelectedUser(user)} className="flex items-center gap-4 p-4 hover:bg-gray-800 rounded-2xl cursor-pointer">
              <img src={user.photoURL} className="w-12 h-12 rounded-full" />
              <div>
                <p>{user.displayName}</p>
                <p className="text-sm text-gray-400">{user.bio || ""}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={startDM} className="mt-6 w-full bg-green-600 py-4 rounded-2xl">Start Chat</button>
        <button onClick={onClose} className="mt-2 w-full text-gray-400">Cancel</button>
      </div>
    </div>
  );
}