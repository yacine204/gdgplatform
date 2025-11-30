import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppLayout = () => (
	<div className="app-shell">
		<Sidebar />
		<div className="app-shell__body">
			<Topbar />
			<main className="app-shell__content">
				<Outlet />
			</main>
		</div>
	</div>
);

export default AppLayout;
