import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/UserProfileContext';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth(); // you'll need to import useAuth
  return currentUser ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;