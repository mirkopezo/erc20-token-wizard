import React from 'react';
import Cookies from 'js-cookie';
import AuthApi from './AuthApi';
import { Link } from "react-router-dom";

function Dashboard() {
  const Auth = React.useContext(AuthApi);
  const readCookie = () => {
    const user = Cookies.get("wallet");
    console.log(user);
  }
  React.useEffect(() => {
    readCookie();
  }, [])
  const handleOnClick = () => {
    Auth.setAuth(false);
    Cookies.remove("wallet");
  }
  return (
    <div>
        <h1>Dashboard</h1>
        <Link to='/explore'>Explore</Link>
        <button onClick={handleOnClick}>Logout</button>
    </div>
  );
}

export default Dashboard;