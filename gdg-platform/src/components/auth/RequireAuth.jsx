import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RequireAuth = () => {
	const location = useLocation();
	const { isAuthenticated, isGuest } = useAuth();

	if (!isAuthenticated && !isGuest) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return <Outlet />;
};

export default RequireAuth;
