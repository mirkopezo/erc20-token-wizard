import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(20, 0, 6),
    },
    icon: {
        marginRight: '10px',
    },
    walletanddisconnect: {
        marginLeft: 'auto',
    },
    buttons: {
        marginTop: '30px',
    },
}));

export default useStyles; 