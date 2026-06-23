import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/common/Loader";
import StatCard from "../components/dashboard/StatCard";
import AttendanceChart from "../components/dashboard/AttendanceChart";
import AttendanceTrendChart from "../components/dashboard/AttendanceTrendChart";
import MarksBarChart from "../components/dashboard/MarksBarChart";
import AtRiskWidget from "../components/dashboard/AtRiskWidget";
import ActivityFeed from "../components/dashboard/ActivityFeed";
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
      setError("");
      try {
        const statsRes = await api.get("/dashboard/stats");
        setStats(statsRes.data);
      } catch (error) {
        console.error("Stats error:", error);
      }

      try {
        const deptRes = await api.get("/dashboard/department-stats");
        setDeptStats(deptRes.data);
      } catch (error) {
        console.error("Dept stats error:", error);
      }

      try {
        const atRiskRes = await api.get("/dashboard/at-risk");
        setAtRisk(atRiskRes.data);
      } catch (error) {
        console.error("At-risk error:", error);
      }

      setLoading(false);
    };

    fetchDashboard();
  }, []);

  return (
    <MainLayout>
      <h1>Dashboard</h1>

      {loading ? (
        <Loader />
      ) : (
        <>
          {error && <div className="error-message">{error}</div>}

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

          <ActivityFeed />

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
