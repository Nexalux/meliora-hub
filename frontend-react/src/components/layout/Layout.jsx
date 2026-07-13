import { Link } from "react-router-dom";
import "../../styles/components/layout.css";

function Layout({ children }) {
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            Meliora Hub
          </Link>

          <div className="nav-links">
            <Link to="/">Roadmaps</Link>
          </div>
        </div>
      </nav>

      <main className="main-content">{children}</main>
    </>
  );
}

export default Layout;