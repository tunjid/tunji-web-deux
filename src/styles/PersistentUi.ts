import {createMuiTheme} from "@material-ui/core";

export const theme = createMuiTheme({
    palette: {
        secondary: {
            main: "#0d47a1",
        },
        primary: {
            main: "#880e4f"
        }
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '"Muli"',
            'sans-serif'
        ].join(',')
    }
});

