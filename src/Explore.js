import React from 'react';
import { Link } from "react-router-dom";

function Explore() {
    return(
        <div>
            <h1>This is Explore!</h1>
            <Link to='/dashboard'>Back to dashboard</Link>
        </div>
    );
}

export default Explore;