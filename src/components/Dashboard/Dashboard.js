import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Typography, AppBar, CssBaseline, Grid, Tooltip, 
  Toolbar, Container, IconButton } from '@material-ui/core';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Cookies from 'js-cookie';
import AuthApi from 'components/AuthApi/AuthApi';
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import Web3 from 'web3';
import useStyles from 'components/Dashboard/DashboardStyles';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

function Dashboard() {
  const classes = useStyles();

  const Auth = React.useContext(AuthApi);

  const [openMint, setOpenMint] = React.useState(false);
  const handleClickOpenMint = () => {
    setOpenMint(true);
  };
  const handleCloseMint = () => {
    setOpenMint(false);
  };

  const [openTransfer, setOpenTransfer] = React.useState(false);
  const handleClickOpenTransfer = () => {
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
      const regExp = /^\d*(\.)?(\d{0,8})?$/
      if(!values.mintvalue) {
        errors.mintvalue = 'Required';
      }
      else if(isNaN(values.mintvalue)) {
        errors.mintvalue = 'You must enter a number';
      }
      else if(!regExp.test(values.mintvalue)) {
        errors.mintvalue = 'You can\'t have more than 8 decimals';
      }
      return errors;
    },
    onSubmit: values => {
      const wallet = Cookies.get("wallet");
      const mintvalue = formikMint.values.mintvalue;
      const balance = localStorage.getItem(wallet);
      const result = (parseFloat(balance) + parseFloat(mintvalue)).toFixed(8);
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
      const regExp = /^\d*(\.)?(\d{0,8})?$/
      if(!values.transferaddress){
        errors.transferaddress = 'Required';
      }
      else if(!Web3.utils.isAddress(values.transferaddress)) {
        errors.transferaddress = 'Ethereum address is not valid';
      }
      else if(wallet === values.transferaddress) {
        errors.transferaddress = 'You can\'t send tokens to yourself';
      }
      if(!values.transfervalue) {
        errors.transfervalue = 'Required';
      }
      else if(isNaN(values.transfervalue)) {
        errors.transfervalue = 'You must enter a number';
      }
      else if(!regExp.test(values.transfervalue)) {
        errors.transfervalue = 'You can\'t have more than 8 decimals';
      }
      else if(parseFloat(values.transfervalue) > parseFloat(balance)) {
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
      const newBalanceSender = (parseFloat(balanceSender) - parseFloat(transfervalue)).toFixed(8);
      const newBalanceRecipient = (parseFloat(balanceRecipient) + parseFloat(transfervalue)).toFixed(8);
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
                  <Button variant="contained" color="primary" onClick={handleClickOpenMint} size="large">
                    Mint
                  </Button>
                  <Dialog onClose={handleCloseMint} open={openMint}>
                    <DialogTitle onClose={handleCloseMint} align="center">
                      Mint
                    </DialogTitle>
                    <DialogContent dividers>
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
                    </DialogContent>
                  </Dialog>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleClickOpenTransfer} size="large">
                    Transfer
                  </Button>
                  <Dialog onClose={handleCloseTransfer} open={openTransfer} maxWidth="md">
                    <DialogTitle onClose={handleCloseTransfer} align="center">
                      Transfer
                    </DialogTitle>
                    <DialogContent dividers>
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
                    </DialogContent>
                  </Dialog>
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