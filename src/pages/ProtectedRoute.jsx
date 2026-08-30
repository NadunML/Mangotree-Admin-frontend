import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    // Redirect to login if no token or user data exists
    if (!token || !userString) {
        return <Navigate to="/login" replace />; 
    }

    try {
        const user = JSON.parse(userString);

        // Strictly enforce the 'admin' role
        if (user.role !== 'admin') {
            // If a standard customer tries to access, log them out and redirect
            localStorage.clear();
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }

    return children;
}