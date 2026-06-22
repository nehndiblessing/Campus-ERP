import { useState, useEffect } from "react";
import useAuth from "../context/useAuth";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/common/Loader";
import { toast } from "react-hot-toast";
import api from "../services/api";

const Departments = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get("/departments");
      setDepartments(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to load departments.");
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchDepartments();
    };
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSave = async (event) => {
    if (event && event.preventDefault) event.preventDefault();

    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error("Name and code are required");
      return;
    }

    setIsSaving(true);
    try {
      if (editMode && editId) {
        await api.put(`/departments/${editId}`, formData);
        toast.success("Department updated");
      } else {
        await api.post("/departments", formData);
        toast.success("Department added");
      }

      await fetchDepartments();
      setShowModal(false);
      setEditMode(false);
      setEditId(null);
      setFormData({ name: "", code: "" });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || (editMode ? "Unable to update department" : "Unable to add department"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (dept) => {
    setEditMode(true);
    setEditId(dept._id);
    setFormData({ name: dept.name || "", code: dept.code || "" });
    setShowModal(true);
  };

  const handleDelete = async (deptId) => {
    if (!confirm("Delete this department?")) return;
    try {
      await api.delete(`/departments/${deptId}`);
      await fetchDepartments();
      toast.success("Department deleted");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete department");
    }
  };

  return (
    <MainLayout>
      <div className="students-header">
        <h1>Departments Management</h1>
        {user?.role === "admin" && (
          <div className="students-actions" style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <button type="button" onClick={() => setShowModal(true)}>
              Add Department
            </button>
          </div>
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
              <th>Name</th>
              <th>Code</th>
              {user?.role === "admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept._id}>
                <td>{dept.name}</td>
                <td>{dept.code}</td>
                {user?.role === "admin" && (
                  <td>
                    <button type="button" onClick={() => handleEdit(dept)}>Edit</button>
                    <button type="button" onClick={() => handleDelete(dept._id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleSave}>
            <h2>{editMode ? "Edit Department" : "Add Department"}</h2>

            <input
              name="name"
              placeholder="Department Name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="code"
              placeholder="Department Code (e.g. CSE)"
              required
              value={formData.code}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button type="button" onClick={() => { setShowModal(false); setEditMode(false); setEditId(null); setFormData({ name: "", code: "" }); }}>
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

export default Departments;
