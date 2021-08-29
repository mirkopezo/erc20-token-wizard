import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import AuthApi from 'components/AuthApi/AuthApi';
import Routes from 'components/Routes/Routes';

function App() {
  const [auth, setAuth] = useState(false);
  const { account } = useEthers();
  
  useEffect(() => {
    if(account != null) {
      setAuth(true);
    }
    else setAuth(false);
  }, [account]);

  return (
    <div style={{overflowX: 'hidden'}}>
      <AuthApi.Provider value={{auth, setAuth}} >
        <Router>
          <Routes />
        </Router>
      </AuthApi.Provider>
    </div>
  );
}

export default App;