import React from 'react';
import { useTokenBalance } from '@usedapp/core';
import { formatUnits } from 'ethers/lib/utils';

function ReadBalance(props) {
    const tokenContractAddress = props.pickedToken;
    const tokenSymbol = props.pickedTokenSymbol;
    const tokenBalance = useTokenBalance(tokenContractAddress, props.address);

    return(
        <>
            {props.text} {tokenBalance && formatUnits(tokenBalance, 8)} {tokenSymbol}
        </>
    );
}

export default ReadBalance;