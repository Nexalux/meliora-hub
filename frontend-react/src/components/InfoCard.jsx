function InfoCard({

    icon,
    title,
    children

}) {

    return (

        <div className="info-card">

            <div className="info-card-title">

                {icon}

                <h2>{title}</h2>

            </div>

            <div className="info-card-content">

                {children}

            </div>

        </div>

    );

}

export default InfoCard;