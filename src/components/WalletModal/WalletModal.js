import React from 'react';
import { IconButton, Tooltip, Typography, Link } from '@material-ui/core';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined';
import { DialogTitle, DialogContent } from 'components/DialogTitleContent/DialogTitleContent';
import Dialog from '@material-ui/core/Dialog';
import { useEthers, getExplorerAddressLink } from '@usedapp/core';
import Grid from '@material-ui/core/Grid';

function WalletModal() {
    const [openMint, setOpenMint] = React.useState(false);
    const { account, chainId } = useEthers();

    const handleClickOpenMint = () => {
        setOpenMint(true);
    };
    const handleCloseMint = () => {
        setOpenMint(false);
    };

    return(
        <>
            <Tooltip title="Wallet">
                <IconButton onClick={handleClickOpenMint} >
                    <AccountBalanceWalletOutlinedIcon fontSize='large' style={{fill: 'white'}} />
                </IconButton>
            </Tooltip>
            <Dialog onClose={handleCloseMint} open={openMint} maxWidth="md">
                <DialogTitle onClose={handleCloseMint} align="center" >
                    Account info
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
                            </Link>
                            <LinkOutlinedIcon fontSize='small' />
                        </Typography>
                        {window.isSecureContext && (
                        <Typography variant='subtitle2' gutterBottom >
                            <Link onClick={() => navigator.clipboard.writeText(account)} style={{cursor:'pointer'}} >
                                Copy to clipboard
                            </Link>
                            <FileCopyOutlinedIcon fontSize='small' />
                        </Typography>
                        )}
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default WalletModal;