import React, { useState, useEffect } from 'react';
import { Switch } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import SignIn from 'pages/SignIn/SignIn';
import Dashboard from 'pages/Dashboard/Dashboard';
import Explore from 'pages/Explore/Explore';
import CreateToken from 'pages/CreateToken/CreateToken';
import AuthApi from 'components/AuthApi/AuthApi';
import ProtectedRoute from 'components/ProtectedRoute/ProtectedRoute';
import ProtectedLogin from 'components/ProtectedLogin/ProtectedLogin';

function Routes() {
  const Auth = React.useContext(AuthApi);
  const { account } = useEthers();
  const defaultToken = '0xeBF40Bb17E0Ed39c58c9041618F70b3BE1Dd3D55';
  const defaultTokenSymbol = 'CIT';
  const [pickedToken, setPickedToken] = useState(defaultToken);
  const [pickedTokenSymbol, setPickedTokenSymbol] = useState(defaultTokenSymbol);

  useEffect(() => {
    const tokenFromStorage = JSON.parse(localStorage.getItem(account));
    const pickedTokenInStorage = (tokenFromStorage === null) ? null : tokenFromStorage.contract;
    const pickedTokenSymbolInStorage = (tokenFromStorage === null) ? null : tokenFromStorage.symbol;
    setPickedToken(pickedTokenInStorage || defaultToken);
    setPickedTokenSymbol(pickedTokenSymbolInStorage || defaultTokenSymbol);
  }, [account])

  return(
    <Switch>
      <ProtectedLogin exact path='/' auth={Auth.auth} component={SignIn} />
      <ProtectedRoute path='/dashboard' auth={Auth.auth} pickedToken={pickedToken} setPickedToken={setPickedToken} 
        pickedTokenSymbol={pickedTokenSymbol} setPickedTokenSymbol={setPickedTokenSymbol} component={Dashboard} />
      <ProtectedRoute path='/explore' auth={Auth.auth} pickedToken={pickedToken} setPickedToken={setPickedToken}
        pickedTokenSymbol={pickedTokenSymbol} setPickedTokenSymbol={setPickedTokenSymbol} component={Explore} />
      <ProtectedRoute path='/create-token' auth={Auth.auth} setPickedToken={setPickedToken}
        setPickedTokenSymbol={setPickedTokenSymbol} component={CreateToken} />
    </Switch>
  )
}

export default Routes;