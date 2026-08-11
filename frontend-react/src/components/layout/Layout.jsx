import {
  Link,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import "../../styles/components/navbar.css";
import UserMenu from "../ui/UserMenu";

function Layout() {

 const { user } = useAuth();
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

              <UserMenu />

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