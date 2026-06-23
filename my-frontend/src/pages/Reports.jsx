import { useState } from "react";
import { toast } from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import api from "../services/api";

const Reports = () => {
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);

  const downloadFile = async (endpoint, filename) => {
    try {
      const response = await api.get(endpoint, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`${filename} downloaded`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || `Failed to download ${filename}`);
    }
  };

  const handleExportPDF = async () => {
    setLoadingPDF(true);
    await downloadFile("/reports/pdf", `campus-erp-report-${new Date().toISOString().split("T")[0]}.pdf`);
    setLoadingPDF(false);
  };

  const handleExportExcel = async () => {
    setLoadingExcel(true);
    await downloadFile("/reports/excel", `campus-erp-export-${new Date().toISOString().split("T")[0]}.xlsx`);
    setLoadingExcel(false);
  };

  return (
    <MainLayout>
      <h1>Reports</h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Generate and download reports for students, attendance, and marks.
      </p>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div className="report-card" style={{ flex: "1 1 280px", padding: 24, borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff" }}>
          <h3 style={{ marginTop: 0 }}>PDF Report</h3>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Download a complete PDF report containing student lists, attendance summaries, and marks overview.
          </p>
          <button
            onClick={handleExportPDF}
            disabled={loadingPDF}
            style={{ marginTop: 16, padding: "10px 20px", borderRadius: 8 }}
          >
            {loadingPDF ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>

        <div className="report-card" style={{ flex: "1 1 280px", padding: 24, borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff" }}>
          <h3 style={{ marginTop: 0 }}>Excel Export</h3>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Download an Excel workbook with separate sheets for students, attendance records, and marks.
          </p>
          <button
            onClick={handleExportExcel}
            disabled={loadingExcel}
            style={{ marginTop: 16, padding: "10px 20px", borderRadius: 8 }}
          >
            {loadingExcel ? "Generating Excel..." : "Download Excel"}
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
