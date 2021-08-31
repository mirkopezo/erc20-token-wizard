import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function ProtectedLogin(props) {
  const {auth,component:Component,...rest} = props;
  return(
    <Route
      {...rest}
      render = {()=> !auth ? (
        <Component />
      ):
        <Redirect to='/dashboard' />
      }
    />
  );
}

export default ProtectedLogin;