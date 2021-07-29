import React from 'react';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import useStyles from 'components/Transfer/TransferStyles';
import Web3 from 'web3';
import { DialogTitle, DialogContent } from 'components/DialogTitleContent/DialogTitleContent';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { checkForAddressInStorage } from 'lib/checkForAddressInStorage';
import { inputTransaction } from 'lib/inputTransaction';
import { outputTransaction } from 'lib/outputTransaction';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Transfer() {
    const classes = useStyles();

    const [openSnack, setOpenSnack] = React.useState(false);
    const handleClickSnack = () => {
        setOpenSnack(true);
    };
    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false);
    };

    const [openTransfer, setOpenTransfer] = React.useState(false);
    const handleClickOpenTransfer = () => {
        setOpenTransfer(true);
    };
    const handleCloseTransfer = () => {
        setOpenTransfer(false);
    };

    const formikTransfer = useFormik({
        initialValues: {
        transferValue: '',
        transferAddress: '',
        },
        validate: values => {
        const walletAddress = Cookies.get("wallet");
        const sender = JSON.parse(localStorage.getItem(walletAddress));
        const balanceSender = sender.balance;
        const errors = {};
        const regExp = /^\d*(\.)?(\d{0,8})?$/
        if(!values.transferAddress){
            errors.transferAddress = 'Required';
        }
        else if(!Web3.utils.isAddress(values.transferAddress)) {
            errors.transferAddress = 'Ethereum address is not valid';
        }
        else if(walletAddress === values.transferAddress) {
            errors.transferAddress = 'You can\'t send tokens to yourself';
        }
        if(!values.transferValue) {
            errors.transferValue = 'Required';
        }
        else if(isNaN(values.transferValue)) {
            errors.transferValue = 'You must enter a number';
        }
        else if(values.transferValue <= 0 || values.transferValue === '-0') {
            errors.transferValue = 'You must enter a number greater than zero';
        }
        else if(!regExp.test(values.transferValue)) {
            errors.transferValue = 'You can\'t have more than 8 decimals';
        }
        else if(parseFloat(values.transferValue) > parseFloat(balanceSender)) {
            errors.transferValue = 'You can\'t transfer more than you have';
        }
        return errors;
        },
        onSubmit: values => {
        const walletAddress = Cookies.get("wallet");
        const recipientAddress = formikTransfer.values.transferAddress;
        const transferValue = formikTransfer.values.transferValue;
        checkForAddressInStorage(recipientAddress);
        outputTransaction(walletAddress, recipientAddress, transferValue);
        inputTransaction(walletAddress, recipientAddress, transferValue);
        handleClickSnack();
        }
    });  
    return(
        <>
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
                                    id="transferAddress" 
                                    label="Recipient address"
                                    name="transferAddress" 
                                    variant="outlined"
                                    onChange={formikTransfer.handleChange}
                                    value={formikTransfer.values.transferAddress}
                                    error={formikTransfer.errors.transferAddress}
                                    helperText={formikTransfer.errors.transferAddress}
                                    InputProps={{ className: classes.input }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField 
                                    id="transferValue" 
                                    label="Amount to transfer"
                                    name="transferValue" 
                                    variant="outlined"
                                    onChange={formikTransfer.handleChange}
                                    value={formikTransfer.values.transferValue}
                                    error={formikTransfer.errors.transferValue}
                                    helperText={formikTransfer.errors.transferValue}
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
            <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    Transfer was successfully executed!
                </Alert>
            </Snackbar>
        </>
    );
}

export default Transfer;