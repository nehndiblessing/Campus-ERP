import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/common/Loader";
import StudentTable from "../components/students/StudentTable";
import useAuth from "../context/useAuth";
import api from "../services/api";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    student: "",
    date: "",
    status: "Present",
  });

  const fetchAttendance = async () => {
    try {
      const { data } = await api.get("/attendance");
      setAttendance(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to load attendance.");
      toast.error("Failed to load attendance");
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/students");
      setStudents(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to load students.");
      toast.error("Failed to load students");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAttendance(), fetchStudents()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const { user } = useAuth();

  const handleAttendanceSubmit = async (event) => {
    event.preventDefault();

    if (!formData.student) {
      toast.error("Please select a student.");
      return;
    }
    if (!formData.date) {
      toast.error("Please select a date.");
      return;
    }

    setIsSaving(true);
    try {
      await api.post("/attendance", formData);
      await fetchAttendance();
      setShowModal(false);
      setFormData({ student: "", date: "", status: "Present" });
      toast.success("Attendance marked successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to save attendance");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this attendance record?")) return;

    try {
      await api.delete(`/attendance/${id}`);
      await fetchAttendance();
      toast.success("Attendance deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete attendance");
    }
  };

  return (
    <MainLayout>
      <div className="students-header">
        <h1>Attendance</h1>
        {user?.role === "admin" && (
          <button type="button" onClick={() => setShowModal(true)}>
            Mark Attendance
          </button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <StudentTable attendance={attendance} onDelete={handleDelete} isAdmin={user?.role === "admin"} />
      )}

      {showModal && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleAttendanceSubmit}>
            <h2>Mark Attendance</h2>

            <label>
              Student
              <select
                value={formData.student}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    student: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Date
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    date: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Status
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </label>

            <div className="modal-actions">
              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </MainLayout>
  );
};

export default Attendance;
