import React from 'react';
import { Tooltip, IconButton } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useEthers } from '@usedapp/core';
import AuthApi from 'components/AuthApi/AuthApi';
import useStyles from 'components/DisconnectButton/DisconnectButtonStyle';

function DisconnectButton() {
    const classes = useStyles();
    const Auth = React.useContext(AuthApi);
    const { deactivate } = useEthers();

    const handleDisconnect = () => {
        deactivate();
        Auth.setAuth(false);
    }

    return(
        <Tooltip title="Disconnect Wallet">
            <IconButton onClick={handleDisconnect} >
                <ExitToAppIcon fontSize='large' className={classes.icon} />
            </IconButton>
        </Tooltip>
    );
}

export default DisconnectButton;