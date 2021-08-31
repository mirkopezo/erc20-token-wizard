import React, { useState } from 'react';
import { Typography, Link, Grid } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { DialogTitle, DialogContent } from 'components/DialogTitleContent/DialogTitleContent';
import Dialog from '@material-ui/core/Dialog';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import PropTypes from 'prop-types';
import firebase from 'firebaseConfig';
import { useEthers } from '@usedapp/core';
import useStyles from 'components/PickTokenDialog/PickTokenDialogStyles';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Snackbar from '@material-ui/core/Snackbar';

function PickTokenDialog(props) {
    const classes = useStyles();
    const [openSnack, setOpenSnack] = useState(false);
    const { account } = useEthers();
    const { onClose, selectedToken, selectedTokenSymbol, open, defaultToken, defaultTokenSymbol } = props;
    var contractsArray = [];
  
    const handleClose = () => {
      onClose(selectedTokenSymbol, selectedToken);
      handleCloseSnack();
    };
    const handleListItemClick = (symbol, contract) => {
      onClose(symbol, contract);
    };

    const handleClickSnack = (contract) => {
      setOpenSnack(true);
      navigator.clipboard.writeText(contract);
    };
    const handleCloseSnack = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenSnack(false);
    };
    
    firebase.database().ref().child(account || '0').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data != null) {
        const dataArray = Object.entries(data);
        contractsArray = dataArray;
      }
      else {
        contractsArray = [];
      }
    });
  
    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle onClose={handleClose} align='center' >
          Pick a token
        </DialogTitle>
        <DialogContent dividers>
            <List>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <ListItem button onClick={() => handleListItemClick(defaultTokenSymbol, defaultToken)} key={defaultToken} className={classes.token} divider>
                    <ListItemAvatar>
                      <Avatar alt={defaultTokenSymbol} src='.' style={{color: '#fff', backgroundColor: '#303f9f'}} />
                    </ListItemAvatar>
                    <ListItemText primary={defaultTokenSymbol} />
                  </ListItem>
                </Grid>
                <Grid item>
                <Typography variant='caption' gutterBottom>
                  <Link onClick={() => handleClickSnack(defaultToken)} className={classes.copybutton} >
                      Copy address
                      <FileCopyOutlinedIcon fontSize='small' />
                  </Link>
                </Typography>
                </Grid>
              </Grid>
              {contractsArray.map(([symbol, contract]) => (
                  <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  >
                    <Grid item>
                      <ListItem button onClick={() => handleListItemClick(symbol, contract)} key={contract} className={classes.token} divider>
                        <ListItemAvatar>
                          <Avatar alt={symbol} src='.' style={{color: '#fff', backgroundColor: '#303f9f'}} />
                        </ListItemAvatar>
                        <ListItemText primary={symbol} />
                      </ListItem>
                    </Grid>
                    <Grid item>
                      <Typography variant='caption' gutterBottom>
                        <Link onClick={() => handleClickSnack(contract)} className={classes.copybutton} >
                            Copy address
                            <FileCopyOutlinedIcon fontSize='small' />
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
              ))}
            </List>
        </DialogContent>
        <Snackbar open={openSnack} autoHideDuration={2000} onClose={handleCloseSnack} message="Copied to clipboard" />
      </Dialog>
      
    );
}
    
PickTokenDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedToken: PropTypes.string.isRequired,
};

export default PickTokenDialog;