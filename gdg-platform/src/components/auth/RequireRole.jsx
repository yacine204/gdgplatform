import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RequireRole = ({ allowed }) => {
	const location = useLocation();
	const { user } = useAuth();

	if (!allowed.includes(user?.role)) {
		return <Navigate to="/dashboard" replace state={{ from: location }} />;
	}

	return <Outlet />;
};

export default RequireRole;
