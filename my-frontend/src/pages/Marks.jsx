import { useEffect, useMemo, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/common/Loader";
import StatCard from "../components/dashboard/StatCard";
import api from "../services/api";
import useAuth from "../context/useAuth";
import { toast } from "react-hot-toast";

const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [formData, setFormData] = useState({
    student: "",
    subject: "",
    examType: "Quiz",
    marks: "",
  });

  const { user } = useAuth();

  const escapeCsvCell = (value) => {
    const text = value === null || value === undefined ? "" : String(value);
    const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;

    return `"${safeText.replace(/"/g, '""')}"`;
  };

  const handleExportMarks = () => {
    if (marks.length === 0) {
      toast.error("No marks available to export");
      return;
    }

    const rows = marks.map((mark) => [
      mark.student?.name ?? "N/A",
      mark.student?.rollNo ?? "N/A",
      mark.subject,
      mark.examType,
      mark.marks,
      mark.createdAt ? new Date(mark.createdAt).toLocaleDateString() : "N/A",
    ]);
    const csvRows = [
      ["Student", "Roll No", "Subject", "Exam Type", "Marks", "Created Date"],
      ...rows,
    ].map((row) => row.map(escapeCsvCell).join(","));
    const csvContent = `\uFEFF${csvRows.join("\n")}`;
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `marks-export-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Marks exported");
  };

  const fetchMarks = async () => {
    try {
      const { data } = await api.get("/marks");
      setMarks(Array.isArray(data) ? data : []);
      setError("");
    } catch (error) {
      console.error("Marks fetch error:", error);
      setError(error.response?.data?.message || error.message || "Failed to load marks.");
      toast.error("Failed to load marks");
    }
  };

  const fetchMarksAnalytics = async () => {
    try {
      const { data } = await api.get("/marks/analytics");
      setAnalytics(data);
      setError("");
    } catch (error) {
      console.error("Analytics error:", error);
      setError(error.response?.data?.message || error.message || "Failed to load marks analytics.");
      toast.error("Failed to load marks analytics");
      setAnalytics({
        averageMarks: 0,
        passRate: 0,
        topSubject: null,
        lowestSubject: null,
      });
    }
  };

  const filteredMarks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return marks;
    }

    return marks.filter((mark) => {
      const studentName = mark.student?.name?.toLowerCase() ?? "";
      const subject = mark.subject?.toLowerCase() ?? "";
      const examType = mark.examType?.toLowerCase() ?? "";
      const marksText = String(mark.marks ?? "").toLowerCase();

      return (
        studentName.includes(normalizedQuery) ||
        subject.includes(normalizedQuery) ||
        examType.includes(normalizedQuery) ||
        marksText.includes(normalizedQuery)
      );
    });
  }, [marks, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredMarks.length / rowsPerPage));

  const currentMarks = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredMarks.slice(start, start + rowsPerPage);
  }, [filteredMarks, currentPage, rowsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const computedAnalytics = useMemo(() => {
    if (!marks || marks.length === 0) {
      return {
        averageMarks: 0,
        passRate: 0,
        topSubject: null,
        lowestSubject: null,
      };
    }

    const numericMarks = marks
      .map((item) => Number(item.marks))
      .filter((value) => Number.isFinite(value));

    if (numericMarks.length === 0) {
      return {
        averageMarks: 0,
        passRate: 0,
        topSubject: null,
        lowestSubject: null,
      };
    }

    const averageMarks = numericMarks.reduce((sum, value) => sum + value, 0) / numericMarks.length;
    const passRate = numericMarks.filter((value) => value >= 40).length / numericMarks.length;

    const subjectGroups = marks.reduce((groups, item) => {
      const subject = item.subject ?? "Unknown";
      const value = Number(item.marks);

      if (!Number.isFinite(value)) return groups;

      if (!groups[subject]) {
        groups[subject] = { total: 0, count: 0 };
      }
      groups[subject].total += value;
      groups[subject].count += 1;
      return groups;
    }, {});

    const sortedSubjects = Object.entries(subjectGroups).map(([subject, group]) => ({
      subject,
      averageMarks: group.total / group.count,
    }));

    const topSubject = sortedSubjects.length
      ? sortedSubjects.reduce((top, current) => (current.averageMarks > top.averageMarks ? current : top), sortedSubjects[0])
      : null;

    const lowestSubject = sortedSubjects.length
      ? sortedSubjects.reduce((bottom, current) => (current.averageMarks < bottom.averageMarks ? current : bottom), sortedSubjects[0])
      : null;

    return {
      averageMarks,
      passRate: passRate * 100,
      topSubject,
      lowestSubject,
    };
  }, [marks]);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/students");
      setStudents(Array.isArray(data) ? data : data.students || []);
      setError("");
    } catch (error) {
      console.error("Students fetch error:", error);
      setError(error.response?.data?.message || error.message || "Failed to load students.");
      toast.error("Failed to load students");
    }
  };

  const openAddMarkModal = async () => {
    setShowModal(true);
    if (students.length === 0) {
      await fetchStudents();
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        await fetchMarks();
      } catch (err) {
        console.error("Error fetching marks:", err);
      }

      try {
        await fetchMarksAnalytics();
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }

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
      await Promise.all([fetchMarks(), fetchMarksAnalytics()]);
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
      await Promise.all([fetchMarks(), fetchMarksAnalytics()]);
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
        <div className="marks-actions">
          <button type="button" onClick={handleExportMarks} disabled={marks.length === 0}>
            Export Marks
          </button>
          {user?.role === "admin" && (
            <button type="button" onClick={openAddMarkModal}>Add Mark</button>
          )}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {error && <div className="error-message">{error}</div>}

          <div className="marks-toolbar">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student, subject, exam, or marks"
              className="search-input"
            />
            <div className="page-settings">
              <label>
                Rows per page:
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </label>
              <span>{filteredMarks.length} record{filteredMarks.length === 1 ? "" : "s"}</span>
            </div>
          </div>

          <div className="stats-grid">
            <StatCard
              title="Average Marks"
              value={(analytics?.averageMarks ?? computedAnalytics.averageMarks).toFixed(2)}
            />
            <StatCard
              title="Pass Rate"
              value={`${((analytics?.passRate ?? computedAnalytics.passRate).toFixed(1))}%`}
            />
            <StatCard
              title="Top Subject"
              value={
                (analytics?.topSubject ?? computedAnalytics.topSubject)
                  ? `${(analytics?.topSubject ?? computedAnalytics.topSubject).subject} (${(analytics?.topSubject ?? computedAnalytics.topSubject).averageMarks.toFixed(2)})`
                  : "N/A"
              }
            />
            <StatCard
              title="Lowest Subject"
              value={
                (analytics?.lowestSubject ?? computedAnalytics.lowestSubject)
                  ? `${(analytics?.lowestSubject ?? computedAnalytics.lowestSubject).subject} (${(analytics?.lowestSubject ?? computedAnalytics.lowestSubject).averageMarks.toFixed(2)})`
                  : "N/A"
              }
            />
          </div>

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
              {currentMarks.length > 0 ? (
                currentMarks.map((m) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={user?.role === "admin" ? 5 : 4} style={{ textAlign: "center", color: "#94a3b8" }}>
                    No marks match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination-controls">
            <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>
              Next
            </button>
          </div>
        </>
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
