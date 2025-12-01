import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UsersAPI } from '../api/users';

const STORAGE_KEY = 'gdg-platform.auth';

const AuthContext = createContext();

const loadInitialState = () => {
	if (typeof window === 'undefined') {
		return null;
	}
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch (err) {
		console.warn('Failed to load auth state', err);
		return null;
	}
};

export const AuthProvider = ({ children }) => {
	const [authState, setAuthState] = useState(() => loadInitialState());
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		try {
			if (authState) {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
			} else {
				localStorage.removeItem(STORAGE_KEY);
			}
		} catch (err) {
			console.warn('Auth persistence failed', err);
		}
	}, [authState]);

	const login = async (credentials) => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await UsersAPI.login(credentials);
			setAuthState(data);
			return data;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (payload) => {
		setIsLoading(true);
		setError(null);
		try {
			return await UsersAPI.register(payload);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const continueAsGuest = () => {
		setAuthState({
			mode: 'guest',
			user: {
				name: 'Guest',
				role: 'guest',
			},
			token: null,
		});
	};

	const logout = () => {
		setAuthState(null);
		setError(null);
	};

	const hasRole = useCallback((...roles) => {
		if (!authState?.user?.role) return false;
		return roles.includes(authState.user.role);
}, [authState?.user?.role]);

	const isGuest = authState?.mode === 'guest';
	const isAuthenticated = Boolean(authState?.token);
	const canAccessApp = isAuthenticated || isGuest;

	const value = useMemo(
		() => ({
			user: authState?.user || null,
			token: authState?.token || null,
			isAuthenticated,
			isGuest,
			canAccessApp,
			isLoading,
			error,
			login,
			register,
			logout,
			continueAsGuest,
			hasRole,
		}),
		[authState, isLoading, error, hasRole, isAuthenticated, isGuest, canAccessApp]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
};
