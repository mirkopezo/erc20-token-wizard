import React from 'react';
import Button from '@material-ui/core/Button';
import { Typography, AppBar, CssBaseline, Grid,
  Toolbar, Container } from '@material-ui/core';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import WalletModal from 'components/WalletModal/WalletModal';
import AuthApi from 'components/AuthApi/AuthApi';
import { Link } from "react-router-dom";
import useStyles from 'pages/Dashboard/DashboardStyles';
import Mint from 'components/Mint/Mint';
import Transfer from 'components/Transfer/Transfer';
import DisconnectButton from 'components/DisconnectButton/DisconnectButton';

function Dashboard() {
  const classes = useStyles();
  const Auth = React.useContext(AuthApi);

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <DesktopMacIcon className={classes.icon} />
          <Typography variant="h6">
            Dashboard
          </Typography>
          <div className={classes.walletanddisconnect}>
            <WalletModal />
            <DisconnectButton auth={Auth} />
          </div>
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
                    <SearchOutlinedIcon className={classes.exploreicon} />
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