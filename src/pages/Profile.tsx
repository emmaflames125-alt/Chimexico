import { useState, useEffect } from 'react';
import { Camera, ArrowLeft, Save } from 'lucide-react';
import { useProfile } from '../context/UserProfileContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { profile, updateProfile, uploadAvatar } = useProfile();
  const { logout } = useAuth();
  
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    email: "",
    phone: "",
    discord: "",
    github: "",
    notes: ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        email: profile.email || "",
        phone: profile.phone || "",
        discord: profile.discord || "",
        github: profile.github || "",
        notes: profile.notes || ""
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (avatarFile) await uploadAvatar(avatarFile);
      await updateProfile(formData);
      alert("✅ Profile saved successfully!");
    } catch (e) {
      alert("Error saving profile");
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white">
      <div className="max-w-2xl mx-auto p-6">
        <Link to="/chat" className="flex items-center gap-2 mb-8 text-gray-400">
          <ArrowLeft /> Back to Chat
        </Link>

        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-yellow-400">
              <img src={previewUrl || profile?.photoURL || ""} className="w-full h-full object-cover" alt="Avatar" />
            </div>
            <label className="absolute bottom-2 right-2 bg-green-600 p-4 rounded-full cursor-pointer">
              <Camera size={28} />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <input name="displayName" value={formData.displayName} onChange={handleChange} placeholder="Display Name" className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-lg" />
          <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" rows={4} className="w-full bg-gray-900 border border-gray-700 rounded-3xl px-6 py-4" />
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4" />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4" />
          <input name="discord" value={formData.discord} onChange={handleChange} placeholder="Discord username#1234" className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4" />
          <input name="github" value={formData.github} onChange={handleChange} placeholder="GitHub username" className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4" />
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Private Notes" rows={5} className="w-full bg-gray-900 border border-gray-700 rounded-3xl px-6 py-4" />
        </div>

        <button onClick={handleSave} disabled={isSaving} className="mt-12 w-full bg-green-600 py-6 rounded-3xl text-xl font-bold flex items-center justify-center gap-2">
          <Save size={24} />
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
  }
