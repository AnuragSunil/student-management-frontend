import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Student Result Management System
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/add_student">
                Add Student
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add_mark">
                Add Mark
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">
                View Students
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
