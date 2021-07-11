import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useFormik } from 'formik';
import Web3 from 'web3';
import useStyles from './styles';
import AuthApi from './AuthApi';
import Cookies from 'js-cookie';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/mirkopezo">
        Mirko Pezo
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const validate = values => {
  const errors = {};
  if(!values.ethaddress) {
    errors.ethaddress = 'Required';
  }
  else if (!Web3.utils.isAddress(values.ethaddress)) {
    errors.ethaddress = 'Ethereum address is not valid';
  }
  return errors;
};

export default function SignIn() {
  const Auth = React.useContext(AuthApi);

  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      ethaddress: '',
    },
    validate,
    onSubmit: values => {
      Auth.setAuth(true);
      Cookies.set("wallet",formik.values.ethaddress);
    }
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Connect to a wallet
        </Typography>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="ethaddress"
            label="Ethereum address"
            name="ethaddress"
            autoFocus
            onChange={formik.handleChange}
            value={formik.values.ethaddress}
            error={formik.errors.ethaddress}
            helperText={formik.errors.ethaddress}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Connect
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}