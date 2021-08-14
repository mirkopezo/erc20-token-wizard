import React from 'react';
import { useTokenBalance } from '@usedapp/core';
import { formatUnits } from 'ethers/lib/utils';

function ReadBalance(props) {
    const citContractAddress = '0xd2539E040A79D9597310D96aD17C96518168A63F';
    const citBalance = useTokenBalance(citContractAddress, props.address);

    return(
        <>
            {props.text} {citBalance && formatUnits(citBalance, 8)} CIT
        </>
    );
}

export default ReadBalance;