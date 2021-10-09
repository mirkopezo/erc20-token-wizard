import React from 'react';
import { Link } from "react-router-dom";
import { Typography, AppBar, CssBaseline, Grid,
  Toolbar, Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import  { Breakpoint } from 'react-socks';
import useStyles from 'pages/Dashboard/DashboardStyles';
import WalletModal from 'components/WalletModal/WalletModal';
import Mint from 'components/Mint/Mint';
import Transfer from 'components/Transfer/Transfer';
import DisconnectButton from 'components/DisconnectButton/DisconnectButton';
import PickToken from 'components/PickToken/PickToken';
import AuthApi from 'components/AuthApi/AuthApi';

function Dashboard(props) {
  const classes = useStyles();
  const Auth = React.useContext(AuthApi);
  const {pickedToken, setPickedToken, pickedTokenSymbol, setPickedTokenSymbol} = props;
  
  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <DesktopMacIcon className={classes.icon} />
          <Breakpoint customQuery="(min-width: 430px)">
            <Typography variant="h6">
              Dashboard
            </Typography>
          </Breakpoint>
          <div className={classes.walletanddisconnect}>
            <PickToken setPickedToken={setPickedToken} setPickedTokenSymbol={setPickedTokenSymbol} />
            <WalletModal />
            <DisconnectButton auth={Auth} />
          </div>
        </Toolbar>
      </AppBar>
      <main>
        <div>
          <Container maxWidth="md" className={classes.container}>
            <Typography variant="h3" align="center" color="textPrimary" gutterBottom>
              ERC20 Token Wizard
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Pick one of 4 options
            </Typography>
            <div className={classes.buttons}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item>
                  <Button variant="contained" color="primary" component={Link} to="/explore" size="large">
                    <SearchOutlinedIcon className={classes.icon} />
                    Explore
                  </Button>
                </Grid>
                <Grid item>
                  <Mint pickedToken={pickedToken} pickedTokenSymbol={pickedTokenSymbol} />
                </Grid>
                <Grid item>
                  <Transfer pickedToken={pickedToken} pickedTokenSymbol={pickedTokenSymbol} />
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" component={Link} to="/create-token" size="large">
                    <CreateOutlinedIcon className={classes.icon} />
                    Create Token
                  </Button>
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