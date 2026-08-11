import {
    FaBookOpen,
    FaYoutube,
    FaGithub,
    FaGraduationCap,
    FaNewspaper,
    FaLaptopCode,
    FaDownload,
    FaLink,
} from "react-icons/fa6";

function getResourceIcon(type) {

    switch (type) {

        case "docs":
            return <FaBookOpen />;

        case "youtube":
            return <FaYoutube />;

        case "github":
            return <FaGithub />;

        case "course":
            return <FaGraduationCap />;

        case "article":
            return <FaNewspaper />;

        case "playground":
            return <FaLaptopCode />;

        case "download":
            return <FaDownload />;

        default:
            return <FaLink />;

    }

}

function StepResources({ resources = [] }) {

    if (!resources.length) {
        return null;
    }

    return (

        <div className="step-resources">

            <div className="step-resources__label">
             Resources
            </div>

            <div className="step-resources__list">

                {resources.map((resource, index) => (

                    <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="step-resource"
                        title={resource.title}
                    >

                        <span
                            className={`step-resource__icon type-${resource.type}`}
                            >
                            {getResourceIcon(resource.type)}
                        </span>

                        <span className="step-resource__title">
                            {resource.title}
                        </span>

                    </a>

                ))}

            </div>

        </div>

    );

}

export default StepResources;
