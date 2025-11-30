const PageHeader = ({ title, description, actions }) => (
	<div className="page-header">
		<div>
			<h2>{title}</h2>
			<p>{description}</p>
		</div>
		{actions && <div className="page-header__actions">{actions}</div>}
	</div>
);

export default PageHeader;
