import React from 'react';
import SignIn from './SignIn';
import Dashboard from './Dashboard';
import Explore from './Explore';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import AuthApi from './AuthApi';
import Cookies from 'js-cookie';

function App() {
  const [auth,setAuth] = React.useState(false);
  const readCookie = () => {
    const user = Cookies.get("wallet");
    if(user) {
      setAuth(true);
    }
  }
  React.useEffect(() => {
    readCookie();
  }, [])

  return (
    <div>
      <AuthApi.Provider value={{auth,setAuth}}>
        <Router>
          <Routes />
        </Router>
      </AuthApi.Provider>
    </div>
  );
}

const Routes = () => {
  const Auth = React.useContext(AuthApi);
  return(
    <Switch>
      <ProtectedLogin exact path='/' auth={Auth.auth} component={SignIn} />
      <ProtectedRoute path='/dashboard' auth={Auth.auth} component={Dashboard} />
      <ProtectedRoute path='/explore' auth={Auth.auth} component={Explore} />
    </Switch>
  )
}

const ProtectedRoute = ({auth,component:Component,...rest}) => {
  return(
    <Route
    {...rest}
    render = {()=> auth ? (
      <Component />
    ):
      <Redirect to='/' />
    }
    />
  )
}

const ProtectedLogin = ({auth,component:Component,...rest}) => {
  return(
    <Route
    {...rest}
    render = {()=> !auth ? (
      <Component />
    ):
      <Redirect to='/dashboard' />
    }
    />
  )
}

export default App;
