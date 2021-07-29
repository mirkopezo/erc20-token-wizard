import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    table: {
        display: 'block',
        minWidth: '100%',
        overflowX: 'auto',
    },
}))

function TransferHistory(props) {
    const classes = useStyles();
    if(props.addr === ''){ return(null); }
    else{
        let exploreWallet = JSON.parse(localStorage.getItem(props.addr));
        if(exploreWallet.transactions.length === 0) return(null);
        else {
            return(
                <React.Fragment>
                    <Typography variant="h6" gutterBottom>
                        Transaction History
                    </Typography>
                    <Table size="small" className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>From</TableCell>
                                <TableCell>To</TableCell>
                                <TableCell>Value</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {exploreWallet.transactions.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.from}</TableCell>
                                <TableCell>{row.to}</TableCell>
                                <TableCell>{row.value}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </React.Fragment>
            );
        }
    }
}

export default TransferHistory;