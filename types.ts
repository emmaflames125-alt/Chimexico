export type Message = {
  id: string;
  text?: string;
  imageUrl?: string;
  uid: string;
  displayName: string;
  photoURL?: string;
  roomId: string;
  createdAt: any;
  type?: "text" | "image";
  reactions?: Record<string, number>;
};