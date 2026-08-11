import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBookmark,
  FaGaugeHigh,
  FaArrowRightFromBracket,
  FaUser
} from "react-icons/fa6";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/components/user-menu.css";

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {

    function handleClickOutside(event) {

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  return (

    <div
      className="user-menu"
      ref={menuRef}
    >

      <button
  className="user-menu-button"
  onClick={() => setOpen(!open)}
>
  {user.name}

  <span className="menu-arrow">
    ▾
  </span>
</button>

      {open && (

        <div className="user-dropdown">
  <div className="dropdown-header">

  <div className="dropdown-avatar">
    <FaUser />
  </div>

  <div className="dropdown-user">

    <strong>{user.name}</strong>

    <small>{user.email}</small>

  </div>

</div>

<NavLink
  to="/dashboard"
  onClick={() => setOpen(false)}
  className={({ isActive }) =>
    isActive ? "active-menu-link" : ""
  }
>
  <FaGaugeHigh />
  <span>Dashboard</span>
</NavLink>

<NavLink
  to="/bookmarks"
  onClick={() => setOpen(false)}
  className={({ isActive }) =>
    isActive ? "active-menu-link" : ""
  }
>
  <FaBookmark />
  <span>Bookmarks</span>
</NavLink>

<button
  className="dropdown-logout"
  onClick={() => {
    setOpen(false);
    logout();
  }}
>

  <FaArrowRightFromBracket />
  <span>Logout</span>
</button>

        </div>

      )}

    </div>

  );

}

export default UserMenu;