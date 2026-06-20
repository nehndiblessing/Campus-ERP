import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/common/Loader";
import { toast } from "react-hot-toast";
import api from "../services/api";

const Students = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNo: "",
    department: "",
    semester: "",
    phone: "",
    photo: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/students");
      setStudents(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to load students.");
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    await fetchStudents();
  };

  loadData();
}, []);

// close suggestions on outside click
useEffect(() => {
  const onDocClick = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  document.addEventListener("click", onDocClick);
  return () => document.removeEventListener("click", onDocClick);
}, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);

    // only show suggestions for admins
    if (user?.role === "admin" && q.trim()) {
      const ql = q.toLowerCase();
      const matches = students
        .filter((s) => (s.name || "").toLowerCase().includes(ql))
        .slice(0, 8);

      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

const validateStudentForm = () => {
  if (!formData.name.trim()) return "Name is required.";
  if (!formData.email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Enter a valid email.";
  if (!formData.rollNo.trim()) return "Roll number is required.";
  if (!formData.department.trim()) return "Department is required.";
  if (!formData.semester.toString().trim()) return "Semester is required.";
  const semesterValue = Number(formData.semester);
  if (!Number.isInteger(semesterValue) || semesterValue < 1 || semesterValue > 12) return "Semester must be a whole number between 1 and 12.";
  if (formData.phone && !/^[0-9+\-() ]{7,20}$/.test(formData.phone)) return "Enter a valid phone number.";
  if (formData.photo && !/^https?:\/\/.+/.test(formData.photo)) return "Photo URL must start with http:// or https://.";
  return "";
};

const handleSaveStudent = async (event) => {
  if (event && event.preventDefault) event.preventDefault();

  const validationError = validateStudentForm();
  if (validationError) {
    toast.error(validationError);
    return;
  }

  setIsSaving(true);
  try {
    if (editMode && editId) {
      await api.put(`/students/${editId}`, formData);
      toast.success("Student updated");
    } else {
      await api.post("/students", formData);
      toast.success("Student added");
    }

    await fetchStudents();
    setShowModal(false);
    setEditMode(false);
    setEditId(null);
    setFormData({ name: "", email: "", rollNo: "", department: "", semester: "", phone: "", photo: "" });
  } catch (error) {
    console.error(error);
    toast.error(editMode ? "Unable to update student" : "Unable to add student");
  } finally {
    setIsSaving(false);
  }
};
  const handleDeleteStudent = async (studentId) => {
    if (!confirm("Delete this student and all their records?")) return;
    try {
      await api.delete(`/students/${studentId}`);
      await fetchStudents();
      toast.success("Student deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete student");
    }
  };

  const handleEditStudent = (student) => {
    setEditMode(true);
    setEditId(student._id || student.id);
    setFormData({
      name: student.name || "",
      email: student.email || "",
      rollNo: student.rollNo || "",
      department: student.department || "",
      semester: student.semester || "",
      phone: student.phone || "",
      photo: student.photo || "",
    });
    setShowModal(true);
  };

  return (
    <MainLayout>
      <div className="students-header">
        <h1>Students Management</h1>
        <div className="students-actions" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div ref={searchRef} style={{ position: "relative", minWidth: 240 }}>
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={handleSearchChange}
            />

            {showSuggestions && suggestions.length > 0 && (
              <ul className="search-suggestions" style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 20, maxHeight: 200, overflow: "auto", borderRadius: 4, margin: 0, padding: 0, listStyle: "none" }}>
                {suggestions.map((s) => (
                  <li
                    key={s._id}
                    onMouseDown={() => {
                      setSearchQuery(s.name);
                      setShowSuggestions(false);
                    }}
                    style={{ padding: 8, cursor: "pointer" }}
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="button" onClick={() => setShowModal(true)}>
            Add Student
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
          {students
            .filter((s) => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              return (
                String(s.name || "").toLowerCase().includes(q) ||
                String(s.rollNo || "").toLowerCase().includes(q) ||
                String(s.department || "").toLowerCase().includes(q) ||
                String(s.email || "").toLowerCase().includes(q)
              );
            })
            .map((student) => (
              <tr key={student.id || student._id}>
                <td>{student.name}</td>
                <td>{student.rollNo}</td>
                <td>{student.department}</td>
                <td>
                  <button onClick={() => navigate(`/students/${student._id}`)}>View</button>
                  <button type="button" onClick={() => handleEditStudent(student)}>Edit</button>
                  <button
                    type="button"
                    onClick={() => handleDeleteStudent(student._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
      )}

      {showModal && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleSaveStudent}>
            <h2>Add Student</h2>

            <input
              name="name"
              placeholder="Name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="rollNo"
              placeholder="Roll Number"
              required
              value={formData.rollNo}
              onChange={handleChange}
            />
            <input
              name="department"
              placeholder="Department"
              required
              value={formData.department}
              onChange={handleChange}
            />
            <input
              name="semester"
              type="number"
              placeholder="Semester"
              required
              value={formData.semester}
              onChange={handleChange}
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              pattern="[0-9+\-() ]{7,20}"
              title="Enter a valid phone number"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              name="photo"
              type="url"
              placeholder="Photo URL (avatar)"
              value={formData.photo}
              onChange={handleChange}
            />

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

export default Students;
