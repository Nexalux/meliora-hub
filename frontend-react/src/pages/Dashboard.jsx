import "../styles/pages/dashboard.css";

import ActivityItem from "../components/dashboard/ActivityItem";
import ContinueLearningCard from "../components/dashboard/ContinueLearningCard";
import RecommendedRoadmaps from "../components/dashboard/RecommendedRoadmaps";
import StatCard from "../components/dashboard/StatCard";

import {
    FaBookOpen,
    FaBookmark,
    FaCheckCircle,
    FaFire,
    FaRocket,
} from "react-icons/fa";

function Dashboard() {
    const activities = [
        {
            id: 1,
            icon: <FaCheckCircle />,
            title: 'Completed "HTML & CSS Basics"',
            time: "Today • 20 minutes ago",
        },
        {
            id: 2,
            icon: <FaBookmark />,
            title: 'Bookmarked "Docker Essentials"',
            time: "Yesterday",
        },
        {
            id: 3,
            icon: <FaRocket />,
            title: 'Started "React Fundamentals"',
            time: "2 days ago",
        },
    ];

    const recommendedRoadmaps = [
        {
            id: 1,
            title: "React Development",
            short_description:
                "Master React from fundamentals to advanced concepts.",
            difficulty: "Intermediate",
            duration: "2 Months",
            steps_count: 18,
            featured_image:
                "https://placehold.co/600x400?text=React",
        },
        {
            id: 2,
            title: "Docker Essentials",
            short_description:
                "Learn containers, images, and modern Docker workflows.",
            difficulty: "Beginner",
            duration: "3 Weeks",
            steps_count: 10,
            featured_image:
                "https://placehold.co/600x400?text=Docker",
        },
        {
            id: 3,
            title: "Node.js Backend",
            short_description:
                "Build scalable REST APIs using Node.js and Express.",
            difficulty: "Intermediate",
            duration: "6 Weeks",
            steps_count: 14,
            featured_image:
                "https://placehold.co/600x400?text=Node.js",
        },
    ];

    return (
        <main className="dashboard">

            {/* Hero */}
            <section className="dashboard-hero">
                <h1>👋 Welcome back!</h1>

                <p>
                    Continue building your future, one roadmap at a time.
                </p>
            </section>

            {/* Overview */}
            <section className="dashboard-section">

                <h2>Overview</h2>

                <div className="stats-grid">

                    <StatCard
                        icon={<FaBookOpen />}
                        title="Roadmaps"
                        value="12"
                    />

                    <StatCard
                        icon={<FaBookmark />}
                        title="Bookmarks"
                        value="6"
                    />

                    <StatCard
                        icon={<FaCheckCircle />}
                        title="Completed"
                        value="84"
                    />

                    <StatCard
                        icon={<FaFire />}
                        title="Streak"
                        value="7 Days"
                    />

                </div>

            </section>

            {/* Continue Learning */}
            <section className="dashboard-section">
                <ContinueLearningCard />
            </section>

            {/* Recent Activity */}
            <section className="dashboard-section">

                <h2>Recent Activity</h2>

                <div className="activity-list">

                    {activities.map((activity) => (
                        <ActivityItem
                            key={activity.id}
                            icon={activity.icon}
                            title={activity.title}
                            time={activity.time}
                        />
                    ))}

                </div>

            </section>

            {/* Recommended Roadmaps */}
            <RecommendedRoadmaps
                roadmaps={recommendedRoadmaps}
            />

        </main>
    );
}

export default Dashboard;