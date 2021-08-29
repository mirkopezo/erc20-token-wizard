import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute(props) {
  const {auth,pickedToken,setPickedToken,pickedTokenSymbol,setPickedTokenSymbol,component:Component,...rest} = props;
  return(
    <Route
      {...rest}
      render = {()=> auth ? (
        <Component pickedToken={pickedToken} setPickedToken={setPickedToken} 
          pickedTokenSymbol={pickedTokenSymbol} setPickedTokenSymbol={setPickedTokenSymbol} />
      ):
        <Redirect to='/' />
      }
    />
  )
}

export default ProtectedRoute;