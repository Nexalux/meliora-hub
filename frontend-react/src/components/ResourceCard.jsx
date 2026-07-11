import { FaExternalLinkAlt } from "react-icons/fa";

function ResourceCard({

    icon,
    title,
    url

}) {

    if (!url) return null;

    return (

        <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="resource-card"
        >

            <div className="resource-left">

                {icon}

                <span>{title}</span>

            </div>

            <FaExternalLinkAlt />

        </a>

    );

}

export default ResourceCard;