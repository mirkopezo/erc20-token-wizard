import React from 'react';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Typography, Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import useStyles from 'components/Mint/MintStyles';
import { DialogTitle, DialogContent } from 'components/DialogTitleContent/DialogTitleContent';


function Mint() {
  const classes = useStyles();

  const [openMint, setOpenMint] = React.useState(false);
  const handleClickOpenMint = () => {
    setOpenMint(true);
  };
  const handleCloseMint = () => {
    setOpenMint(false);
  };

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
      else if(values.mintvalue < 0 || values.mintvalue === '-0') {
        errors.mintvalue = 'You must enter a positive number';
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

  return(
    <>
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
    </>
  );
}

export default Mint;