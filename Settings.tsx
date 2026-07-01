import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Shield, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import UniqueSpinner from '../components/UniqueSpinner';

export default function Settings() {
  const { currentUser } = useAuth();

  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    privacy: "friends",
    language: "en",
  });

  const [isSaving, setIsSaving] = useState(false);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      const userSettingsRef = doc(db, "userSettings", currentUser.uid);
      await setDoc(userSettingsRef, {
        ...settings,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      alert("✅ Settings saved successfully!");
    } catch (error) {
      alert("❌ Failed to save settings");
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-950 border-b border-gray-800 p-4 flex items-center z-50">
          <Link to="/chat" className="mr-4">
            <ArrowLeft size={26} />
          </Link>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="p-6 space-y-8">
          {/* Notifications */}
          <div className="bg-gray-900 rounded-3xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <Bell className="text-yellow-400" size={28} />
              <div>
                <h3 className="text-xl font-semibold">Notifications</h3>
                <p className="text-gray-400 text-sm">Manage what you get notified about</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center py-2">
                <span>New messages</span>
                <button 
                  onClick={() => toggleSetting('notifications')} 
                  className={`w-14 h-8 rounded-full relative transition-all ${settings.notifications ? 'bg-green-500' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${settings.notifications ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Sound effects</span>
                <button 
                  onClick={() => toggleSetting('soundEffects')} 
                  className={`w-14 h-8 rounded-full relative transition-all ${settings.soundEffects ? 'bg-green-500' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${settings.soundEffects ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-gray-900 rounded-3xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="text-blue-400" size={28} />
              <h3 className="text-xl font-semibold">Privacy</h3>
            </div>
            <select 
              value={settings.privacy}
              onChange={(e) => setSettings(p => ({...p, privacy: e.target.value}))}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-5 text-lg"
            >
              <option value="public">Public — Anyone can start a chat</option>
              <option value="friends">Friends only</option>
              <option value="private">Private — Approve new chats</option>
            </select>
          </div>

          {/* Save Button with Unique Spinner */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full mt-12 bg-gradient-to-r from-emerald-600 to-green-600 py-6 rounded-3xl text-xl font-semibold flex items-center justify-center gap-4 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <UniqueSpinner />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save size={28} />
                Save All Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}