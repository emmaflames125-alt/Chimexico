import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Users, Sun, Moon, X } from 'lucide-react';
import Message from '../components/Message';
import RoomList from '../components/RoomList';
import ChatInput from '../components/ChatInput';
import { Link } from 'react-router-dom';

export default function Chat() {
  const { currentUser, logout } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [roomId, setRoomId] = useState("general");
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
      photoURL: currentUser.photoURL || "",
      roomId,
      createdAt: serverTimestamp(),
      type: "text"
    });
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden relative">
      {/* Sidebar */}
      <div className={`w-72 border-r border-gray-800 bg-gray-900 flex flex-col fixed md:relative h-full z-50 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🌮</div>
            <h1 className="font-bold text-2xl">Chimexico</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden"><X size={24} /></button>
        </div>

        <RoomList currentRoom={roomId} onRoomChange={setRoomId} />

        <div className="mt-auto p-4 border-t border-gray-800">
          <Link to="/profile" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-2xl mb-4">
            <img src={currentUser?.photoURL || ""} className="w-10 h-10 rounded-full" alt="" />
            <div>{currentUser?.displayName}</div>
          </Link>
          <Link to="/settings" className="block p-4 hover:bg-gray-800 rounded-2xl text-gray-300">⚙️ Settings</Link>
          <button onClick={logout} className="w-full py-3 bg-red-600 rounded-2xl mt-4">Logout</button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-800 bg-gray-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden"><Users size={24} /></button>
            <span className="font-bold">#{roomId}</span>
          </div>
          <button onClick={() => setIsDark(!isDark)}>{isDark ? <Sun size={24} /> : <Moon size={24} />}</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} currentUserId={currentUser?.uid} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSend={sendMessage} roomId={roomId} />
      </div>
    </div>
  );
    }
