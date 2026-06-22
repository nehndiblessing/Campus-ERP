import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/common/Loader";
import StatCard from "../components/dashboard/StatCard";
import AttendanceChart from "../components/dashboard/AttendanceChart";
import AttendanceTrendChart from "../components/dashboard/AttendanceTrendChart";
import MarksBarChart from "../components/dashboard/MarksBarChart";
import AtRiskWidget from "../components/dashboard/AtRiskWidget";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [deptStats, setDeptStats] = useState(null);
  const [atRisk, setAtRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [statsRes, deptRes, atRiskRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/department-stats"),
          api.get("/dashboard/at-risk"),
        ]);
        setStats(statsRes.data);
        setDeptStats(deptRes.data);
        setAtRisk(atRiskRes.data);
        setError("");
      } catch (error) {
        console.error(error);
        setError(error.response?.data?.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <MainLayout>
      <h1>Dashboard</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="stats-grid">
        <StatCard title="Total Students" value={stats?.totalStudents ?? 0} />
        <StatCard title="Present Today" value={stats?.presentToday ?? 0} />
        <StatCard title="Absent Today" value={stats?.absentToday ?? 0} />
        <StatCard title="Attendance %" value={`${stats?.attendancePercentage ?? 0}%`} />
        <StatCard title="Total Marks Records" value={stats?.totalMarksRecords ?? 0} />
        <StatCard title="Average Marks" value={Math.round(stats?.averageMarks ?? 0)} />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Attendance Overview</h2>
          <AttendanceChart
            data={stats?.attendanceData ?? [
              { name: "Present", value: stats?.presentToday ?? 0 },
              { name: "Absent", value: stats?.absentToday ?? 0 },
            ]}
          />
        </div>

        <div className="dashboard-card">
          <h2>Weekly Attendance Trend</h2>
          <AttendanceTrendChart data={stats?.attendanceTrend ?? []} />
        </div>
      </div>

      <div className="dashboard-card">
        <h2>Average Marks by Subject</h2>
        <MarksBarChart data={stats?.subjectAverageMarks ?? []} />
      </div>

      <div className="dashboard-section">
        <h2>Recently Added Students</h2>
        {stats?.recentStudents?.length > 0 ? (
          stats.recentStudents.map((student) => (
            <div key={student._id} className="activity-card">
              <strong>{student.name}</strong>
              <p>{student.rollNo}</p>
            </div>
          ))
        ) : (
          <p>No recent students found.</p>
        )}
      </div>

      <AtRiskWidget data={atRisk?.atRiskStudents ?? []} />

      <div className="dashboard-section">
        <h2>Department Statistics</h2>
        {deptStats?.departmentStats?.length > 0 ? (
          deptStats.departmentStats.map((dept) => (
            <div key={dept.departmentCode} className="dept-stats-card">
              <h3>{dept.department} ({dept.departmentCode})</h3>
              <div className="dept-stats-grid">
                <StatCard title="Students" value={dept.totalStudents} />
                <StatCard title="Present Today" value={dept.presentToday} />
                <StatCard title="Absent Today" value={dept.absentToday} />
                <StatCard title="Attendance %" value={`${dept.attendancePercentage}%`} />
                <StatCard title="Average Marks" value={dept.averageMarks} />
              </div>
            </div>
          ))
        ) : (
          <p>No department data available.</p>
        )}
      </div>
    </>
      )}
    </MainLayout>
  );
};

export default Dashboard;
