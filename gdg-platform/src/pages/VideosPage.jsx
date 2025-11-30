import { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import FormField from '../components/forms/FormField';
import SelectField from '../components/forms/SelectField';
import { VideosAPI } from '../api/videos';
import { CoursesAPI } from '../api/courses';
import { useAuth } from '../context/AuthContext';

const VideosPage = () => {
	const { token } = useAuth();
	const [videos, setVideos] = useState([]);
	const [courses, setCourses] = useState([]);
	const [form, setForm] = useState({ title: '', videoUrl: '', thumbnailUrl: '', courseId: '', isPublic: false });
	const [selectedCourse, setSelectedCourse] = useState('');
	const [loading, setLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [error, setError] = useState(null);

	const fetchCourses = async () => {
		if (!token) return;
		try {
			const data = await CoursesAPI.list(token);
			setCourses(data);
		} catch (err) {
			console.error(err);
		}
	};

	const fetchVideos = async (courseFilter) => {
		if (!token) return;
		setLoading(true);
		setError(null);
		try {
			const params = courseFilter ? { courseId: courseFilter } : {};
			const data = await VideosAPI.list(token, params);
			setVideos(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCourses();
		fetchVideos(selectedCourse);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token, selectedCourse]);

	const handleFilterChange = (event) => {
		setSelectedCourse(event.target.value);
	};

	const handleChange = (event) => {
		const { name, value, type, checked } = event.target;
		setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!form.title || !form.videoUrl || !form.courseId) return;
		try {
			setIsSubmitting(true);
			const payload = {
				title: form.title,
				videoUrl: form.videoUrl,
				thumbnailUrl: form.thumbnailUrl,
				isPublic: form.isPublic,
				courseId: Number(form.courseId),
			};
			if (editingId) {
				await VideosAPI.update(editingId, payload, token);
			} else {
				await VideosAPI.create(payload, token);
			}
			setForm({ title: '', videoUrl: '', thumbnailUrl: '', courseId: '', isPublic: false });
			setEditingId(null);
			fetchVideos(selectedCourse);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEditClick = (video) => {
		setEditingId(video.id);
		setForm({
			title: video.title || '',
			videoUrl: video.videoUrl || '',
			thumbnailUrl: video.thumbnailUrl || '',
			courseId: String(video.courseId || ''),
			isPublic: Boolean(video.isPublic),
		});
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setForm({ title: '', videoUrl: '', thumbnailUrl: '', courseId: '', isPublic: false });
	};

	const handleDeleteClick = async (videoId) => {
		if (!window.confirm('Delete this video?')) return;
		try {
			await VideosAPI.delete(videoId, token);
			if (editingId === videoId) {
				handleCancelEdit();
			}
			fetchVideos(selectedCourse);
		} catch (err) {
			setError(err.message);
		}
	};

	const columns = [
		{ key: 'id', label: 'ID' },
		{ key: 'title', label: 'Title' },
		{ key: 'courseId', label: 'Course ID' },
		{
			key: 'videoUrl',
			label: 'Video URL',
			render: (value) => (
				<a href={value} target="_blank" rel="noreferrer">
					Open
				</a>
			),
		},
		{ key: 'isPublic', label: 'Visibility', render: (value) => (value ? 'Public' : 'Private') },
		{
			key: 'actions',
			label: 'Actions',
			render: (_, row) => (
				<div className="table-actions">
					<button type="button" className="btn btn--ghost" onClick={() => handleEditClick(row)}>
						Edit
					</button>
					<button type="button" className="btn btn--danger" onClick={() => handleDeleteClick(row.id)}>
						Delete
					</button>
				</div>
			),
		},
	];

	return (
		<section className="page-stack">
			<PageHeader title="Videos" description="Attach remote URLs to your courses." />
			<div className="card">
				<SelectField
					label="Filter by course"
					name="filter"
					value={selectedCourse}
					onChange={handleFilterChange}
					options={courses.map((course) => ({ value: course.id, label: course.title }))}
					placeholder="All courses"
					allowEmpty
				/>
			</div>
			<form className="card form-grid" onSubmit={handleSubmit}>
				<FormField label="Title" name="title" value={form.title} onChange={handleChange} required />
				<FormField label="Video URL" name="videoUrl" value={form.videoUrl} onChange={handleChange} placeholder="https://" required />
				<FormField label="Thumbnail URL" name="thumbnailUrl" value={form.thumbnailUrl} onChange={handleChange} placeholder="https://" />
				<SelectField
					label="Course"
					name="courseId"
					value={form.courseId}
					onChange={handleChange}
					options={courses.map((course) => ({ value: course.id, label: course.title }))}
					placeholder={courses.length ? 'Select course' : 'No courses yet'}
					required
				/>
				<label className="form-field checkbox-field">
					<input type="checkbox" name="isPublic" checked={form.isPublic} onChange={handleChange} />
					<span>Public</span>
				</label>
				<div className="form-grid__actions">
					{editingId && (
						<button type="button" className="btn btn--ghost" onClick={handleCancelEdit} disabled={isSubmitting}>
							Cancel
						</button>
					)}
					<button type="submit" className="btn" disabled={isSubmitting}>
						{editingId ? 'Update video' : 'Create video'}
					</button>
				</div>
			</form>
			{error && <p className="form-error">{error}</p>}
			{loading ? <p>Loading videos...</p> : <DataTable columns={columns} rows={videos} />}
		</section>
	);
};

export default VideosPage;
