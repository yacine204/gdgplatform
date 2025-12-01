import { useAuth } from '../../context/AuthContext';

const Topbar = () => {
	const { user, logout, isGuest } = useAuth();
	const displayName = user?.email || user?.name || 'Guest';
	const initials = displayName?.[0]?.toUpperCase() || 'G';

	return (
		<header className="topbar">
			<div>
				<h1 className="topbar__title">Creator Workspace</h1>
				<p className="topbar__subtitle">Manage users, courses, and videos in one place.</p>
			</div>
			<div className="topbar__session">
				<div className="topbar__user">
					<span className="avatar">{initials}</span>
					<div>
						<strong>{displayName}</strong>
						<p className="topbar__role">{user?.role || 'guest'}</p>
					</div>
				</div>
				<button type="button" className="btn btn--ghost" onClick={logout}>
					{isGuest ? 'Exit guest' : 'Sign out'}
				</button>
			</div>
		</header>
	);
};

export default Topbar;
