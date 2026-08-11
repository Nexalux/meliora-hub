import "../../styles/components/section.css";

function Section({
    title,
    children,
    actions,
    className = "",
}) {
    return (
        <section
            className={`section ${className}`.trim()}
        >

            {title && (

                <div className="section__header">

                    <h2 className="section__title">
                        {title}
                    </h2>

                    {actions && (

                        <div className="section__actions">

                            {actions}

                        </div>

                    )}

                </div>

            )}

            {children}

        </section>
    );
}

export default Section;