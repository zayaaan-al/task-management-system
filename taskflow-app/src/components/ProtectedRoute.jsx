import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <div className="flex flex-col items-center gap-4">
          <div className="loader" style={{ width: 40, height: 40, borderWidth: 3, borderColor: 'rgba(0,74,198,0.2)', borderTopColor: '#004ac6' }} />
          <p className="text-[#737686] text-sm font-medium">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
