import React from 'react';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Typography, AppBar, CssBaseline, Grid, 
  Toolbar, Container } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import SearchIcon from '@material-ui/icons/Search';
import  { Breakpoint } from 'react-socks';
import { useEthers } from '@usedapp/core';
import Web3 from 'web3';
import { useFormik } from 'formik';
import firebase from 'firebaseConfig';
import useStyles from 'pages/Explore/ExploreStyles';
import DisconnectButton from 'components/DisconnectButton/DisconnectButton';
import WalletModal from 'components/WalletModal/WalletModal';
import AuthApi from 'components/AuthApi/AuthApi';
import PickToken from 'components/PickToken/PickToken';
import ExploreTable from 'components/ExploreTable/ExploreTable';

function Explore(props) {
  const classes = useStyles();
  const Auth = React.useContext(AuthApi);
  const { setPickedToken, setPickedTokenSymbol } = props;
  const { account } = useEthers();

  var contractsArray = [];
  const defaultToken = '0xeBF40Bb17E0Ed39c58c9041618F70b3BE1Dd3D55';
  const defaultTokenSymbol = 'CIT';

  const formikExplore = useFormik({
    enableReinitialize: true,
    initialValues: {
      exploreAddress: '',
      exploreBalance: '',
      addressForTable: '',
    },
    validate: values => {
      const errors = {};
      if(!values.exploreAddress) {
        errors.exploreAddress = 'Required';
      }
      else if(!Web3.utils.isAddress(values.exploreAddress)) {
        errors.exploreAddress = 'Ethereum address is not valid';
      }
      return errors;
    },
    onSubmit: values => {
      const exploreAddress = formikExplore.values.exploreAddress;
      formikExplore.setFieldValue('exploreBalance', '');
      formikExplore.setFieldValue('addressForTable', exploreAddress);
    }
  });

  firebase.database().ref().child(account || '0').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data != null) {
      const dataArray = Object.entries(data);
      contractsArray = dataArray;
    }
    else {
      contractsArray = [];
    }
  });

  return(
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <SearchIcon className={classes.icon} />
          <Breakpoint customQuery="(min-width: 430px)">
            <Typography variant="h6">
              Explore
            </Typography>
          </Breakpoint>
          <div className={classes.walletanddisconnect} >
            <PickToken setPickedToken={setPickedToken} setPickedTokenSymbol={setPickedTokenSymbol} />
            <WalletModal />
            <DisconnectButton auth={Auth} />
          </div>
        </Toolbar>
      </AppBar>
      <main>
        <Container maxWidth="md" className={classes.container}>
          <Typography variant="h5" align="center" color="textSecondary" paragraph gutterBottom>
            Enter address to explore
          </Typography>
          <form onSubmit={formikExplore.handleSubmit} className={classes.form}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
              spacing={1}
            >
              <Grid item>
                <TextField 
                  id="exploreAddress" 
                  label="Address to explore"
                  name="exploreAddress" 
                  variant="outlined"
                  onChange={formikExplore.handleChange}
                  value={formikExplore.values.exploreAddress}
                  error={formikExplore.errors.exploreAddress}
                  helperText={formikExplore.errors.exploreAddress}
                  InputProps={{ className: classes.input }}
                />
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained" color="secondary" className={classes.button}>
                  Explore
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
        <Box textAlign="center">
          <Button variant="contained" component={Link} to="/dashboard">
            Back to dashboard
          </Button>
        </Box>
        <div className={classes.table} >
          {formikExplore.values.addressForTable &&
          <ExploreTable addressForTable={formikExplore.values.addressForTable} contractsArray={contractsArray}
            defaultToken={defaultToken} defaultTokenSymbol={defaultTokenSymbol} />}
        </div>
      </main>
    </>
  );
}

export default Explore;