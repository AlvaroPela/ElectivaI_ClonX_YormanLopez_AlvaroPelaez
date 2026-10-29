import { Link, NavLink } from "react-router-dom";

export const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Blog App</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Feed</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about-us">About us</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/support">Need support?</NavLink>
            </li>
          </ul>

          <Link className="btn btn-outline-success" to="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
};