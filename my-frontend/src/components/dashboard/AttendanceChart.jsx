import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4caf50", "#f44336"];

const AttendanceChart = ({ data = [] }) => {
  const chartData = data?.length > 0 ? data : [];
  const total = chartData.reduce((sum, entry) => sum + (entry.value || 0), 0);

  if (total === 0) {
    return (
      <div style={{ width: "100%", height: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", borderRadius: 12 }}>
        <span>No attendance data available</span>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
