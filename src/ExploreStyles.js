import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(8, 0, 6),
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
    },
    input: {
        height: 54,
    },
    text: {
        marginTop: '20px',
        marginBottom: '25px',
    },
}));

export default useStyles;