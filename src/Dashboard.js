import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Typography, AppBar, CssBaseline, Grid, Tooltip, 
  Toolbar, Container, IconButton } from '@material-ui/core';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Cookies from 'js-cookie';
import AuthApi from './AuthApi';
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import Web3 from 'web3';
import useStyles from './DashboardStyles';

function Dashboard() {
  const classes = useStyles();

  const Auth = React.useContext(AuthApi);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [openTransfer, setOpenTransfer] = React.useState(false);
  const handleOpenTransfer = () => {
    setOpenTransfer(true);
  };
  const handleCloseTransfer = () => {
    setOpenTransfer(false);
  };

  const handleOnClick = () => {
    Auth.setAuth(false);
    Cookies.remove("wallet");
  }

  const formikMint = useFormik({
    enableReinitialize: true,
    initialValues: {
      mintvalue: '',
      balance: localStorage.getItem(Cookies.get("wallet")),
    },
    validate: values => {
      const errors = {};
      if(!values.mintvalue) {
        errors.mintvalue = 'Required';
      }
      else if(isNaN(values.mintvalue)) {
        errors.mintvalue = 'You must enter a number';
      }
      return errors;
    },
    onSubmit: values => {
      const wallet = Cookies.get("wallet");
      const mintvalue = formikMint.values.mintvalue;
      const balance = localStorage.getItem(wallet);
      const result = JSON.stringify(parseInt(balance) + parseInt(mintvalue));
      formikMint.setFieldValue('balance', result);
      localStorage.setItem(wallet, result);
    }
  });

  const formikTransfer = useFormik({
    initialValues: {
      transfervalue: '',
      transferaddress: '',
      balance: localStorage.getItem(Cookies.get("wallet")),
    },
    validate: values => {
      const wallet = Cookies.get("wallet");
      const balance = localStorage.getItem(wallet);
      const errors = {};
      if(!values.transferaddress){
        errors.transferaddress = 'Required';
      }
      else if(!Web3.utils.isAddress(values.transferaddress)) {
        errors.transferaddress = 'Ethereum address is not valid';
      }
      if(!values.transfervalue) {
        errors.transfervalue = 'Required';
      }
      else if(isNaN(values.transfervalue)) {
        errors.transfervalue = 'You must enter a number';
      }
      else if(parseInt(values.transfervalue) > parseInt(balance)) {
        errors.transfervalue = 'You can\'t transfer more than you have';
      }
      return errors;
    },
    onSubmit: values => {
      const sender = Cookies.get("wallet");
      const recipient = formikTransfer.values.transferaddress;
      const transfervalue = formikTransfer.values.transfervalue;
      const balanceSender = localStorage.getItem(sender);
      let balanceRecipient = localStorage.getItem(recipient);
      if (balanceRecipient == null) {
        localStorage.setItem(recipient,'0');
        balanceRecipient = '0';
      }
      const newBalanceSender = JSON.stringify(parseInt(balanceSender) - parseInt(transfervalue));
      const newBalanceRecipient = JSON.stringify(parseInt(balanceRecipient) + parseInt(transfervalue));
      formikTransfer.setFieldValue('balance', newBalanceSender);
      localStorage.setItem(sender, newBalanceSender);
      localStorage.setItem(recipient, newBalanceRecipient);
    }
  });  

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
                  <Button variant="contained" color="primary" onClick={handleOpen} size="large">
                    Mint
                  </Button>
                  <Modal
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <Fade in={open}>
                      <div className={classes.paper}>
                        <Typography variant="h6" color="textPrimary" className={classes.text}>
                          Wallet balance: {formikMint.values.balance}
                        </Typography>
                        <form onSubmit={formikMint.handleSubmit}>
                          <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="flex-start"
                            spacing={1}
                          >
                            <Grid item>
                              <TextField 
                                id="mintvalue" 
                                label="Amount to mint"
                                name="mintvalue" 
                                variant="outlined"
                                onChange={formikMint.handleChange}
                                value={formikMint.values.mintvalue}
                                error={formikMint.errors.mintvalue}
                                helperText={formikMint.errors.mintvalue}
                                InputProps={{ className: classes.input }}
                              />
                            </Grid>
                            <Grid item>
                              <Button type="submit" variant="contained" color="secondary" className={classes.button}>
                                Mint
                              </Button>
                            </Grid>
                          </Grid>
                        </form>
                      </div>
                    </Fade>
                  </Modal>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleOpenTransfer} size="large">
                    Transfer
                  </Button>
                  <Modal
                    className={classes.modal}
                    open={openTransfer}
                    onClose={handleCloseTransfer}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <Fade in={openTransfer}>
                      <div className={classes.paper}>
                        <form onSubmit={formikTransfer.handleSubmit}>
                          <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="flex-start"
                            spacing={1}
                          >
                            <Grid item>
                              <TextField 
                                id="transferaddress" 
                                label="Recipient address"
                                name="transferaddress" 
                                variant="outlined"
                                onChange={formikTransfer.handleChange}
                                value={formikTransfer.values.transferaddress}
                                error={formikTransfer.errors.transferaddress}
                                helperText={formikTransfer.errors.transferaddress}
                                InputProps={{ className: classes.input }}
                              />
                            </Grid>
                            <Grid item>
                              <TextField 
                                id="transfervalue" 
                                label="Amount to transfer"
                                name="transfervalue" 
                                variant="outlined"
                                onChange={formikTransfer.handleChange}
                                value={formikTransfer.values.transfervalue}
                                error={formikTransfer.errors.transfervalue}
                                helperText={formikTransfer.errors.transfervalue}
                                InputProps={{ className: classes.input }}
                              />
                            </Grid>
                            <Grid item>
                              <Button type="submit" variant="contained" color="secondary" className={classes.button}>
                                Transfer
                              </Button>
                            </Grid>
                          </Grid>
                        </form>
                      </div>
                    </Fade>
                  </Modal>
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