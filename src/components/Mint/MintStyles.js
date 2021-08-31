import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    button: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        padding: '0 30px',
        height: 54,
    },
    input: {
        height: 54,
    },
    text: {
        marginBottom: '25px',
    },
    minticon: {
        marginRight:'10px',
    },
    dialogcontent: {
        padding: theme.spacing(4, 5, 4),
    }
}));

export default useStyles; 