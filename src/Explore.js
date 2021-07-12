import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import Web3 from 'web3';

function Explore() {
    const formikExplore = useFormik({
				enableReinitialize: true,
        initialValues: {
          exploreaddress: '',
					explorebalance: '',
        },
        validate: values => {
          const errors = {};
          if(!values.exploreaddress) {
            errors.exploreaddress = 'Required';
          }
          else if(!Web3.utils.isAddress(values.exploreaddress)) {
            errors.exploreaddress = 'Ethereum address is not valid';
          }
          return errors;
        },
        onSubmit: values => {
					const exploreAddress = formikExplore.values.exploreaddress;
					let exploreAddressBalance = localStorage.getItem(exploreAddress);
      		if (exploreAddressBalance == null) {
        		localStorage.setItem(exploreAddress,'0');
        		exploreAddressBalance = '0';
      		}
					formikExplore.setFieldValue('explorebalance', exploreAddressBalance);
        }
    });

    return(
        <div>
          <h1>This is Explore!</h1>
          <Link to='/dashboard'>Back to dashboard</Link>
          <form onSubmit={formikExplore.handleSubmit}>
            <TextField 
              id="exploreaddress" 
              label="Address to explore"
              name="exploreaddress" 
              variant="outlined"
              onChange={formikExplore.handleChange}
              value={formikExplore.values.exploreaddress}
              error={formikExplore.errors.exploreaddress}
              helperText={formikExplore.errors.exploreaddress}
            />
            <Button type="submit" variant="contained" color="secondary">
              Explore
            </Button>
						<div>Balance of this address is: {formikExplore.values.explorebalance}</div>
          </form>
        </div>
    );
}

export default Explore;