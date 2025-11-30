const DataTable = ({ columns, rows, emptyMessage = 'Nothing to show', rowKey = (row) => row.id }) => (
	<div className="table-wrapper">
		<table>
			<thead>
				<tr>
					{columns.map((column) => (
						<th key={column.key}>{column.label}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.length === 0 && (
					<tr>
						<td colSpan={columns.length} className="table-empty">
							{emptyMessage}
						</td>
					</tr>
				)}
				{rows.map((row) => (
					<tr key={rowKey(row)}>
						{columns.map((column) => (
							<td key={column.key}>{column.render ? column.render(row[column.key], row) : row[column.key]}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

export default DataTable;
