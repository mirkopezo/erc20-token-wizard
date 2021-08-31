import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(10, 0, 6),
    },
    icon: {
        marginRight: '10px',
    },
    button: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        padding: '0 30px',
        height: 54,
        width: 210,
    },
    input: {
        height: 54,
        width: 210,
    },
    walletanddisconnect: {
        marginLeft: 'auto',
    },
    backbutton: {
        width: 210,
        marginTop: '25px',
        marginBottom: '50px',
    },
    form: {
        padding: theme.spacing(3, 0, 0),
    }
}));

export default useStyles;