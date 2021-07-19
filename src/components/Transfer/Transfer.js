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

function Transfer() {
    const classes = useStyles();

    const [openTransfer, setOpenTransfer] = React.useState(false);
    const handleClickOpenTransfer = () => {
        setOpenTransfer(true);
    };
    const handleCloseTransfer = () => {
        setOpenTransfer(false);
    };
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
        else if(values.trasnfervalue < 0 || values.transfervalue === '-0') {
            errors.mintvalue = 'You must enter a positive number';
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
        </>
    );
}

export default Transfer;