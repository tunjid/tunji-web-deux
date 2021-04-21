import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';


const useStyles = makeStyles(() => createStyles({
        root: {
            background: 'linear-gradient(to bottom, #000000, #FFFFFF)',
            minHeight: '200vh',
        }
    }
));


const Cards = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
        </div>
    );
}

export default Cards;
