function ProgressCard({
    completedCount,
    totalSteps,
    progressPercent
}) {

    return (

        <div className="progress-card">

            <div className="progress-header">

                <div>

                    <h2>Learning Progress</h2>

                    <p>
                        {completedCount} of {totalSteps} steps completed
                    </p>

                </div>

                <span className="progress-percent">
                    {progressPercent}%
                </span>

            </div>

            <div className="progress-bar">

                <div
                    className="progress-fill"
                    style={{
                        width: `${progressPercent}%`
                    }}
                />

            </div>

        </div>

    );

}

export default ProgressCard;