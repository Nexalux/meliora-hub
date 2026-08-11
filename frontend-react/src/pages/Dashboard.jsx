import { useEffect, useState } from "react";

import "../styles/pages/dashboard.css";

import { getDashboardData } from "../api/dashboard";

import ActivityItem from "../components/dashboard/ActivityItem";
import ContinueLearningCard from "../components/dashboard/ContinueLearningCard";
import DashboardEmpty from "../components/dashboard/DashboardEmpty";
import RecommendedRoadmaps from "../components/dashboard/RecommendedRoadmaps";
import StatCard from "../components/dashboard/StatCard";

import DashboardHero from "../components/dashboard/DashboardHero";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import Section from "../components/common/Section";

import {
    FaBookOpen,
    FaBookmark,
    FaCheckCircle,
    FaFire,
    FaHistory,
} from "react-icons/fa";

const decodeHtmlEntities = (value) => {
    if (typeof value !== "string") return value;

    return value
        .replace(/&amp;/gi, "&")
        .replace(/&#038;/gi, "&")
        .replace(/&nbsp;/gi, " ")
        .replace(/&quot;/gi, '"')
        .replace(/&#039;/gi, "'")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">");
};

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        let active = true;
        const controller = new AbortController();

        async function loadDashboard() {

            try {

                setError(null);

                const data = await getDashboardData({
                    signal: controller.signal,
                });

                if (active) {
                    setDashboard(data);
                }

            } catch (err) {

                console.error("Failed to load dashboard:", err);

                if (active) {

                    setError(
                        err.message ||
                        "Failed to load dashboard."
                    );

                }

            } finally {

                if (active) {
                    setLoading(false);
                }

            }

        }

        loadDashboard();

        return () => {
            active = false;
            controller.abort();
        };

    }, []);

    if (loading) {
    return <DashboardSkeleton />;
}

    if (error) {

        return (
            <main className="page dashboard">
                <div className="container">

                    <div className="dashboard-error-state">

                        <h2>Something went wrong</h2>

                        <p>{error}</p>

                    </div>

                </div>
            </main>
        );

    }

    const stats = dashboard?.stats ?? {};

    const activities = Array.isArray(dashboard?.activities)
        ? dashboard.activities
        : [];

    const recommendations = Array.isArray(
        dashboard?.recommendations
    )
        ? dashboard.recommendations
        : [];

    return (

        <main className="page dashboard">

            <div className="container">

                <DashboardHero />

                <Section
                    className="dashboard-section"
                    title="Overview"
                >

                    <div className="dashboard__overview">

                        <StatCard
                            icon={<FaBookOpen />}
                            title="Total Roadmaps"
                            value={stats.roadmaps ?? 0}
                            subtitle="Available to explore"
                        />

                        <StatCard
                            icon={<FaBookmark />}
                            title="Bookmarks"
                            value={stats.bookmarks ?? 0}
                            subtitle="Saved for later"
                        />

                        <StatCard
                            icon={<FaCheckCircle />}
                            title="Completed Steps"
                            value={stats.completed ?? 0}
                            subtitle="Across all roadmaps"
                        />

                        <StatCard
                            icon={<FaFire />}
                            title="Current Streak"
                            value={`${stats.streak ?? 0} Days`}
                            subtitle="Keep it going!"
                        />

                    </div>

                </Section>

                <Section
                    className="dashboard-section"
                    title="Continue Learning"
                >

                    <ContinueLearningCard
                        roadmap={dashboard?.continue_learning}
                    />

                </Section>

                <Section
                    className="dashboard-section"
                    title="Recent Activity"
                >

                    <div className="activity-list">

                        {activities.length > 0 ? (

                            activities.map((activity) => (

                                <ActivityItem
                                    key={activity.id}
                                    activity={{
                                        ...activity,
                                        title: decodeHtmlEntities(activity.title),
                                        description: decodeHtmlEntities(activity.description),
                                    }}
                                />

                            ))

                        ) : (

                            <DashboardEmpty
                                icon={<FaHistory />}
                                title="No recent activity"
                                description="Your learning activity will appear here once you start completing roadmaps and lessons."
                            />

                        )}

                    </div>

                </Section>

                <Section
                    className="dashboard-section"
                    title="Recommended For You"
                >

                    <RecommendedRoadmaps
                        roadmaps={recommendations}
                    />

                </Section>

            </div>

        </main>

    );

}

export default Dashboard;
