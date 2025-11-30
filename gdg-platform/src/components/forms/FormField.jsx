const FormField = ({ label, as = 'input', type = 'text', name, value, onChange, placeholder, ...rest }) => (
	<label className="form-field">
		<span>{label}</span>
		{as === 'textarea' ? (
			<textarea name={name} value={value} onChange={onChange} placeholder={placeholder} {...rest} />
		) : (
			<input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} {...rest} />
		)}
	</label>
);

export default FormField;
