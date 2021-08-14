import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Typography, AppBar, CssBaseline, Grid, 
  Toolbar, Container } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import DisconnectButton from 'components/DisconnectButton/DisconnectButton';
import WalletModal from 'components/WalletModal/WalletModal';
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import AuthApi from 'components/AuthApi/AuthApi';
import Web3 from 'web3';
import SearchIcon from '@material-ui/icons/Search';
import useStyles from 'pages/Explore/ExploreStyles';
import ReadBalance from 'components/ReadBalance/ReadBalance';

function Explore() {
  const classes = useStyles();
  const Auth = React.useContext(AuthApi);

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

  return(
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <SearchIcon className={classes.icon} />
          <Typography variant="h6">
            Explore
          </Typography>
          <div className={classes.walletanddisconnect} >
            <WalletModal />
            <DisconnectButton auth={Auth} />
          </div>
        </Toolbar>
      </AppBar>
      <main>
        <div>
          <Container maxWidth="md" className={classes.container}>
            <form onSubmit={formikExplore.handleSubmit}>
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
              <Typography variant="h6" color="textPrimary" align="center" className={classes.text}>
                  {formikExplore.values.addressForTable && <ReadBalance address={formikExplore.values.addressForTable} text={'Balance of this address is: '}/>}
              </Typography>
            </form>
          </Container>
        </div>
      </main>
      <Box textAlign="center">
        <Button variant="contained" component={Link} to="/dashboard">
          Back to dashboard
        </Button>
      </Box>
    </>
  );
}

export default Explore;