import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
	{ to: '/dashboard', label: 'Dashboard' },
	{ to: '/learn', label: 'Learning hub' },
	{ to: '/users', label: 'Users', roles: ['admin'] },
	{ to: '/courses', label: 'Courses', roles: ['admin'] },
	{ to: '/videos', label: 'Videos', roles: ['admin'] },
];

const Sidebar = () => {
	const { hasRole } = useAuth();
	return (
		<aside className="sidebar">
			<div className="sidebar__brand">
				<span className="sidebar__logo">GDG</span>
				<p>Video Platform</p>
			</div>
			<nav className="sidebar__nav">
				{navLinks
					.filter((link) => !link.roles || hasRole(...link.roles))
					.map((link) => (
						<NavLink
							key={link.to}
							to={link.to}
							className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
						>
							{link.label}
						</NavLink>
					))}
			</nav>
		</aside>
	);
};

export default Sidebar;
