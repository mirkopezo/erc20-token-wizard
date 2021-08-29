import React, { useState } from 'react';
import { IconButton, Tooltip, Typography, Link } from '@material-ui/core';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Dialog from '@material-ui/core/Dialog';
import useStyles from 'components/WalletModal/WalletModalStyle';
import { useEthers, getExplorerAddressLink } from '@usedapp/core';
import { DialogTitle, DialogContent } from 'components/DialogTitleContent/DialogTitleContent';

function WalletModal() {
    const classes = useStyles();
    const [openMint, setOpenMint] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const { account, chainId } = useEthers();

    const handleClickOpenMint = () => {
        setOpenMint(true);
    };
    const handleCloseMint = () => {
        setOpenMint(false);
        handleCloseSnack();
    };
    const handleClickSnack = (address) => {
        setOpenSnack(true);
        navigator.clipboard.writeText(address);
      };
    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnack(false);
    };

    return(
        <>
            <Tooltip title="Wallet">
                <IconButton onClick={handleClickOpenMint} >
                    <AccountBalanceWalletOutlinedIcon fontSize='large' className={classes.icon} />
                </IconButton>
            </Tooltip>
            <Dialog onClose={handleCloseMint} open={openMint} maxWidth="md">
                <DialogTitle onClose={handleCloseMint} align="center" >
                    Wallet info
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant='h6' gutterBottom>
                        Address: {account}
                    </Typography>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant='subtitle2' gutterBottom>
                            <Link href={getExplorerAddressLink(account, chainId)} target="_blank" rel="noopener noreferrer" >
                                Show on Etherscan
                                <LinkOutlinedIcon fontSize='small' />
                            </Link>
                        </Typography>
                        {window.isSecureContext && (
                        <Typography variant='subtitle2' gutterBottom >
                            <Link onClick={() => handleClickSnack(account)} className={classes.copybutton} >
                                Copy to clipboard
                                <FileCopyOutlinedIcon fontSize='small' />
                            </Link>
                        </Typography>
                        )}
                    </Grid>
                </DialogContent>
                <Snackbar open={openSnack} autoHideDuration={2000} onClose={handleCloseSnack} message="Copied to clipboard" />
            </Dialog>
        </>
    );
}

export default WalletModal;