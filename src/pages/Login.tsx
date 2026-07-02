import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-green-700 to-yellow-500 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="text-7xl mb-6">🌮</div>
        <h1 className="text-5xl font-bold text-gray-900 mb-2">Chimexico</h1>
        <p className="text-xl text-gray-600 mb-10">¡El chat más sabroso del mundo!</p>
        
        <button
          onClick={loginWithGoogle}
          className="w-full bg-white border-2 border-gray-300 hover:border-red-500 text-gray-800 font-semibold py-5 px-8 rounded-2xl flex items-center justify-center gap-4 text-xl transition-all active:scale-95"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-7 h-7" />
          Sign in with Google
        </button>
        
        <p className="text-xs text-gray-500 mt-10">Real-time • Secure • Fun</p>
      </div>
    </div>
  );
}
