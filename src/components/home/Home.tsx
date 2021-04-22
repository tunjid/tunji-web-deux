import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import HomeHeader from "./HomeHeader";
import Cards from "../cards/Cards";

const useStyles = makeStyles(() => createStyles({
        root: {},
        cards: {
            position: 'relative',
            top: '-10vh',
            'z-index': '1000',
        },
    }
));

const Home = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <HomeHeader/>
            <div className={classes.cards}>
                <Cards/>
            </div>
        </div>
    );
}

export default Home;
