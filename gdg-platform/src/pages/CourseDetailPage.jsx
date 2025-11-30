import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { CoursesAPI } from '../api/courses';
import { useAuth } from '../context/AuthContext';
import { getEmbedUrl } from '../utils/video';

const CourseDetailPage = () => {
	const { id } = useParams();
	const { token } = useAuth();
	const [course, setCourse] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!id || !token) return;
		const fetchCourse = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const data = await CoursesAPI.get(id, token);
				setCourse(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};
		fetchCourse();
	}, [id, token]);

	return (
		<section className="page-stack">
			<PageHeader
				title={course?.title || 'Course'}
				description={course?.description || 'Course detail'}
				actions={
					<Link to="/dashboard" className="btn btn--ghost">
						Back to dashboard
					</Link>
				}
			/>
			{error && <p className="form-error">{error}</p>}
			{isLoading && <p>Loading course...</p>}
			{!isLoading && course && (
				<div className="card course-detail">
					<div className="course-detail__meta">
						<p><strong>Instructor:</strong> {course.owner?.name || 'N/A'}</p>
						<p><strong>Total videos:</strong> {course.videos?.length || 0}</p>
					</div>
					<div className="course-detail__videos">
						<h3>Videos</h3>
							{course.videos?.length ? (
							<ul className="video-list">
									{course.videos.map((video) => {
										const embedUrl = getEmbedUrl(video.videoUrl);
										return (
									<li key={video.id} className="video-list__item">
										<div>
											<p className="video-list__title">{video.title}</p>
											<p className="video-list__description">{video.description}</p>
										</div>
											<div className="video-list__actions">
											{embedUrl ? (
													<div className="video-embed">
														<iframe
															title={video.title}
														src={embedUrl}
															allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
															allowFullScreen
														/>
													</div>
												) : (
													video.videoUrl && (
														<a href={video.videoUrl} className="btn btn--ghost" target="_blank" rel="noreferrer">
															Open video
														</a>
													)
												)}
											</div>
									</li>
									);
								})}
							</ul>
						) : (
							<p>No videos available for this course.</p>
						)}
					</div>
				</div>
			)}
		</section>
	);
};

export default CourseDetailPage;
