import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Typography, AppBar, CssBaseline, Grid, 
    Toolbar, Container } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import  { Breakpoint } from 'react-socks';
import { useFormik } from 'formik';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts'
import { useContractFunction, useEthers, useContractCall } from '@usedapp/core';
import firebase from 'firebaseConfig';
import useStyles from 'pages/CreateToken/CreateTokenStyles';
import DisconnectButton from 'components/DisconnectButton/DisconnectButton';
import WalletModal from 'components/WalletModal/WalletModal';
import AuthApi from 'components/AuthApi/AuthApi';
import PickToken from 'components/PickToken/PickToken';
import Alert from 'components/Alert/Alert';

const methodInterface = new utils.Interface(['function lastContractAddress() public view returns (address)']);
function GetLastTokenAddress() {
	const [contractAddress] = useContractCall(
		{
			abi: methodInterface,
			address: '0xeBF40Bb17E0Ed39c58c9041618F70b3BE1Dd3D55',
			method: 'lastContractAddress',
			args: [],
		}
	) ?? []
	return contractAddress;
}

function CreateToken(props) {
	const classes = useStyles();
	const Auth = React.useContext(AuthApi);
	const [openInfoSnack, setOpenInfoSnack] = useState(false);
  	const [disabledInput, setDisabledInput] = useState(false);
	const [snackOpenedOnce, setSnackOpenedOnce] = useState(false);
	const history = useHistory();
	const { setPickedToken, setPickedTokenSymbol } = props;
	const lastTokenAddress = GetLastTokenAddress();

	const { account } = useEthers();
	const citInterface = new utils.Interface(['function newERC20Token(string memory name, string memory symbol, uint initialSupply) external']);
	const citContractAddress = '0xeBF40Bb17E0Ed39c58c9041618F70b3BE1Dd3D55';
	const contract = new Contract(citContractAddress, citInterface);
	const { send, state } = useContractFunction(contract, 'newERC20Token', { transactionName: 'Create ERC20 token'});

	const handleClickInfoSnack = () => {
		setOpenInfoSnack(true);
	};
	const handleCloseInfoSnack = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
		setOpenInfoSnack(false);
	};
	const handleSnackOpenedOnce = () => {
		setSnackOpenedOnce(true);
	};
	const callCreateToken = (name, symbol, supply) => {
		send(name, symbol, supply*10**8);
	}
	const formikCreateToken = useFormik({
		enableReinitialize: true,
		initialValues: {
			tokenName: '',
			tokenSymbol: '',
			initialSupply: '',
			tokenSymbolForDb: '',
		},
		validate: values => {
			const errors = {};
			const regExp = /^\d*(\.)?(\d{0,8})?$/
			if(!values.tokenName) {
				errors.tokenName = 'Required';
			}
			if(!values.tokenSymbol) {
				errors.tokenSymbol = 'Required';
			}
			if(!values.initialSupply) {
				errors.initialSupply = 'Required';
			}
			else if(isNaN(values.initialSupply)) {
				errors.initialSupply = 'You must enter a number';
			}
			else if(values.initialSupply < 0) {
				errors.initialSupply = 'You must enter a number that is at least zero';
			}
			else if(!regExp.test(values.initialSupply)) {
				errors.initialSupply = 'You can\'t have more than 8 decimals';
			}
			return errors;
		},
		onSubmit: values => {
			const tokenName = formikCreateToken.values.tokenName;
			const tokenSymbol = formikCreateToken.values.tokenSymbol;
			const initialSupply = formikCreateToken.values.initialSupply;
			formikCreateToken.setFieldValue('tokenSymbolForDb', tokenSymbol);
			setDisabledInput(true);
			callCreateToken(tokenName, tokenSymbol, initialSupply);
		}
	});

	useEffect(() => {
		if (state.status === 'Mining') {
			if(snackOpenedOnce === false) {
				handleClickInfoSnack();
				handleSnackOpenedOnce();
			}
		}
		else if (state.status === 'Success') {
			const delayInMilliseconds = 1000;
			setTimeout(function() {
				setDisabledInput(false);
				if (lastTokenAddress != null) {
					firebase.database().ref().child(account).update({
						[formikCreateToken.values.tokenSymbolForDb] : lastTokenAddress
					});
					state.status = 'None';
					localStorage.setItem(account, JSON.stringify({symbol: formikCreateToken.values.tokenSymbolForDb, contract: lastTokenAddress}));
					setPickedTokenSymbol(formikCreateToken.values.tokenSymbolForDb);
					setPickedToken(lastTokenAddress);
					return history.push('/dashboard');
				}
			}, delayInMilliseconds);
		}
		else {
		  setDisabledInput(false);
		}
	}, [state, account, lastTokenAddress, formikCreateToken.values.tokenSymbolForDb, setPickedToken, setPickedTokenSymbol, history])
	
	return(
		<>
			<CssBaseline />
			<AppBar position="relative">
				<Toolbar>
					<CreateOutlinedIcon className={classes.icon} />
					<Breakpoint customQuery="(min-width: 450px)">
						<Typography variant="h6">
							Create Token
						</Typography>
					</Breakpoint>
					<div className={classes.walletanddisconnect} >
						<PickToken setPickedToken={setPickedToken} setPickedTokenSymbol={setPickedTokenSymbol} />
						<WalletModal />
						<DisconnectButton auth={Auth} />
					</div>
				</Toolbar>
			</AppBar>
			<main>
				<div>
					<Container maxWidth="md" className={classes.container}>
						<Typography variant="h5" align="center" color="textSecondary" paragraph gutterBottom>
            				Enter name, symbol and supply to create new token
          				</Typography>
						<form onSubmit={formikCreateToken.handleSubmit} className={classes.form} >
							<Grid
								container
								direction="column"
								justifyContent="flex-start"
								alignItems="center"
								spacing={2}
							>
								<Grid item>
									<TextField 
										id="tokenName" 
										label="Token name"
										name="tokenName" 
										variant="outlined"
										onChange={formikCreateToken.handleChange}
										value={formikCreateToken.values.tokenName}
										error={formikCreateToken.errors.tokenName}
										helperText={formikCreateToken.errors.tokenName}
										InputProps={{ className: classes.input }}
										disabled={disabledInput}
									/>
								</Grid>
								<Grid item>
									<TextField 
										id="tokenSymbol" 
										label="Token symbol"
										name="tokenSymbol" 
										variant="outlined"
										onChange={formikCreateToken.handleChange}
										value={formikCreateToken.values.tokenSymbol}
										error={formikCreateToken.errors.tokenSymbol}
										helperText={formikCreateToken.errors.tokenSymbol}
										InputProps={{ className: classes.input }}
										disabled={disabledInput}
									/>
								</Grid>
								<Grid item>
									<TextField 
										id="initialSupply" 
										label="Initial supply"
										name="initialSupply" 
										variant="outlined"
										onChange={formikCreateToken.handleChange}
										value={formikCreateToken.values.initialSupply}
										error={formikCreateToken.errors.initialSupply}
										helperText={formikCreateToken.errors.initialSupply}
										InputProps={{ className: classes.input }}
										disabled={disabledInput}
									/>
								</Grid>
								<Grid item>
									<Button type="submit" variant="contained" color="secondary" disabled={!account || disabledInput} className={classes.button}>
                    					{disabledInput !== true ? <>Create token</> :
										<CircularProgress color='inherit' />}
                  					</Button>
								</Grid>
							</Grid>
						</form>
					</Container>
				</div>
			</main>
			<Box textAlign="center">
				<Button variant="contained" component={Link} to="/dashboard" className={classes.backbutton} disabled={disabledInput}>
					Back to dashboard
				</Button>
			</Box>
			<Snackbar open={openInfoSnack} autoHideDuration={6000} onClose={handleCloseInfoSnack}>
                <Alert onClose={handleCloseInfoSnack} severity="info">
                    Create token transaction is submitted!
                </Alert>
            </Snackbar>
		</>
	);
}

export default CreateToken;