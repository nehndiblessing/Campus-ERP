import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/common/Loader";
import api from "../services/api";
import useAuth from "../context/useAuth";
import { toast } from "react-hot-toast";

const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    student: "",
    subject: "",
    examType: "Quiz",
    marks: "",
  });

  const { user } = useAuth();

  const fetchMarks = async () => {
    try {
      const { data } = await api.get("/marks");
      setMarks(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to load marks.");
      toast.error("Failed to load marks");
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
      await Promise.all([fetchMarks(), fetchStudents()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!formData.student) {
      toast.error("Please select a student.");
      return;
    }
    if (!formData.subject.trim()) {
      toast.error("Subject is required.");
      return;
    }
    if (!formData.marks.toString().trim()) {
      toast.error("Marks are required.");
      return;
    }
    const markValue = Number(formData.marks);
    if (!Number.isFinite(markValue) || markValue < 0 || markValue > 100) {
      toast.error("Marks must be a number between 0 and 100.");
      return;
    }

    setIsSaving(true);
    try {
      await api.post("/marks", formData);
      setShowModal(false);
      setFormData({ student: "", subject: "", examType: "Quiz", marks: "" });
      await fetchMarks();
      toast.success("Mark added");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add mark");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this mark?")) return;
    try {
      await api.delete(`/marks/${id}`);
      fetchMarks();
      toast.success("Mark deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete mark");
    }
  };

  return (
    <MainLayout>
      <div className="students-header">
        <h1>Marks</h1>
        {user?.role === "admin" && (
          <button onClick={() => setShowModal(true)}>Add Mark</button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <table className="student-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Subject</th>
            <th>Exam</th>
            <th>Marks</th>
            {user?.role === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {marks.map((m) => (
            <tr key={m._id}>
              <td>{m.student?.name}</td>
              <td>{m.subject}</td>
              <td>{m.examType}</td>
              <td>{m.marks}</td>
              {user?.role === "admin" && (
                <td>
                  <button onClick={() => handleDelete(m._id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleCreate}>
            <h2>Add Mark</h2>

            <label>
              Student
              <select
                required
                value={formData.student}
                onChange={(e) => setFormData({ ...formData, student: e.target.value })}
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Subject
              <input required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
            </label>

            <label>
              Exam Type
              <select value={formData.examType} onChange={(e) => setFormData({ ...formData, examType: e.target.value })}>
                <option>Quiz</option>
                <option>Midterm</option>
                <option>Final</option>
              </select>
            </label>

            <label>
              Marks
              <input required type="number" value={formData.marks} onChange={(e) => setFormData({ ...formData, marks: e.target.value })} />
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

export default Marks;