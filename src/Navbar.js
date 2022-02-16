import React from "react";
import { Link } from "react-router-dom";

function Logout() {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
}

export default function Navbar(props) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a href="#" className="navbar-brand">
            Loundree
          </a>

          {/* button toogler */}
          <button
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#myNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* define menu */}
          <div className="collapse navbar-collapse" id="myNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/member" className="nav-link">
                  Member
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/transaksi" className="nav-link">
                  Transaksi
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/paket" className="nav-link">
                  Paket
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/users" className="nav-link">
                  Users
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/form-transaksi" className="nav-link">
                  Transaksi baru
                </Link>
              </li>
                <button className="btn btn-outline-light btn-md">
                  <Link to="/login" className="btn-link" onClick={() => Logout()}>Logout</Link>
                </button> 
            </ul>
          </div>
        </div>
      </nav>
      {props.children}
    </div>
  );
}
