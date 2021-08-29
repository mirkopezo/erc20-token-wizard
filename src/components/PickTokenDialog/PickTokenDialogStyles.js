import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.getContrastText(theme.palette.primary.dark)
    },
    token: {
        width: '250px', 
        height:'65px'
    },
    copybutton: {
        cursor:'pointer'
    }
}));

export default useStyles;