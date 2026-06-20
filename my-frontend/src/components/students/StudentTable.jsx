const StudentTable = ({ attendance = [], onDelete, isAdmin = false }) => {
  return (
    <table className="student-table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Date</th>
          <th>Status</th>
          {isAdmin && <th>Actions</th>}
        </tr>
      </thead>

      <tbody>
        {attendance.map((item) => (
          <tr key={item._id}>
            <td>{item.student?.name}</td>
            <td>{new Date(item.date).toLocaleDateString()}</td>
            <td>{item.status}</td>
            {isAdmin && (
              <td>
                {onDelete && (
                  <button onClick={() => onDelete(item._id)}>Delete</button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;