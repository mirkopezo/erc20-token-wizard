import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        borderRadius: 15,
    },
    tableHeader: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.getContrastText(theme.palette.primary.main)
    },
    avatar: {
        width: theme.spacing(9), 
        height: theme.spacing(9),
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.getContrastText(theme.palette.primary.dark)
    },
    table: {
        width: '310px'
    }
}));

export default useStyles;