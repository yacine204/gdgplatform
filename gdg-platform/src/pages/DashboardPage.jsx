import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../context/AuthContext';
import { UsersAPI } from '../api/users';
import { CoursesAPI } from '../api/courses';
import { VideosAPI } from '../api/videos';

const DashboardPage = () => {
	const { token, user } = useAuth();
	const [stats, setStats] = useState({ users: 0, courses: 0, videos: 0 });
	const [courseList, setCourseList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchStats = async () => {
			if (!token) return;
			setLoading(true);
			setError(null);
			try {
				const [users, courses, videos] = await Promise.all([
					user?.role === 'admin' ? UsersAPI.list(token) : Promise.resolve([]),
					CoursesAPI.list(token),
					user?.role === 'admin' ? VideosAPI.list(token) : Promise.resolve([]),
				]);
				setStats({
					users: users.length || 1,
					courses: courses.length,
					videos: videos.length,
				});
				setCourseList(courses);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, [token, user]);

	return (
		<section className="page-stack">
			<PageHeader title="Dashboard" description="Quick snapshot of your platform." />
			{error && <p className="form-error">{error}</p>}
			{loading ? (
				<p>Loading...</p>
			) : (
				<>
					<div className="grid grid--three">
						<StatCard label="Users" value={stats.users} />
						<StatCard label="Courses" value={stats.courses} />
						<StatCard label="Videos" value={stats.videos} />
					</div>
					<div className="card">
						<div className="card__header">
							<h3>Available courses</h3>
							<p className="card__subtitle">Select a course to view its public videos.</p>
						</div>
						{courseList.length ? (
							<ul className="course-link-list">
								{courseList.map((course) => (
									<li key={course.id}>
										<Link to={`/courses/${course.id}`}>{course.title}</Link>
									</li>
								))}
							</ul>
						) : (
							<p className="table-empty">No courses available.</p>
						)}
					</div>
				</>
			)}
		</section>
	);
};

export default DashboardPage;
