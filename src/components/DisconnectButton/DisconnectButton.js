import React from 'react';
import { Tooltip, IconButton } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AuthApi from 'components/AuthApi/AuthApi';
import { useEthers } from '@usedapp/core';

function DisconnectButton() {
    const Auth = React.useContext(AuthApi);
    const { deactivate } = useEthers();

    const handleDisconnect = () => {
        deactivate();
        Auth.setAuth(false);
    }

    return(
        <Tooltip title="Disconnect Wallet">
            <IconButton onClick={handleDisconnect} >
                <ExitToAppIcon fontSize='large' style={{fill:'white'}} />
            </IconButton>
        </Tooltip>
    );
}

export default DisconnectButton;