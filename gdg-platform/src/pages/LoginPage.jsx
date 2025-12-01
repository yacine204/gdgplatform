import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
	const { login, isLoading, error, continueAsGuest } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [form, setForm] = useState({ email: '', password: '' });

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!form.email || !form.password) return;
		try {
			await login(form);
			navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
		} catch (err) {
			// error handled by context
		}
	};

	const handleGuest = () => {
		continueAsGuest();
		navigate('/learn', { replace: true });
	};

	return (
		<div className="auth-wrapper">
			<form className="auth-card" onSubmit={handleSubmit}>
				<h1>Welcome back</h1>
				<p>Sign in to manage your content.</p>

				<label className="form-field">
					<span>Email</span>
					<input type="email" name="email" value={form.email} onChange={handleChange} placeholder="admin@example.com" required />
				</label>

				<label className="form-field">
					<span>Password</span>
					<input type="password" name="password" value={form.password} onChange={handleChange} placeholder="******" required />
				</label>

				{error && <p className="form-error">{error}</p>}

				<button type="submit" className="btn" disabled={isLoading}>
					{isLoading ? 'Signing in...' : 'Sign in'}
				</button>
				<button type="button" className="btn btn--ghost" onClick={handleGuest}>
					Continue as guest
				</button>
			</form>
		</div>
	);
};

export default LoginPage;
