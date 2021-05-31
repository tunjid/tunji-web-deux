import {createMuiTheme} from "@material-ui/core";

export const theme = createMuiTheme({
    palette: {
        secondary: {
            main: "#4CDB85",
            contrastText: "#fff" //button text white instead of black
        },
        primary: {
            main: "#083042",
        }
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '"Muli"',
            'sans-serif'
        ].join(','),
        button: {
            textTransform: "none"
        },
    }
});

