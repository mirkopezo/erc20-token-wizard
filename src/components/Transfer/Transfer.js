import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Typography, Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import useStyles from 'components/Transfer/TransferStyles';
import Web3 from 'web3';
import SyncAltOutlinedIcon from '@material-ui/icons/SyncAltOutlined';
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

function Transfer() {
    const classes = useStyles();
    const [openInfoSnack, setOpenInfoSnack] = React.useState(false);
    const [openSuccessSnack, setOpenSuccessSnack] = React.useState(false);
    const [openTransfer, setOpenTransfer] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);

    const { account } = useEthers();
    const citInterface = new utils.Interface(['function transfer(address recipient, uint256 amount) public virtual override returns (bool)']);
    const citContractAddress = '0xd2539E040A79D9597310D96aD17C96518168A63F';
    const contract = new Contract(citContractAddress, citInterface);
    const { send, state } = useContractFunction(contract, 'transfer', { transactionName: 'Transfer'});

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
    const handleClickOpenTransfer = () => {
        setOpenTransfer(true);
    };
    const handleCloseTransfer = () => {
        setOpenTransfer(false);
    };
    const CallTransfer = (transferAddress, transferValue) => {
        send(transferAddress, transferValue);
    }

    const formikTransfer = useFormik({
        initialValues: {
        transferValue: '',
        transferAddress: '',
        },
        validate: values => {
        const errors = {};
        const regExp = /^\d*(\.)?(\d{0,8})?$/
        if(!values.transferAddress){
            errors.transferAddress = 'Required';
        }
        else if(!Web3.utils.isAddress(values.transferAddress)) {
            errors.transferAddress = 'Ethereum address is not valid';
        }
        else if(account === values.transferAddress) {
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
        return errors;
        },
        onSubmit: values => {
        const recipientAddress = formikTransfer.values.transferAddress;
        const transferValue = formikTransfer.values.transferValue;
        setDisabled(true);
        CallTransfer(recipientAddress, transferValue*10**8);
        }
    });
    
    useEffect(() => {
        if (state.status === 'Mining') {
            handleClickInfoSnack();
        }
        else if (state.status === 'Success') {
            handleClickSuccessSnack();
            setDisabled(false);
        }
        else {
            setDisabled(false);
        }
    }, [state])
    
    return(
        <>
            <Button variant="contained" color="primary" onClick={handleClickOpenTransfer} size="large">
                <SyncAltOutlinedIcon className={classes.transfericon} />
                Transfer
            </Button>
            <Dialog onClose={handleCloseTransfer} open={openTransfer} maxWidth="md">
                <DialogTitle onClose={handleCloseTransfer} align="center">
                    Transfer
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="h6" color="textPrimary" className={classes.text}>
                        Wallet balance: <ReadBalance address={account} />
                    </Typography>
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
                                    disabled={disabled}
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
                                    disabled={disabled}
                                />
                            </Grid>
                            <Grid item>
                                <Button type="submit" variant="contained" color="secondary" disabled={!account || disabled} className={classes.button}>
                                    Transfer
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
            <Snackbar open={openInfoSnack} autoHideDuration={6000} onClose={handleCloseInfoSnack}>
                <Alert onClose={handleCloseInfoSnack} severity="info">
                    Transfer transaction is submitted!
                </Alert>
            </Snackbar>
            <Snackbar open={openSuccessSnack} autoHideDuration={6000} onClose={handleCloseSuccessSnack}>
                <Alert onClose={handleCloseSuccessSnack} severity="success">
                    Transfer was successfully executed!
                </Alert>
            </Snackbar>
        </>
    );
}

export default Transfer;