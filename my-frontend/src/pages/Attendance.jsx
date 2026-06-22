import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/common/Loader";
import useAuth from "../context/useAuth";
import api from "../services/api";
import "./Attendance.css";

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const Attendance = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [filters, setFilters] = useState({
    department: "",
    semester: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await api.get("/departments");
        setDepartments(data);
      } catch {
        toast.error("Failed to load departments");
      }
    };
    fetchDepartments();
  }, []);

  const loadStudents = async () => {
    if (!filters.department || !filters.semester || !filters.date) {
      toast.error("Please select department, semester, and date");
      return;
    }

    setLoading(true);
    try {
      const [studentsRes, attendanceRes] = await Promise.all([
        api.get(`/students?department=${filters.department}&semester=${filters.semester}`),
        api.get(`/attendance?date=${filters.date}`),
      ]);

      setStudents(studentsRes.data);

      const map = {};
      studentsRes.data.forEach((s) => {
        const existing = attendanceRes.data.find(
          (a) => a.student?._id === s._id
        );
        map[s._id] = existing ? existing.status : "Present";
      });
      setStatusMap(map);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (studentId) => {
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present",
    }));
  };

  const handleSaveAll = async () => {
    const records = Object.entries(statusMap).map(([student, status]) => ({
      student,
      status,
    }));

    setSaving(true);
    try {
      const { data } = await api.post("/attendance/bulk", {
        date: filters.date,
        records,
      });
      if (data.errors?.length > 0) {
        toast.error(`${data.errors.length} record(s) failed`);
      }
      toast.success(`Attendance saved for ${data.results.length} student(s)`);
      loadStudents();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="page-content">
        <h1>Attendance</h1>

        <div className="attendance-filters">
          <select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>

          <select
            value={filters.semester}
            onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
          >
            <option value="">Select Semester</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>

          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />

          <button onClick={loadStudents} disabled={loading}>
            {loading ? "Loading..." : "Load Students"}
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : students.length > 0 ? (
          <>
            <table className="student-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.rollNo}</td>
                    <td>{student.name}</td>
                    <td>
                      <button
                        className={`status-btn ${statusMap[student._id] === "Present" ? "present" : "absent"}`}
                        onClick={() => toggleStatus(student._id)}
                        disabled={user?.role !== "admin"}
                      >
                        {statusMap[student._id] || "Present"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {user?.role === "admin" && (
              <button
                className="save-all-btn"
                onClick={handleSaveAll}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save All"}
              </button>
            )}
          </>
        ) : filters.department && filters.semester && !loading ? (
          <p className="no-data">No students found for the selected department and semester.</p>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default Attendance;
