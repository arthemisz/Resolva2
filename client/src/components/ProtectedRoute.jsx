import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authApi';

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
}
