import React from 'react';
import Button from '@material-ui/core/Button';
import { Typography, AppBar, CssBaseline, Grid, Tooltip, 
  Toolbar, Container, IconButton } from '@material-ui/core';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Cookies from 'js-cookie';
import AuthApi from 'components/AuthApi/AuthApi';
import { Link } from "react-router-dom";
import useStyles from 'pages/Dashboard/DashboardStyles';
import Mint from 'components/Mint/Mint';
import Transfer from 'components/Transfer/Transfer';

function Dashboard() {
  const classes = useStyles();

  const Auth = React.useContext(AuthApi);

  const handleOnClick = () => {
    Auth.setAuth(false);
    Cookies.remove("wallet");
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <DesktopMacIcon className={classes.icon} />
          <Typography variant="h6">
            Dashboard
          </Typography>
          <Tooltip title="Disconnect wallet">
            <IconButton onClick={handleOnClick} className={classes.logout}>
              <ExitToAppIcon fontSize='large' color='action' />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <main>
        <div>
          <Container maxWidth="sm" className={classes.container}>
            <Typography variant="h3" align="center" color="textPrimary" gutterBottom>
              Blockchain explorer
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Pick one of 3 options
            </Typography>
            <div className={classes.buttons}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item>
                  <Button variant="contained" color="primary" component={Link} to="/explore" size="large">
                    Explore
                  </Button>
                </Grid>
                <Grid item>
                  <Mint />
                </Grid>
                <Grid item>
                  <Transfer />
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
      </main>
    </>
  );
}

export default Dashboard;