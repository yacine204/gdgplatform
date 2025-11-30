import { useAuth } from '../../context/AuthContext';

const Topbar = () => {
	const { user, logout } = useAuth();

	return (
		<header className="topbar">
			<div>
				<h1 className="topbar__title">Creator Workspace</h1>
				<p className="topbar__subtitle">Manage users, courses, and videos in one place.</p>
			</div>
			<div className="topbar__session">
				<div className="topbar__user">
					<span className="avatar">{user?.email?.[0]?.toUpperCase()}</span>
					<div>
						<strong>{user?.email}</strong>
						<p className="topbar__role">{user?.role}</p>
					</div>
				</div>
				<button type="button" className="btn btn--ghost" onClick={logout}>
					Sign out
				</button>
			</div>
		</header>
	);
};

export default Topbar;
