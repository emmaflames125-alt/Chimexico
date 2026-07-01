import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';

type Profile = {
  displayName: string;
  bio?: string;
  photoURL?: string;
  email?: string;
  phone?: string;
  discord?: string;
  github?: string;
  notes?: string;
};

type ProfileContextType = {
  profile: Profile | null;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const userDoc = doc(db, "users", auth.currentUser.uid);
    const unsubscribe = onSnapshot(userDoc, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as Profile);
      } else {
        setDoc(userDoc, {
          displayName: auth.currentUser?.displayName || "Chimex User",
          bio: "Hey there! 🌮",
        });
      }
    });

    return unsubscribe;
  }, []);

  const updateProfile = async (data: Partial<Profile>) => {
    if (!auth.currentUser) return;
    const userDoc = doc(db, "users", auth.currentUser.uid);
    await setDoc(userDoc, { ...profile, ...data }, { merge: true });
  };

  const uploadAvatar = async (file: File) => {
    if (!auth.currentUser) return;
    const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await updateProfile({ photoURL: url });
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, uploadAvatar }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within ProfileProvider");
  return context;
};