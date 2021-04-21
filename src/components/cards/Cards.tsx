import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { AppTab, PersistentUiState } from "../../reducers/PersistentUi";
import { createSelector, OutputSelector } from "reselect";
import { StoreState } from "../../types";
import { shallowEqual, useSelector } from "react-redux";
import AppCard, { CardInfo } from "./Card";
import { Tab } from "@material-ui/core";


const useStyles = makeStyles(() => createStyles({
        root: {
            background: 'linear-gradient(to bottom, #000000, #FFFFFF)',
            minHeight: '200vh',
        }
    }
));


interface Props {
    cards: CardInfo[];
}

const cardsFromState: (state: StoreState) => CardInfo[] = (state: StoreState) => {
    switch (state.persistentUI.selectedTab.route) {
        case 'projects': {
            console.log(`ARGGGG: ${JSON.stringify(state)}`)
            return state.projects.cards;
        }
        default: {
            console.log(`ARGGGG: ${JSON.stringify(state.projects)}`)
            return [];
        }
    }
};
const selector: OutputSelector<StoreState, Props, (res: StoreState) => Props> = createSelector(
    state => state,
    (state: StoreState) => {
        return {cards: cardsFromState(state)}
    }
);

const Cards = () => {
    const classes = useStyles();
    const {cards}: Props = useSelector(selector, shallowEqual);

    return (
        <div className={classes.root}>
            {cards.map(card => <AppCard cardInfo={card}/>)}
        </div>
    );
}

export default Cards;
