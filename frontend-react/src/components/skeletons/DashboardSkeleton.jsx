import ContinueLearningSkeleton from "./ContinueLearningSkeleton";
import SkeletonActivityItem from "./SkeletonActivityItem";
import SkeletonCard from "./SkeletonCard";
import SkeletonStatCard from "./SkeletonStatCard";

import Section from "../common/Section";

import "../../styles/components/skeleton.css";

function DashboardSkeleton() {
    return (
        <main className="page dashboard">

            <div className="container">

                <section className="dashboard-hero dashboard-skeleton__hero">
                    <div className="skeleton dashboard-skeleton__hero-title" />
                    <div className="skeleton dashboard-skeleton__hero-subtitle" />
                </section>

                <Section
                    className="dashboard-section"
                    title="Overview"
                >
                    <div className="dashboard__overview">

                        {Array.from({ length: 4 }).map((_, index) => (
                            <SkeletonStatCard key={index} />
                        ))}

                    </div>
                </Section>

                <Section
                    className="dashboard-section"
                    title="Continue Learning"
                >
                    <ContinueLearningSkeleton />
                </Section>

                <Section
                    className="dashboard-section"
                    title="Recent Activity"
                >
                    <div className="activity-list">

                        {Array.from({ length: 4 }).map((_, index) => (
                            <SkeletonActivityItem key={index} />
                        ))}

                    </div>
                </Section>

                <Section
                    className="dashboard-section"
                    title="Recommended For You"
                >
                    <div className="recommendation-grid">

                        {Array.from({ length: 3 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}

                    </div>
                </Section>

            </div>

        </main>
    );
}

export default DashboardSkeleton;
