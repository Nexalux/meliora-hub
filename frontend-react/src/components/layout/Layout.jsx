import {
  Link,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import "../../styles/components/layout.css";

function Layout() {

  const { user, logout } = useAuth();

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">

          {/* Logo */}

          <Link
            to="/"
            className="logo"
          >
            Meliora Hub
          </Link>

          {/* Right Side */}

          <div className="nav-right">

            {!user ? (

              <Link
                to="/login"
                className="nav-login"
              >
                Login
              </Link>

            ) : (

              <div className="nav-user">
                <span className="nav-username">

                  👤 {user.name}

                </span>

                <button
                  onClick={logout}
                  className="logout-btn"
                >
                  Logout
                </button>

              </div>

            )}

          </div>
        </div>
      </nav>

      <main className="main-content">

        <Outlet />

      </main>

    </>
  );

}

export default Layout;