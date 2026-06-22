const AtRiskWidget = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="dashboard-section">
        <h2>⚠ Students Requiring Attention</h2>
        <p>No at-risk students found.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <h2>⚠ Students Requiring Attention ({data.length})</h2>
      {data.map((student) => (
        <div key={student._id} className="at-risk-card">
          <div className="at-risk-header">
            <strong>{student.name}</strong>
            <span className="at-risk-badge">{student.reason}</span>
          </div>
          <div className="at-risk-details">
            <span>Roll: {student.rollNo}</span>
            <span>Semester: {student.semester}</span>
            <span>Dept: {student.department?.name ?? "N/A"}</span>
            <span className={student.attendancePercent < 75 ? "at-risk-warn" : ""}>
              Attendance: {student.attendancePercent}%
            </span>
            <span className={student.avgMarks < 40 ? "at-risk-warn" : ""}>
              Avg Marks: {student.avgMarks}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AtRiskWidget;
