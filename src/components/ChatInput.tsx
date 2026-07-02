import { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon } from 'lucide-react';
import { useTyping } from '../hooks/useTyping';

const emojis = ["😀", "😂", "🔥", "🌮", "🇲🇽", "❤️", "🍹", "🎉"];

export default function ChatInput({ 
  onSend, 
  onImageUpload, 
  fileInputRef,
  roomId 
}: { 
  onSend: (text: string) => void; 
  onImageUpload: (e: any) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  roomId: string;
}) {
  const [input, setInput] = useState("");
  const { startTyping, stopTyping } = useTyping(roomId);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    if (e.target.value.length > 0) {
      startTyping();
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      
      typingTimeout.current = setTimeout(() => {
        stopTyping();
      }, 1500);
    } else {
      stopTyping();
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
      stopTyping();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      stopTyping();
    };
  }, []);

  return (
    <div className="fixed md:relative bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
      {/* Emojis */}
      <div className="flex gap-3 overflow-x-auto pb-3 mb-3">
        {emojis.map(emoji => (
          <button key={emoji} onClick={() => setInput(i => i + emoji)} className="text-3xl hover:scale-125 transition">
            {emoji}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <label className="cursor-pointer px-4 bg-gray-800 hover:bg-gray-700 rounded-2xl flex items-center">
          <ImageIcon size={24} />
          <input type="file" ref={fileInputRef} onChange={onImageUpload} className="hidden" accept="image/*" />
        </label>

        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          onBlur={stopTyping}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-3xl px-6 py-4 focus:outline-none focus:border-yellow-400"
        />

        <button onClick={handleSend} className="bg-green-600 hover:bg-green-700 w-14 h-14 rounded-3xl flex items-center justify-center">
          <Send size={24} />
        </button>
      </div>
    </div>
  );
}
