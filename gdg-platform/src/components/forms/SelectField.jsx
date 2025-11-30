const SelectField = ({ label, name, value, onChange, options = [], placeholder = 'Select...', allowEmpty = false, ...rest }) => (
	<label className="form-field">
		<span>{label}</span>
		<select name={name} value={value} onChange={onChange} {...rest}>
			<option value="" disabled={!allowEmpty}>
				{placeholder}
			</option>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	</label>
);

export default SelectField;
