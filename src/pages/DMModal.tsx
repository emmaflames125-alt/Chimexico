import { useState } from 'react';

export default function DMModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-3xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6">New Message</h2>
        
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 mb-6"
        />

        <div className="text-center text-gray-500 py-8">
          User search coming soon...
        </div>

        <button onClick={onClose} className="w-full py-4 text-gray-400">Close</button>
      </div>
    </div>
  );
}
