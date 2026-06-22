import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import api from "../services/api"; // Axios setup file

const StudentDetails = () => {
  const { id } = useParams();              // get student ID from URL
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/students/${id}/profile`); // call backend profile
        setStudent(res.data.student);
        setAttendance(res.data.attendance || []);
        setMarks(res.data.marks || []);
        if (!res.data.student) {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching student profile:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading)
    return (
      <MainLayout>
        <p>Loading student details...</p>
      </MainLayout>
    );

  if (notFound || !student)
    return (
      <MainLayout>
        <p>Student details could not be loaded.</p>
        <button onClick={() => navigate(-1)}>Back</button>
      </MainLayout>
    );

  return (
    <MainLayout>
      <h1>Student Details</h1>
      <div className="student-info" style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <img
          src={
            student.photo ||
            `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(student.name)}`
          }
          alt={`${student.name} avatar`}
          style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", border: "2px solid #ddd" }}
        />
        <div>
          <h3>Student Information</h3>
          <p>
            <strong>Name:</strong> {student.name}
          </p>
          <p>
            <strong>Roll No:</strong> {student.rollNo}
          </p>
          <p>
            <strong>Email:</strong> {student.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {student.phone || "N/A"}
          </p>
          <p>
            <strong>Department:</strong> {student.department?.name || student.department}
          </p>
          <p>
            <strong>Semester:</strong> {student.semester}
          </p>
        </div>
      </div>

      <div className="attendance-summary">
        <br></br>
        <h3>Attendance Summary</h3>
        <p>
          <strong>Present:</strong>{" "}
          {attendance.filter((a) => a.status === "Present").length}
        </p>
        <p>
          <strong>Absent:</strong>{" "}
          {attendance.filter((a) => a.status === "Absent").length}
        </p>
        <p>
          <strong>Percentage:</strong>{" "}
          {attendance.length > 0
            ? Math.round((attendance.filter((a) => a.status === "Present").length / attendance.length) * 100)
            : 0}
          %
        </p>
      </div>

      <div className="marks-summary">
        <br></br>
        <h3>Marks</h3>
        {marks.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Exam</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m) => (
                <tr key={m._id}>
                  <td>{m.subject}</td>
                  <td>{m.examType}</td>
                  <td>{m.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No marks available.</p>
        )}
      </div>

      <button onClick={() => navigate(-1)}>Back</button>
    </MainLayout>
  );
};

export default StudentDetails;
