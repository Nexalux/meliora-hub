import "../../styles/components/page-header.css";

function PageHeader({
    title,
    subtitle,
    children,
}) {
    return (
        <header className="page-header">

            <div className="page-header__content">

                <h1 className="page-title">
                    {title}
                </h1>

                {subtitle && (
                    <p className="subtitle">
                        {subtitle}
                    </p>
                )}

            </div>

            {children && (
                <div className="page-header__actions">
                    {children}
                </div>
            )}

        </header>
    );
}

export default PageHeader;