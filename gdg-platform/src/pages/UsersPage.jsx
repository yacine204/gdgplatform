import { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import FormField from '../components/forms/FormField';
import SelectField from '../components/forms/SelectField';
import { UsersAPI } from '../api/users';
import { useAuth } from '../context/AuthContext';

const roleOptions = [
	{ value: 'user', label: 'User' },
	{ value: 'admin', label: 'Admin' },
];

const UsersPage = () => {
	const { token, user } = useAuth();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [form, setForm] = useState({ email: '', password: '', role: 'user' });

	const canManageUsers = user?.role === 'admin';

	const fetchUsers = async () => {
		if (!canManageUsers || !token) return;
		setLoading(true);
		setError(null);
		try {
			const response = await UsersAPI.list(token);
			setUsers(response);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token, canManageUsers]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleCreate = async (event) => {
		event.preventDefault();
		if (!form.email || !form.password) return;
		try {
			await UsersAPI.register({ email: form.email, password: form.password, role: form.role });
			setForm({ email: '', password: '', role: 'user' });
			fetchUsers();
		} catch (err) {
			setError(err.message);
		}
	};

	const handleDelete = async (id) => {
		if (!token) return;
		try {
			await UsersAPI.delete(id, token);
			setUsers((prev) => prev.filter((item) => item.id !== id));
		} catch (err) {
			setError(err.message);
		}
	};

	const columns = [
		{ key: 'id', label: 'ID' },
		{ key: 'email', label: 'Email' },
		{ key: 'role', label: 'Role' },
		{ key: 'createdAt', label: 'Created At' },
		{
			key: 'actions',
			label: 'Actions',
			render: (_value, row) => (
				<button
					type="button"
					className="btn btn--ghost"
					onClick={() => handleDelete(row.id)}
					disabled={row.id === user?.id}
				>
					Remove
				</button>
			),
		},
	];

	return (
		<section className="page-stack">
			<PageHeader title="Users" description="Invite teammates and manage access." />
			{!canManageUsers && <p>This section is only visible to admins.</p>}
			{canManageUsers && (
				<>
					<form className="card form-grid" onSubmit={handleCreate}>
						<FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
						<FormField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
						<SelectField label="Role" name="role" value={form.role} onChange={handleChange} options={roleOptions} />
						<div className="form-grid__actions">
							<button type="submit" className="btn">
								Create user
							</button>
						</div>
					</form>
					{error && <p className="form-error">{error}</p>}
					{loading ? <p>Loading users...</p> : <DataTable columns={columns} rows={users} />}
				</>
			)}
		</section>
	);
};

export default UsersPage;
