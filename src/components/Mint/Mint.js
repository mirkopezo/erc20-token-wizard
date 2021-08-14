import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Typography, Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import GavelOutlinedIcon from '@material-ui/icons/GavelOutlined';
import useStyles from 'components/Mint/MintStyles';
import { DialogTitle, DialogContent } from 'components/DialogTitleContent/DialogTitleContent';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts'
import { useContractFunction, useEthers } from '@usedapp/core';
import ReadBalance from 'components/ReadBalance/ReadBalance';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Mint() {
  const classes = useStyles();
  const [openSnack, setOpenSnack] = React.useState(false);
  const [openMint, setOpenMint] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  const { account } = useEthers();
  const citInterface = new utils.Interface(['function mint(uint amount) external']);
  const citContractAddress = '0xd2539E040A79D9597310D96aD17C96518168A63F';
  const contract = new Contract(citContractAddress, citInterface);
  const { send, state } = useContractFunction(contract, 'mint', { transactionName: 'Mint'});

  const handleClickSnack = () => {
    setOpenSnack(true);
  };
  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };
  const handleClickOpenMint = () => {
    setOpenMint(true);
  };
  const handleCloseMint = () => {
    setOpenMint(false);
  };
  const callMint = (mintAmount) => {
    send(mintAmount*10**8);
  }

  const formikMint = useFormik({
    enableReinitialize: true,
    initialValues: {
      mintValue: '',
    },
    validate: values => {
      const errors = {};
      const regExp = /^\d*(\.)?(\d{0,8})?$/
      if(!values.mintValue) {
        errors.mintValue = 'Required';
      }
      else if(isNaN(values.mintValue)) {
        errors.mintValue = 'You must enter a number';
      }
      else if(values.mintValue <= 0 || values.mintValue === '-0') {
        errors.mintValue = 'You must enter a number greater than zero';
      }
      else if(!regExp.test(values.mintValue)) {
        errors.mintValue = 'You can\'t have more than 8 decimals';
      }
      return errors;
    },
    onSubmit: values => {
      const mintValue = formikMint.values.mintValue;
      setDisabled(true);
      callMint(mintValue);
    }
  });

  useEffect(() => {
    if (state.status !== 'Mining') {
      setDisabled(false);
    }
    else handleClickSnack();
  }, [state])

  return(
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpenMint} size="large">
        <GavelOutlinedIcon className={classes.minticon} />
        Mint
      </Button>
      <Dialog onClose={handleCloseMint} open={openMint}>
        <DialogTitle onClose={handleCloseMint} align="center">
          Mint
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" color="textPrimary" className={classes.text}>
            Wallet balance: <ReadBalance address={account} />
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
                  id="mintValue" 
                  label="Amount to mint"
                  name="mintValue" 
                  variant="outlined"
                  onChange={formikMint.handleChange}
                  value={formikMint.values.mintValue}
                  error={formikMint.errors.mintValue}
                  helperText={formikMint.errors.mintValue}
                  InputProps={{ className: classes.input }}
                  disabled={disabled}
                />
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained" color="secondary" disabled={!account || disabled} className={classes.button}>
                  Mint
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="success">
          Mint was successfully submitted!
        </Alert>
      </Snackbar>
    </>
  );
}

export default Mint;