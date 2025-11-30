import { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import FormField from '../components/forms/FormField';
import { CoursesAPI } from '../api/courses';
import { useAuth } from '../context/AuthContext';

const CoursesPage = () => {
	const { token } = useAuth();
	const [courses, setCourses] = useState([]);
	const [form, setForm] = useState({ title: '', description: '' });
	const [editingId, setEditingId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const fetchCourses = async () => {
		if (!token) return;
		setLoading(true);
		setError(null);
		try {
			const data = await CoursesAPI.list(token);
			setCourses(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCourses();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!form.title) return;
		try {
			setIsSubmitting(true);
			if (editingId) {
				await CoursesAPI.update(editingId, form, token);
			} else {
				await CoursesAPI.create(form, token);
			}
			setForm({ title: '', description: '' });
			setEditingId(null);
			fetchCourses();
		} catch (err) {
			setError(err.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEditClick = (course) => {
		setEditingId(course.id);
		setForm({ title: course.title || '', description: course.description || '' });
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setForm({ title: '', description: '' });
	};

	const handleDeleteClick = async (courseId) => {
		if (!window.confirm('Delete this course? This cannot be undone.')) return;
		try {
			await CoursesAPI.delete(courseId, token);
			if (editingId === courseId) {
				handleCancelEdit();
			}
			fetchCourses();
		} catch (err) {
			setError(err.message);
		}
	};

	const columns = [
		{ key: 'id', label: 'ID' },
		{ key: 'title', label: 'Title' },
		{ key: 'description', label: 'Description' },
		{ key: 'createdAt', label: 'Created' },
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
			<PageHeader title="Courses" description="Organize your catalog." />
			<form className="card form-grid" onSubmit={handleSubmit}>
				<FormField label="Title" name="title" value={form.title} onChange={handleChange} required />
				<FormField label="Description" name="description" value={form.description} onChange={handleChange} as="textarea" />
				<div className="form-grid__actions">
					{editingId && (
						<button type="button" className="btn btn--ghost" onClick={handleCancelEdit} disabled={isSubmitting}>
							Cancel
						</button>
					)}
					<button type="submit" className="btn" disabled={isSubmitting}>
						{editingId ? 'Update course' : 'Create course'}
					</button>
				</div>
			</form>
			{error && <p className="form-error">{error}</p>}
			{loading ? <p>Loading courses...</p> : <DataTable columns={columns} rows={courses} />}
		</section>
	);
};

export default CoursesPage;
