import { useEffect, useState } from "react";
import api from "../../services/api";

const actionConfig = {
  student_created: { icon: "🎓", label: "New Student Added" },
  attendance_submitted: { icon: "📋", label: "Attendance Submitted" },
  marks_uploaded: { icon: "📊", label: "Marks Uploaded" },
};

const timeAgo = (dateStr) => {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/activities");
        setActivities(res.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return null;

  return (
    <div className="dashboard-section">
      <h2>Recent Activity</h2>
      {activities.length === 0 ? (
        <p>No recent activity.</p>
      ) : (
        activities.map((a) => {
          const config = actionConfig[a.action] || {};
          return (
            <div key={a._id} className="activity-feed-item">
              <span className="activity-icon">{config.icon || "📌"}</span>
              <div className="activity-body">
                <strong>{config.label || a.action}</strong>
                <p>{a.description}</p>
              </div>
              <span className="activity-time">{timeAgo(a.createdAt)}</span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ActivityFeed;
