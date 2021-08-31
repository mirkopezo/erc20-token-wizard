import React from 'react';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import { Typography, Grid, TableHead, TableRow, TableBody } from '@material-ui/core';
import useStyles from 'components/ExploreTable/ExploreTableStyles';
import ReadBalance from 'components/ReadBalance/ReadBalance';


function ExploreTable(props) {
    const classes = useStyles();
    const {defaultToken, defaultTokenSymbol, addressForTable, contractsArray} = props;

    return(
        <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
        >
            <Grid item>
                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table className={classes.table} >
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.tableHeader}>
                                    <Typography variant='h6'>
                                        Token
                                    </Typography>
                                </TableCell>
                                <TableCell className={classes.tableHeader} align='right'>
                                    <Typography variant='h6'>
                                        Balance
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={defaultToken}>
                                <TableCell component="th" scope="row">
                                    <Avatar className={classes.avatar}>{defaultTokenSymbol}</Avatar>
                                </TableCell>
                                <TableCell align='right'>
                                    <Typography variant='h6'>
                                        <ReadBalance address={addressForTable} pickedToken={defaultToken} 
                                        pickedTokenSymbol={defaultTokenSymbol} />
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            {contractsArray.map(([symbol, contract]) => (
                                <TableRow key={contract}>
                                    <TableCell component="th" scope="row">
                                        <Avatar className={classes.avatar}>{symbol}</Avatar>
                                    </TableCell>
                                    <TableCell align='right'>
                                        <Typography variant='h6'>
                                            <ReadBalance address={addressForTable} pickedToken={contract} 
                                            pickedTokenSymbol={symbol} />
                                        </Typography>
                                    </TableCell>
                                </TableRow> 
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );

}

export default ExploreTable;