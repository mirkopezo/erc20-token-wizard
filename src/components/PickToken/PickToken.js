import React, { useState } from 'react';
import { Tooltip, IconButton, Typography } from '@material-ui/core';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import { useEthers } from '@usedapp/core';
import  { Breakpoint } from 'react-socks';
import useStyles from 'components/PickToken/PickTokenStyles';
import PickTokenDialog from 'components/PickTokenDialog/PickTokenDialog';

function PickToken(props) {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const { setPickedToken, setPickedTokenSymbol } = props;

  const { account } = useEthers();
  const defaultToken = '0xeBF40Bb17E0Ed39c58c9041618F70b3BE1Dd3D55';
  const defaultTokenSymbol = 'CIT';
  const tokenFromStorage = JSON.parse(localStorage.getItem(account));
  const pickedTokenInStorage = (tokenFromStorage===null) ? null : tokenFromStorage.contract;
  const pickedTokenSymbolInStorage = (tokenFromStorage===null) ? null : tokenFromStorage.symbol;
  const [selectedToken, setSelectedToken] = useState(pickedTokenInStorage || defaultToken);
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState(pickedTokenSymbolInStorage || defaultTokenSymbol);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const handleClose = (symbol, contract) => {
    setSelectedToken(contract);
    setSelectedTokenSymbol(symbol); 
    setPickedToken(contract);
    setPickedTokenSymbol(symbol);
    localStorage.setItem(account, JSON.stringify({symbol: symbol, contract: contract}));
    setOpenDialog(false);
  };

  return(
      <>
          <Tooltip title="Tokens">
              <IconButton onClick={handleClickOpen}>
                  <MonetizationOnOutlinedIcon fontSize='large' className={classes.icon} />
                  <Breakpoint customQuery="(min-width: 330px)">
                    <Typography variant='h6' className={classes.text} >
                      {selectedTokenSymbol}
                    </Typography>
                  </Breakpoint>
              </IconButton>
          </Tooltip>
          <PickTokenDialog selectedToken={selectedToken} selectedTokenSymbol={selectedTokenSymbol} open={openDialog} onClose={handleClose}
            defaultToken={defaultToken} defaultTokenSymbol={defaultTokenSymbol} />
      </>
  );
}

export default PickToken;