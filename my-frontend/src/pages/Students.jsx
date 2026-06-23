import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/common/Loader";
import { toast } from "react-hot-toast";
import api from "../services/api";

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
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
  const [searchName, setSearchName] = useState("");
  const [searchRollNo, setSearchRollNo] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(0);
  const debounceRef = useRef(null);

  const fetchStudents = async (
    targetPage = 1,
    name = "",
    rollNo = "",
    department = "",
    semester = "",
    limit = rowsPerPage
  ) => {
    try {
      const params = { page: targetPage };
      if (limit > 0) params.limit = limit;
      if (name) params.searchName = name;
      if (rollNo) params.searchRollNo = rollNo;
      if (department) params.department = department;
      if (semester) params.semester = semester;

      const { data } = await api.get("/students", { params });
      setStudents(Array.isArray(data.students) ? data.students : []);
      setPage(data.page || targetPage);
      setTotalPages(data.totalPages || 1);
      setError("");
    } catch (err) {
      console.error("Failed to load students", err);
      const message = err?.response?.data?.message || err?.message || "Unable to load students.";
      setError(message);
      toast.error(message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get("/departments");
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load departments", err);
      toast.error("Unable to load departments");
      setDepartments([]);
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([
        fetchStudents(1, searchName, searchRollNo, filterDepartment, filterSemester, rowsPerPage),
        fetchDepartments(),
      ]);
    } catch (err) {
      console.error("Error loading student page", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [rowsPerPage]);

  const scheduleFetchStudents = (
    targetPage,
    name,
    rollNo,
    department,
    semester,
    limit = rowsPerPage
  ) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchStudents(targetPage, name, rollNo, department, semester, limit);
    }, 250);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSearchName = (event) => {
    const value = event.target.value;
    setSearchName(value);
    scheduleFetchStudents(1, value, searchRollNo, filterDepartment, filterSemester, rowsPerPage);
  };

  const handleSearchRollNo = (event) => {
    const value = event.target.value;
    setSearchRollNo(value);
    scheduleFetchStudents(1, searchName, value, filterDepartment, filterSemester, rowsPerPage);
  };

  const handleFilterDepartment = (event) => {
    const value = event.target.value;
    setFilterDepartment(value);
    scheduleFetchStudents(1, searchName, searchRollNo, value, filterSemester, rowsPerPage);
  };

  const handleFilterSemester = (event) => {
    const value = event.target.value;
    setFilterSemester(value);
    scheduleFetchStudents(1, searchName, searchRollNo, filterDepartment, value, rowsPerPage);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required.";
    if (!formData.email.trim()) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return "Enter a valid email.";
    if (!formData.rollNo.trim()) return "Roll number is required.";
    if (!formData.department.trim()) return "Department is required.";
    if (!formData.semester.toString().trim()) return "Semester is required.";
    const semesterValue = Number(formData.semester);
    if (!Number.isInteger(semesterValue) || semesterValue < 1 || semesterValue > 12) {
      return "Semester must be between 1 and 12.";
    }
    if (formData.phone && !/^[0-9+\-() ]{7,20}$/.test(formData.phone)) return "Enter a valid phone number.";
    if (formData.photo && !/^https?:\/\//.test(formData.photo)) return "Photo URL must start with http:// or https://.";
    return "";
  };

  const resetForm = () => {
    setEditMode(false);
    setEditId(null);
    setFormData({
      name: "",
      email: "",
      rollNo: "",
      department: "",
      semester: "",
      phone: "",
      photo: "",
    });
  };

  const handleSaveStudent = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSaving(true);
    try {
      if (editMode && editId) {
        await api.put(`/students/${editId}`, formData);
        toast.success("Student updated successfully.");
      } else {
        await api.post("/students", formData);
        toast.success("Student added successfully.");
      }

      await fetchStudents(page, searchName, searchRollNo, filterDepartment, filterSemester, rowsPerPage);
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Save failed", err);
      toast.error(editMode ? "Unable to update student." : "Unable to add student.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditStudent = (student) => {
    setEditMode(true);
    setEditId(student._id || student.id);
    setFormData({
      name: student.name || "",
      email: student.email || "",
      rollNo: student.rollNo || "",
      department: student.department?._id || student.department || "",
      semester: student.semester || "",
      phone: student.phone || "",
      photo: student.photo || "",
    });
    setShowModal(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (!confirm("Delete this student and all their records?")) return;
    try {
      await api.delete(`/students/${studentId}`);
      toast.success("Student deleted.");
      await fetchStudents(page, searchName, searchRollNo, filterDepartment, filterSemester, rowsPerPage);
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Unable to delete student.");
    }
  };

  return (
    <MainLayout>
      <div className="students-header">
        <h1>Students Management</h1>
        <div className="students-actions" style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search Name"
            value={searchName}
            onChange={handleSearchName}
            style={{ minWidth: 180, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          />
          <input
            type="text"
            placeholder="Search Roll Number"
            value={searchRollNo}
            onChange={handleSearchRollNo}
            style={{ minWidth: 180, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          />
          <select
            value={rowsPerPage}
            onChange={(event) => {
              const value = Number(event.target.value);
              setRowsPerPage(value);
              setPage(1);
              fetchStudents(1, searchName, searchRollNo, filterDepartment, filterSemester, value);
            }}
            style={{ minWidth: 160, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          >
            <option value={0}>All Students</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
          <select
            value={filterDepartment}
            onChange={handleFilterDepartment}
            style={{ minWidth: 180, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department._id} value={department._id}>
                {department.name}
              </option>
            ))}
          </select>
          <select
            value={filterSemester}
            onChange={handleFilterSemester}
            style={{ minWidth: 140, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          >
            <option value="">All Semesters</option>
            {Array.from({ length: 12 }, (_, index) => index + 1).map((semester) => (
              <option key={semester} value={semester}>
                Semester {semester}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            style={{ padding: "10px 16px", borderRadius: 8 }}
          >
            Add Student
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {error && <div className="error-message">{error}</div>}
          <table className="student-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #e2e8f0" }}>Name</th>
                <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #e2e8f0" }}>Roll No</th>
                <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #e2e8f0" }}>Department</th>
                <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #e2e8f0" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id || student.id}>
                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{student.name}</td>
                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{student.rollNo}</td>
                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>{student.department?.name || student.department || "N/A"}</td>
                    <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9", display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button type="button" onClick={() => navigate(`/students/${student._id || student.id}`)}>
                        View
                      </button>
                      <button type="button" onClick={() => handleEditStudent(student)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDeleteStudent(student._id || student.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: 24, color: "#64748b" }}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && rowsPerPage > 0 && (
            <div className="pagination" style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => fetchStudents(page - 1, searchName, searchRollNo, filterDepartment, filterSemester, rowsPerPage)}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  style={pageNumber === page ? { fontWeight: "bold" } : {}}
                  onClick={() => fetchStudents(pageNumber, searchName, searchRollNo, filterDepartment, filterSemester, rowsPerPage)}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => fetchStudents(page + 1, searchName, searchRollNo, filterDepartment, filterSemester, rowsPerPage)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleSaveStudent} style={{ maxWidth: 520, width: "100%" }}>
            <h2>{editMode ? "Edit Student" : "Add Student"}</h2>
            <input name="name" placeholder="Name" required value={formData.name} onChange={handleFormChange} />
            <input name="email" type="email" placeholder="Email" required value={formData.email} onChange={handleFormChange} />
            <input name="rollNo" placeholder="Roll Number" required value={formData.rollNo} onChange={handleFormChange} />
            <select name="department" required value={formData.department} onChange={handleFormChange} style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}>
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>
            <input name="semester" type="number" placeholder="Semester" required value={formData.semester} onChange={handleFormChange} />
            <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleFormChange} />
            <input name="photo" type="url" placeholder="Photo URL" value={formData.photo} onChange={handleFormChange} />
            <div className="modal-actions" style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
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
