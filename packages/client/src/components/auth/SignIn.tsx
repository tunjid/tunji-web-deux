import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch } from "react-redux";
import { PersistentUiActions } from "../../actions/PersistentUi";
import { theme } from "../../styles/PersistentUi";
import Button from "@material-ui/core/Button";
import { AuthActions, SignInArgs } from "../../actions/Auth";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            'flex-direction': 'column',
            'justify-content': 'center',
            'align-items': 'center',
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
    }),
);

const SignIn = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [state, setState] = useState<SignInArgs>({username: '', password: ''});

    useEffect(() => {
        dispatch(PersistentUiActions.modifyAppBar({
            hasAppBarShadow: true,
            hasAppBarSpacer: true,
            appBarColor: theme.palette.primary.dark
        }));
    }, [dispatch]);

    return (
        <form
            className={classes.root} noValidate autoComplete="on">
            <TextField
                required
                id="outlined-required"
                label="username"
                variant="outlined"
                onChange={(event) => {
                    setState({...state, username: event.target.value})
                }}
            />
            <TextField
                id="outlined-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                onChange={(event) => {
                    setState({...state, password: event.target.value})
                }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={() => dispatch(AuthActions.signIn(state))}
            >
                Sign In
            </Button>
        </form>
    );
}

export default SignIn
