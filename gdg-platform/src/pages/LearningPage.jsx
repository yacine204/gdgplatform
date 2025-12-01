import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CoursesAPI } from '../api/courses';
import { useAuth } from '../context/AuthContext';
import { getEmbedUrl } from '../utils/video';

const LearningPage = () => {
	const { token, user } = useAuth();
	const [courses, setCourses] = useState([]);
	const [featuredCourse, setFeaturedCourse] = useState(null);
	const [featuredVideo, setFeaturedVideo] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCourses = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const data = await CoursesAPI.list(token);
				setCourses(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};
		fetchCourses();
	}, [token]);

	useEffect(() => {
		if (!courses?.length) return;
		const topCourse = courses[0];
		const fetchFeatured = async () => {
			try {
				const detail = await CoursesAPI.get(topCourse.id, token);
				setFeaturedCourse(detail);
				setFeaturedVideo(detail.videos?.[0] || null);
			} catch (err) {
				console.warn('Failed to load featured course', err);
			}
		};
		fetchFeatured();
	}, [courses, token]);

	const stats = useMemo(
		() => [
			{ label: 'Courses available', value: courses.length },
			{ label: 'Learners', value: user?.role === 'admin' ? 'Admin view' : 'Community' },
			{ label: 'Your next lesson', value: featuredCourse?.title || 'Pick a course' },
		],
		[courses.length, user?.role, featuredCourse?.title]
	);

	const courseCards = useMemo(() => courses.slice(0, 6), [courses]);

	return (
		<section className="learn-page">
			<header className="learn-hero">
				<div>
					<p className="learn-hero__eyebrow">Build with GDG</p>
					<h1>Upgrade your skills with curated video lessons</h1>
					<p>
						Track your learning journey, revisit saved content, and watch concise breakdowns crafted by our mentors.
					</p>
					<div className="learn-hero__actions">
						<Link className="btn" to={featuredCourse ? `/courses/${featuredCourse.id}` : '/dashboard'}>
							Start learning
						</Link>
						<Link className="btn btn--ghost" to="/dashboard">
							Back to dashboard
						</Link>
					</div>
				</div>
				{featuredVideo && getEmbedUrl(featuredVideo.videoUrl) && (
					<div className="learn-hero__video">
						<div className="video-embed">
							<iframe
								title={featuredVideo.title}
								src={getEmbedUrl(featuredVideo.videoUrl)}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							/>
						</div>
					</div>
				)}
			</header>

			{error && <p className="form-error">{error}</p>}
			{isLoading ? (
				<p>Loading courses...</p>
			) : (
				<>
					<section className="learn-stats">
						{stats.map((stat) => (
							<div className="learn-stat" key={stat.label}>
								<p className="learn-stat__label">{stat.label}</p>
								<p className="learn-stat__value">{stat.value}</p>
							</div>
						))}
					</section>

					<section className="learn-courses card">
						<div className="card__header">
							<h3>Explore courses</h3>
							<p className="card__subtitle">Discover bite-sized topics crafted for fast growth.</p>
						</div>
						{courseCards.length ? (
							<div className="learn-course-grid">
								{courseCards.map((course) => (
									<article className="learn-course-card" key={course.id}>
										<div>
											<p className="learn-course-card__eyebrow">Guided track</p>
											<h4>{course.title}</h4>
											<p>{course.description || 'No description yet.'}</p>
										</div>
										<Link className="btn btn--ghost" to={`/courses/${course.id}`}>
											View
										</Link>
									</article>
								))}
							</div>
						) : (
							<p>No courses are available yet. Check back soon!</p>
						)}
					</section>

					{featuredVideo && (
						<section className="learn-featured card">
							<div>
								<p className="learn-featured__eyebrow">Featured lesson</p>
								<h3>{featuredVideo.title}</h3>
								<p>{featuredCourse?.description}</p>
							</div>
							<div className="video-embed">
								{getEmbedUrl(featuredVideo.videoUrl) ? (
									<iframe
										title={featuredVideo.title}
										src={getEmbedUrl(featuredVideo.videoUrl)}
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									/>
								) : (
									<a href={featuredVideo.videoUrl} className="btn" target="_blank" rel="noreferrer">
										Watch lesson
									</a>
								)}
							</div>
						</section>
					)}
				</>
			)}
		</section>
	);
};

export default LearningPage;
