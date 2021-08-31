import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Typography, Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import GavelOutlinedIcon from '@material-ui/icons/GavelOutlined';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useFormik } from 'formik';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts'
import { useContractFunction, useEthers } from '@usedapp/core';
import useStyles from 'components/Mint/MintStyles';
import { DialogTitle, DialogContent } from 'components/DialogTitleContent/DialogTitleContent';
import ReadBalance from 'components/ReadBalance/ReadBalance';
import Alert from 'components/Alert/Alert';

function Mint(props) {
  const classes = useStyles();
  const [openInfoSnack, setOpenInfoSnack] = useState(false);
  const [openSuccessSnack, setOpenSuccessSnack] = useState(false);
  const [openMint, setOpenMint] = useState(false);
  const [disabledInput, setDisabledInput] = useState(false);

  const { account } = useEthers();
  const { pickedToken, pickedTokenSymbol } = props;
  const tokenInterface = new utils.Interface(['function mint(uint amount) external']);
  const tokenContractAddress = pickedToken;
  const contract = new Contract(tokenContractAddress, tokenInterface);
  const { send, state } = useContractFunction(contract, 'mint', { transactionName: 'Mint'});

  const handleClickInfoSnack = () => {
    setOpenInfoSnack(true);
  };
  const handleCloseInfoSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenInfoSnack(false);
  };
  const handleClickSuccessSnack = () => {
    setOpenSuccessSnack(true);
  };
  const handleCloseSuccessSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessSnack(false);
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
      setDisabledInput(true);
      callMint(mintValue);
    }
  });

  useEffect(() => {
    if (state.status === 'Mining') {
      handleClickInfoSnack();
    }
    else if (state.status === 'Success') {
      handleClickSuccessSnack();
      setDisabledInput(false);
    }
    else {
      setDisabledInput(false);
    }
  }, [state])

  return(
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpenMint} size="large">
        <GavelOutlinedIcon className={classes.minticon} />
        Mint
      </Button>
      <Dialog onClose={handleCloseMint} open={openMint} >
        <DialogTitle onClose={handleCloseMint} align="center">
          Mint
        </DialogTitle>
        <DialogContent dividers className={classes.dialogcontent}>
          <Typography variant="h6" color="textPrimary" className={classes.text}>
            Wallet balance: <ReadBalance address={account} pickedToken={pickedToken} pickedTokenSymbol={pickedTokenSymbol} />
          </Typography>
          <form onSubmit={formikMint.handleSubmit}  >
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
                  disabled={disabledInput}
                />
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained" color="secondary" disabled={!account || disabledInput} className={classes.button}>
                  {disabledInput !== true ? <>Mint</> :
									<CircularProgress color='inherit' />}
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar open={openInfoSnack} autoHideDuration={6000} onClose={handleCloseInfoSnack}>
        <Alert onClose={handleCloseInfoSnack} severity="info">
          Mint transaction is submitted!
        </Alert>
      </Snackbar>
      <Snackbar open={openSuccessSnack} autoHideDuration={6000} onClose={handleCloseSuccessSnack}>
        <Alert onClose={handleCloseSuccessSnack} severity="success">
          Mint was successfully executed!
        </Alert>
      </Snackbar>
    </>
  );
}

export default Mint;