import React from "react";
import { NavLink } from "react-router-dom";

function Header(){
    return(
        <nav>
            <NavLink exact activeClassName="active" to="./pages/Member.js">
                Member
            </NavLink>

            <NavLink exact activeClassName="active" to="./pages/Paket">
                Member
            </NavLink>
        </nav>
    )
}

export default Header