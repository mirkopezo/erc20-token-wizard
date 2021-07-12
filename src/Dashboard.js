import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Cookies from 'js-cookie';
import AuthApi from './AuthApi';
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import Web3 from 'web3';

function Dashboard() {
  const Auth = React.useContext(AuthApi);

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
      const newBalanceSender = parseInt(balanceSender) - parseInt(transfervalue);
      const newBalanceRecipient = parseInt(balanceRecipient) + parseInt(transfervalue);
      localStorage.setItem(sender,JSON.stringify(newBalanceSender));
      localStorage.setItem(recipient,JSON.stringify(newBalanceRecipient));
    }
  });  

  return (
    <div>
        <h1>Dashboard</h1><div><button onClick={handleOnClick}>Logout</button></div>
        <div>Wallet balance: {formikMint.values.balance}</div>
        <form onSubmit={formikMint.handleSubmit}>
          <TextField 
            id="mintvalue" 
            label="Amount to mint"
            name="mintvalue" 
            variant="outlined"
            onChange={formikMint.handleChange}
            value={formikMint.values.mintvalue}
            error={formikMint.errors.mintvalue}
            helperText={formikMint.errors.mintvalue}
          />
          <Button type="submit" variant="contained" color="secondary">
            Mint
          </Button>
        </form>

        <form onSubmit={formikTransfer.handleSubmit}>
          <TextField 
            id="transferaddress" 
            label="Recipient address"
            name="transferaddress" 
            variant="outlined"
            onChange={formikTransfer.handleChange}
            value={formikTransfer.values.transferaddress}
            error={formikTransfer.errors.transferaddress}
            helperText={formikTransfer.errors.transferaddress}
          />
          <TextField 
            id="transfervalue" 
            label="Amount to transfer"
            name="transfervalue" 
            variant="outlined"
            onChange={formikTransfer.handleChange}
            value={formikTransfer.values.transfervalue}
            error={formikTransfer.errors.transfervalue}
            helperText={formikTransfer.errors.transfervalue}
          />
          <Button type="submit" variant="contained" color="secondary">
            Transfer
          </Button>
        </form>

        <Link to='/explore'>Explore</Link>
    </div>
  );
}

export default Dashboard;