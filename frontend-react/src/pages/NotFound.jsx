import { Link } from "react-router-dom";

import "../styles/pages/not-found.css";

function NotFound() {
  return (
    <main className="not-found-page">
      <p className="not-found-page__code">404</p>
      <h1>Page not found</h1>
      <p>
        The page you requested does not exist or may have moved.
      </p>
      <Link to="/">Browse roadmaps</Link>
    </main>
  );
}

export default NotFound;
