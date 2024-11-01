import React from "react";
import { Link } from "react-router-dom";

const Admin = () => {
    // check for admin authentication
    // if not authenticated, restrict the user from accessing the page
    // first check user agent
    // then check for admin authentication

    return (
        <div>
        <h1>Admin Page</h1>
        <Link to="/">Back to Home</Link>
        </div>
    );
    }

export default Admin;