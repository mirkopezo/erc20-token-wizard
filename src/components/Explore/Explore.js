import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Typography, AppBar, CssBaseline, Grid, 
  Toolbar, Container } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import Web3 from 'web3';
import SearchIcon from '@material-ui/icons/Search';
import useStyles from 'components/Explore/ExploreStyles';

function Explore() {
  const classes = useStyles();

  const formikExplore = useFormik({
    enableReinitialize: true,
    initialValues: {
      exploreaddress: '',
      explorebalance: '',
    },
    validate: values => {
      const errors = {};
      if(!values.exploreaddress) {
        errors.exploreaddress = 'Required';
      }
      else if(!Web3.utils.isAddress(values.exploreaddress)) {
        errors.exploreaddress = 'Ethereum address is not valid';
      }
      return errors;
    },
    onSubmit: values => {
      const exploreAddress = formikExplore.values.exploreaddress;
      let exploreAddressBalance = localStorage.getItem(exploreAddress);
      if (exploreAddressBalance == null) {
        localStorage.setItem(exploreAddress,'0');
        exploreAddressBalance = '0';
      }
      formikExplore.setFieldValue('explorebalance', exploreAddressBalance);
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
        </Toolbar>
      </AppBar>
      <main>
        <div>
          <Container maxWidth="sm" className={classes.container}>
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
                    id="exploreaddress" 
                    label="Address to explore"
                    name="exploreaddress" 
                    variant="outlined"
                    onChange={formikExplore.handleChange}
                    value={formikExplore.values.exploreaddress}
                    error={formikExplore.errors.exploreaddress}
                    helperText={formikExplore.errors.exploreaddress}
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
                  Balance of this address is: {formikExplore.values.explorebalance}
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