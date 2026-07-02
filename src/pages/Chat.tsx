import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Send, LogOut, Users, Sun, Moon, Image as ImageIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import Message from '../components/Message';
import RoomList from '../components/RoomList';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import OnlineUsers from '../components/OnlineUsers';
import { Link } from 'react-router-dom';

export default function Chat() {
  const { currentUser, logout } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [roomId, setRoomId] = useState("general");
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    const q = query(collection(db, "messages"), where("roomId", "==", roomId), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !currentUser) return;
    await addDoc(collection(db, "messages"), {
      text: text.trim(),
      uid: currentUser.uid,
      displayName: currentUser.displayName || "Anonymous",
      photoURL: currentUser.photoURL,
      roomId,
      createdAt: serverTimestamp(),
      type: "text"
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    const storageRef = ref(storage, `chat-images/\( {Date.now()}_ \){file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "messages"), {
      text: "",
      imageUrl: url,
      uid: currentUser.uid,
      displayName: currentUser.displayName || "Anonymous",
      photoURL: currentUser.photoURL,
      roomId,
      createdAt: serverTimestamp(),
      type: "image"
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden relative">
      {/* Sidebar */}
      <div className={`w-72 border-r border-gray-800 bg-gray-900 flex flex-col fixed md:relative h-full z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🌮</div>
            <h1 className="font-bold text-2xl">Chimexico</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden"><X size={24} /></button>
        </div>

        <RoomList currentRoom={roomId} onRoomChange={setRoomId} />
        <OnlineUsers />

        <div className="mt-auto p-4 border-t border-gray-800">
          <Link to="/profile" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-2xl mb-4">
            <img src={currentUser?.photoURL} className="w-10 h-10 rounded-full" alt="" />
            <div className="flex-1 truncate">{currentUser?.displayName}</div>
          </Link>
          <Link to="/settings" className="block p-4 hover:bg-gray-800 rounded-2xl mb-4 text-gray-300">⚙️ Settings</Link>
          <button onClick={logout} className="w-full py-3 bg-red-600 rounded-2xl">Logout</button>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-800 bg-gray-900 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden"><Users size={24} /></button>
            <span className="font-bold capitalize">#{roomId}</span>
          </div>
          <button onClick={() => setIsDark(!isDark)}>{isDark ? <Sun /> : <Moon />}</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} currentUserId={currentUser?.uid} roomId={roomId} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <TypingIndicator typingUsers={[]} /> {/* Update with real hook if needed */}

        <ChatInput 
          onSend={sendMessage} 
          onImageUpload={handleImageUpload} 
          fileInputRef={fileInputRef}
          roomId={roomId}
        />
      </div>
    </div>
  );
}
