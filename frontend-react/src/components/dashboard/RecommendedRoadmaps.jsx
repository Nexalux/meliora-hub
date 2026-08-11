import RoadmapCard from "../cards/RoadmapCard";
import DashboardEmpty from "./DashboardEmpty";

import { FaCompass } from "react-icons/fa";

function RecommendedRoadmaps({ roadmaps = [] }) {

    if (roadmaps.length === 0) {

        return (

            <DashboardEmpty
                icon={<FaCompass />}
                title="No recommendations yet"
                description="Complete a few roadmaps and bookmark your interests to receive personalized recommendations."
            />

        );

    }

    return (

        <div className="recommendation-grid">

            {roadmaps.slice(0, 3).map((roadmap) => (

                <RoadmapCard
                    key={roadmap.id}
                    roadmap={roadmap}
                    variant="home"
                />

            ))}

        </div>

    );

}

export default RecommendedRoadmaps;
