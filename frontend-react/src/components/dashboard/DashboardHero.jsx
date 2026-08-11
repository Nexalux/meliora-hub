import { useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";

import "../../styles/components/dashboard-hero.css";

export default function DashboardHero() {

    const { user } = useAuth();

    const greeting = useMemo(() => {

        const hour = new Date().getHours();

        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";

        return "Good Evening";

    }, []);

    return (

        <section className="dashboard-hero">

            <div className="hero__heading">

                <span className="hero__line" />

                <h1 className="hero__title">
                    {greeting}
                    {user?.name ? `, ${user.name}` : ""}
                </h1>

                <span className="hero__line" />

            </div>

            <p className="hero__subtitle">
                Continue building your future, one roadmap at a time.
            </p>

        </section>

    );

}