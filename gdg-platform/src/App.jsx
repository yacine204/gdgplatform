import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import RequireAuth from './components/auth/RequireAuth';
import RequireRole from './components/auth/RequireRole';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import CoursesPage from './pages/CoursesPage';
import VideosPage from './pages/VideosPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LearningPage from './pages/LearningPage';

const App = () => (
	<Routes>
		<Route path="/login" element={<LoginPage />} />
		<Route element={<RequireAuth />}>
			<Route element={<AppLayout />}>
				<Route index element={<Navigate to="/dashboard" replace />} />
				<Route path="/dashboard" element={<DashboardPage />} />
					<Route path="/learn" element={<LearningPage />} />
				<Route path="/courses/:id" element={<CourseDetailPage />} />
				<Route element={<RequireRole allowed={['admin']} />}>
					<Route path="/users" element={<UsersPage />} />
					<Route path="/courses" element={<CoursesPage />} />
					<Route path="/videos" element={<VideosPage />} />
				</Route>
			</Route>
		</Route>
		<Route path="*" element={<Navigate to="/dashboard" replace />} />
	</Routes>
);

export default App;
